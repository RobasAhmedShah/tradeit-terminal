import { PortfolioHolding } from '../data/mockPortfolio';
import { Stock } from '../types';

export type PortfolioRange = '1D' | '1W' | '1M' | '3M' | 'YTD';
export type HoldingSortKey = 'value' | 'name' | 'change' | 'qty';

const RANGE_PERF_KEY: Record<PortfolioRange, keyof NonNullable<Stock['performance']>> = {
  '1D': 'oneDay',
  '1W': 'oneWeek',
  '1M': 'oneMonth',
  '3M': 'threeMonth',
  YTD: 'ytd',
};

const RANGE_LABEL: Record<PortfolioRange, string> = {
  '1D': "Today's P/L",
  '1W': '1 Week P/L',
  '1M': '1 Month P/L',
  '3M': '3 Month P/L',
  YTD: 'YTD P/L',
};

export function getRangeLabel(range: PortfolioRange): string {
  return RANGE_LABEL[range];
}

function toNum(value: number | string | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
}

export function getRangeMetrics(
  holdings: PortfolioHolding[],
  getStock: (symbol: string) => Stock | undefined,
  range: PortfolioRange
) {
  let periodPnl = 0;
  let baseValue = 0;

  for (const h of holdings) {
    const stock = getStock(h.symbol);
    const perfKey = RANGE_PERF_KEY[range];
    const pct =
      range === '1D'
        ? h.dayChangePct
        : toNum(stock?.performance?.[perfKey]) || h.dayChangePct;
    const contribution = h.currentValue * (pct / 100);
    periodPnl += contribution;
    baseValue += h.currentValue;
  }

  const periodPnlPct =
    baseValue > 0 ? Math.round((periodPnl / baseValue) * 10000) / 100 : 0;

  return { periodPnl, periodPnlPct, label: getRangeLabel(range) };
}

export function sortHoldings(
  holdings: PortfolioHolding[],
  sortKey: HoldingSortKey
): PortfolioHolding[] {
  const sorted = [...holdings];
  switch (sortKey) {
    case 'name':
      return sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
    case 'change':
      return sorted.sort((a, b) => b.dayChangePct - a.dayChangePct);
    case 'qty':
      return sorted.sort((a, b) => b.qty - a.qty);
    case 'value':
    default:
      return sorted.sort((a, b) => b.currentValue - a.currentValue);
  }
}
