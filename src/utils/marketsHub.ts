import { Stock } from '../types';
import { NewsPost } from '../data/mockNews';
import { MOCK_MARKET_STOCKS } from '../data/mockStocks';

export type MarketsTab = 'watchlist' | 'movers' | 'news';
export type MoverSegment = 'gainers' | 'losers' | 'active';
export type WatchlistSort = 'name' | 'change' | 'price';
export type MoverSort = 'change' | 'volume' | 'price' | 'name';

export function parseMarketsTab(value?: string): MarketsTab {
  if (value === 'movers' || value === 'news') return value;
  return 'watchlist';
}

export function parseMoverSegment(value?: string): MoverSegment {
  if (value === 'losers' || value === 'active') return value;
  return 'gainers';
}

export function getMostActiveStocks(): Stock[] {
  return [...MOCK_MARKET_STOCKS]
    .filter((s) => (s.volume ?? 0) > 0)
    .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
    .slice(0, 20);
}

export function sortStocks(stocks: Stock[], sort: WatchlistSort | MoverSort): Stock[] {
  const list = [...stocks];
  switch (sort) {
    case 'name':
      return list.sort((a, b) => a.symbol.localeCompare(b.symbol));
    case 'price':
      return list.sort((a, b) => b.price - a.price);
    case 'volume':
      return list.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
    case 'change':
    default:
      return list.sort((a, b) => b.changePercent - a.changePercent);
  }
}

export function filterStocks(stocks: Stock[], query: string): Stock[] {
  const q = query.trim().toLowerCase();
  if (!q) return stocks;
  return stocks.filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  );
}

export function filterNews(posts: NewsPost[], query: string): NewsPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.tickers.some((t) => t.toLowerCase().includes(q))
  );
}

export function formatVolume(vol?: number): string {
  if (!vol) return '—';
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return String(vol);
}

export function tickStockPrice(stock: Stock): Stock {
  const delta = (Math.random() - 0.5) * stock.price * 0.0012;
  const price = Math.max(0.01, Math.round((stock.price + delta) * 100) / 100);
  const changeValue = Math.round(((stock.changeValue ?? 0) + delta) * 100) / 100;
  const base = price - changeValue;
  const changePercent = base !== 0 ? (changeValue / base) * 100 : stock.changePercent;
  return {
    ...stock,
    price,
    buyPrice: Math.round((price - 0.5) * 100) / 100,
    sellPrice: Math.round((price + 0.5) * 100) / 100,
    changeValue,
    changePercent: Math.round(changePercent * 100) / 100,
    isPositive: changeValue >= 0,
  };
}
