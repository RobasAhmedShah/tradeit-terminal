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
  totalValue: number;
  todayPnl: number;
  todayPnlPct: number;
  totalReturn: number;
  totalReturnPct: number;
  invested: number;
  buyingPower: number;
}

/** Static seed data — live values come from PortfolioContext */
export const INITIAL_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'PIAHCLB',
    name: 'PIA Holding Co.',
    qty: 500,
    currentValue: 88030,
    avgCost: 176.06,
    dayChange: 530,
    dayChangePct: 0.61,
    chartPath: 'M0,20 L10,10 L20,15 L30,5 L40,0',
  },
  {
    symbol: 'SAZEW',
    name: 'Sazgar Engg.',
    qty: 8,
    currentValue: 16943.92,
    avgCost: 2118.5,
    dayChange: 25.92,
    dayChangePct: 0.15,
    chartPath: 'M0,10 L10,20 L20,5 L30,15 L40,0',
  },
];

/** @deprecated Use usePortfolio() — kept for static fallbacks */
export const MOCK_PORTFOLIO_HOLDINGS = INITIAL_PORTFOLIO_HOLDINGS;

export const PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalValue: 104_973.92,
  todayPnl: 6_357.68,
  todayPnlPct: 5.71,
  totalReturn: 6_357.68,
  totalReturnPct: 5.71,
  invested: 111_331.6,
  buyingPower: 1_589_666,
};

export function formatPortfolioRs(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
