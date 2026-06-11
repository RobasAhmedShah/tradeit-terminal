export interface StockPerformance {
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  threeMonth: number;
  ytd: number;
}

export interface StockMetrics {
  priceToBook: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
}

export interface AIInsight {
  badge: 'Bullish' | 'Bearish' | 'Neutral';
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
  logoUrl?: string;
  buyPrice?: number;
  sellPrice?: number;
  changeValue?: number;
  volume?: number;
  isShariahCompliant?: boolean;
  logoColor?: string;
  sparklineTrend?: 'up' | 'down';
  open?: number;
  high?: number;
  low?: number;
  lcl?: number;
  avgVolume?: string;
  marketCap?: string;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  annualDividend?: number;
  exDividendDate?: string;
  payDate?: string;
  dividendFreq?: string;
  sector?: string;
  industry?: string;
  incorporated?: string;
  employees?: string;
  website?: string;
  about?: string;
  performance?: StockPerformance;
  metrics?: StockMetrics;
  aiInsight?: AIInsight;
  news?: StockNews[];
}

export const MOCK_WATCHLIST: Stock[] = [
  { 
    id: '1', symbol: 'AABS', name: 'Al-Abbas Sugar Mills', price: 904.00, buyPrice: 903.50, sellPrice: 904.00,
    changePercent: 1.68, changeValue: 15.00, isPositive: true, sparklineTrend: 'up', isShariahCompliant: true,
    open: 892.50, high: 912.50, low: 888.00, volume: 2900000, avgVolume: '2.21M', marketCap: 'Rs 69.42B',
  },
  { id: '2', symbol: 'PIAHCLB', name: 'PIA Holding Co...', price: 17606.00, changePercent: 0.61, isPositive: true },
  { id: '3', symbol: 'SAZEW', name: 'Sazgar Engg.', price: 2118.50, changePercent: 0.15, isPositive: true },
  { id: '4', symbol: 'FANM', name: 'Fauji Fertiliz...', price: 7.53, changePercent: 15.31, isPositive: true },
];

export const MOCK_TOP_GAINERS: Stock[] = [
  { id: 'g1', symbol: 'FANM', name: '', price: 0, changePercent: 15.31, isPositive: true },
  { id: 'g2', symbol: 'FFLM', name: '', price: 0, changePercent: 11.53, isPositive: true },
  { id: 'g3', symbol: 'LEUL', name: '', price: 0, changePercent: 10.00, isPositive: true },
  { id: 'g4', symbol: 'FATM', name: '', price: 0, changePercent: 9.21, isPositive: true },
];

export const MOCK_TOP_LOSERS: Stock[] = [
  { id: 'l1', symbol: 'IDSM', name: '', price: 0, changePercent: -10.00, isPositive: false },
  { id: 'l2', symbol: 'PAKQATAR', name: '', price: 0, changePercent: -9.03, isPositive: false },
  { id: 'l3', symbol: 'ZUMA', name: '', price: 0, changePercent: -5.71, isPositive: false },
  { id: 'l4', symbol: 'PQGTL', name: '', price: 0, changePercent: -5.55, isPositive: false },
];

export const MOCK_MARKET_STOCKS: Stock[] = [
  { 
    id: 'm1', symbol: 'FANM', name: 'Fauji Fertilizer Co. Ltd.', price: 904.00, buyPrice: 903.50, sellPrice: 904.50, 
    changePercent: 1.69, changeValue: 15.00, isPositive: true, sparklineTrend: 'up', isShariahCompliant: true,
    open: 882.0, high: 910.00, low: 888.00, lcl: 842.0, volume: 1250000, avgVolume: '2.14M', marketCap: '215.45B',
    peRatio: 5.32, eps: 169.92, dividendYield: 5.42, annualDividend: 12.95, exDividendDate: 'May 22, 2025', 
    payDate: 'Jun 12, 2025', dividendFreq: 'Semi-Annual', sector: 'Fertilizer', industry: 'Fertilizer',
    incorporated: '1978', employees: '3,482', website: 'ffc.com.pk',
    about: 'Fauji Fertilizer Company Limited is one of Pakistan’s largest urea fertilizer manufacturers and a key player in the agriculture value chain.',
    performance: {
      oneDay: 1.69,
      oneWeek: 6.28,
      oneMonth: 11.34,
      threeMonth: 24.81,
      ytd: 19.72
    },
    metrics: {
      priceToBook: 1.48,
      roe: 24.12,
      debtToEquity: 0.24,
      currentRatio: 2.15
    },
    aiInsight: {
      badge: 'Bullish',
      text: 'FFC remains a sector leader with strong margins and healthy dividend yield. Demand outlook remains stable.'
    },
    news: [
      { id: 'n1', title: 'FFC announces record urea production in May 2025', source: 'Dawn News', time: '1h ago' },
      { id: 'n2', title: 'FFC declares interim dividend of Rs 12.95 per share', source: 'Business Recorder', time: '3h ago' }
    ]
  },
  { 
    id: 'm2', symbol: 'FFLM', name: 'Fauji Fertilizer Bin Qasim', price: 9.67, buyPrice: 9.66, sellPrice: 9.68, 
    changePercent: 11.53, changeValue: 1.00, isPositive: true, sparklineTrend: 'up', isShariahCompliant: true,
    open: 8.50, high: 9.80, low: 8.40, volume: 4500000, avgVolume: '3.2M', marketCap: '12.4B',
    peRatio: 12.5, eps: 0.8, dividendYield: 2.1, about: 'Fauji Fertilizer Bin Qasim is a leading fertilizer manufacturer.'
  },
  { id: 'm3', symbol: 'FTSM', name: 'Fauji Cement Company', price: 23.09, buyPrice: 23.07, sellPrice: 23.11, changePercent: 10.01, changeValue: 2.10, isPositive: true, sparklineTrend: 'up' },
  { id: 'm4', symbol: 'REDCO', name: 'Pak Suzuki Motors', price: 28.68, buyPrice: 28.65, sellPrice: 28.70, changePercent: 10.01, changeValue: 2.61, isPositive: true, sparklineTrend: 'up' },
  { id: 'm5', symbol: 'BPL', name: 'Bata Pakistan Ltd.', price: 56.86, buyPrice: 56.80, sellPrice: 56.90, changePercent: 10.00, changeValue: 5.17, isPositive: true, sparklineTrend: 'up' },
  { id: 'm6', symbol: 'PSO', name: 'Pakistan State Oil', price: 186.35, buyPrice: 186.10, sellPrice: 186.60, changePercent: 6.92, changeValue: 12.05, isPositive: true, sparklineTrend: 'up' },
  { id: 'm7', symbol: 'HBL', name: 'Habib Bank Ltd.', price: 210.75, buyPrice: 210.50, sellPrice: 211.00, changePercent: 4.27, changeValue: 8.61, isPositive: true, sparklineTrend: 'up' },
  { id: 'm8', symbol: 'OGDC', name: 'Oil & Gas Dev. Company', price: 119.80, buyPrice: 119.60, sellPrice: 120.00, changePercent: -2.45, changeValue: -3.00, isPositive: false, sparklineTrend: 'down' },
];
