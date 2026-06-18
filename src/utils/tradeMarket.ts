import { Stock } from '../types';

export type MarketFilter =
  | 'All'
  | 'Shariah'
  | 'KSE 100'
  | 'KSE 30'
  | 'Top Volume'
  | 'Top Gainers'
  | 'Top Losers';

export type SortField = 'Ranking' | 'Price' | 'Change %' | 'Dividend' | 'Volume';

export const MARKET_FILTERS: MarketFilter[] = [
  'All',
  'Shariah',
  'KSE 100',
  'KSE 30',
  'Top Volume',
  'Top Gainers',
  'Top Losers',
];

export const SORT_FIELDS: SortField[] = ['Ranking', 'Price', 'Change %', 'Dividend', 'Volume'];

const DEFAULT_SORT_DIRECTION: Record<SortField, 'asc' | 'desc'> = {
  Ranking: 'desc',
  Price: 'desc',
  'Change %': 'desc',
  Dividend: 'desc',
  Volume: 'desc',
};

function parseDividendYield(stock: Stock): number {
  const value = stock.dividendYield;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
}

export function getDefaultSortDirection(field: SortField): 'asc' | 'desc' {
  return DEFAULT_SORT_DIRECTION[field];
}

export function searchStocks(stocks: Stock[], query: string): Stock[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return stocks;

  return stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(normalized) ||
      stock.name.toLowerCase().includes(normalized)
  );
}

export function filterTradeStocks(
  stocks: Stock[],
  filter: MarketFilter,
  indexSets: { kse100: Set<string>; kse30: Set<string> }
): Stock[] {
  switch (filter) {
    case 'Shariah':
      return stocks.filter((stock) => stock.isShariahCompliant);
    case 'KSE 100':
      return stocks.filter((stock) => indexSets.kse100.has(stock.symbol));
    case 'KSE 30':
      return stocks.filter((stock) => indexSets.kse30.has(stock.symbol));
    case 'Top Gainers':
      return stocks.filter((stock) => stock.isPositive);
    case 'Top Losers':
      return stocks.filter((stock) => !stock.isPositive);
    case 'Top Volume':
      return stocks.filter((stock) => (stock.volume ?? 0) > 0);
    default:
      return stocks;
  }
}

export function sortTradeStocks(
  stocks: Stock[],
  field: SortField,
  direction: 'asc' | 'desc'
): Stock[] {
  const sorted = [...stocks];
  const multiplier = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (field) {
      case 'Ranking':
        return multiplier * ((a.volume ?? 0) - (b.volume ?? 0));
      case 'Price':
        return multiplier * (a.price - b.price);
      case 'Change %':
        return multiplier * (a.changePercent - b.changePercent);
      case 'Dividend':
        return multiplier * (parseDividendYield(a) - parseDividendYield(b));
      case 'Volume':
        return multiplier * ((a.volume ?? 0) - (b.volume ?? 0));
      default:
        return 0;
    }
  });

  return sorted;
}

export function getTradeMarketList(
  stocks: Stock[],
  options: {
    searchQuery: string;
    filter: MarketFilter;
    sortField: SortField | null;
    sortDirection: 'asc' | 'desc';
    indexSets: { kse100: Set<string>; kse30: Set<string> };
  }
): Stock[] {
  let result = searchStocks(stocks, options.searchQuery);
  result = filterTradeStocks(result, options.filter, options.indexSets);

  if (options.sortField) {
    return sortTradeStocks(result, options.sortField, options.sortDirection);
  }

  if (options.filter === 'Top Gainers') {
    return sortTradeStocks(result, 'Change %', 'desc');
  }
  if (options.filter === 'Top Losers') {
    return sortTradeStocks(result, 'Change %', 'asc');
  }
  if (options.filter === 'Top Volume') {
    return sortTradeStocks(result, 'Volume', 'desc');
  }

  return result;
}
