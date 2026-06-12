export interface StockPerformance {
  oneDay: number | string;
  oneWeek: number | string;
  oneMonth: number | string;
  threeMonth: number | string;
  ytd: number | string;
}

export interface StockMetrics {
  priceToBook: number | string;
  roe: number | string;
  debtToEquity: number | string;
  currentRatio: number | string;
}

export interface AIInsight {
  badge: 'Bullish' | 'Bearish' | 'Neutral' | string;
  text: string;
}

export interface StockNews {
  id: string;
  title: string;
  source: string;
  time: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
  buyPrice?: number;
  sellPrice?: number;
  changeValue?: number;
  sparklineTrend?: 'up' | 'down' | 'flat';
  isShariahCompliant?: boolean;
  logoUrl?: string;
  logoColor?: string;
  sector?: string;
  industry?: string;
  incorporated?: string;
  employees?: string;
  website?: string;
  open?: number;
  high?: number;
  low?: number;
  lcl?: number;
  volume?: number;
  avgVolume?: string | number;
  marketCap?: string | number;
  about?: string;
  peRatio?: string | number;
  eps?: string | number;
  dividendYield?: number | string;
  annualDividend?: string | number;
  dividendFreq?: string;
  exDividendDate?: string;
  payDate?: string;
  performance?: StockPerformance;
  metrics?: StockMetrics;
  aiInsight?: AIInsight;
  news?: StockNews[];
}

export interface OrderBookLevel {
  price: number;
  qty: number;
}

export interface TradeExecution {
  id: string;
  price: number;
  qty: number;
  time: string;
  type: 'buy' | 'sell';
}
