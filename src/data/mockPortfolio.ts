export interface PortfolioHolding {
  symbol: string;
  name: string;
  qty: number;
  currentValue: number;
  avgCost: number;
  dayChange: number;
  dayChangePct: number;
  chartPath: string;
}

export interface PortfolioSummary {
  /** Holdings market value + available cash (buying power) */
  totalValue: number;
  /** Market value of stock holdings only */
  holdingsValue: number;
  todayPnl: number;
  todayPnlPct: number;
  totalReturn: number;
  totalReturnPct: number;
  invested: number;
  buyingPower: number;
}

export function formatPortfolioRs(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
