export type FuturesSide = 'Long' | 'Short';
export type FuturesOrderType = 'Limit' | 'Market' | 'Stop';
export type FuturesMarginMode = 'Cross' | 'Isolated';
export type FuturesTab = 'chart' | 'orderbook' | 'trades' | 'info';

export interface FuturesContract {
  symbol: string;
  name: string;
  expiry: string;
  exchange: string;
  markPrice: number;
  indexPrice: number;
  changeValue: number;
  changePercent: number;
  isPositive: boolean;
  high24h: number;
  low24h: number;
  volume24h: number;
  fundingRate: number;
  nextFundingIn: string;
}

export interface FuturesBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface FuturesTrade {
  id: string;
  price: number;
  qty: number;
  time: string;
  side: 'buy' | 'sell';
}

export interface FuturesPosition {
  id: string;
  side: FuturesSide;
  symbol: string;
  expiry: string;
  leverage: number;
  sizeLots: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
}

export interface FuturesOpenOrder {
  id: string;
  symbol: string;
  expiry: string;
  side: FuturesSide;
  orderType: FuturesOrderType;
  price: number;
  quantity: number;
  leverage: number;
  marginMode: FuturesMarginMode;
  requiredMargin: number;
  status: 'Pending';
  createdTime: string;
}

export interface FuturesOrderPayload {
  symbol: string;
  companyName: string;
  futuresSide: FuturesSide;
  orderType: FuturesOrderType;
  price: number;
  quantity: number;
  leverage: number;
  marginMode: FuturesMarginMode;
  totalCost: number;
  currentMarketPrice: number;
  expiry?: string;
  productType: 'FUTURES';
}

export type FuturesPortfolioTab = 'positions' | 'open_orders' | 'history';

export type FuturesHistoryType = 'position_closed' | 'order_filled' | 'order_cancelled';

export interface FuturesHistoryItem {
  id: string;
  type: FuturesHistoryType;
  symbol: string;
  side: FuturesSide;
  quantity: number;
  price: number;
  realizedPnl?: number;
  leverage?: number;
  orderType?: FuturesOrderType;
  timestamp: string;
}

export interface FuturesCandle {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
}

export const DEFAULT_FUTURES_CONTRACT: FuturesContract = {
  symbol: 'KSE100-PERP',
  name: 'KSE-100 Futures',
  expiry: 'Perpetual',
  exchange: 'PSX',
  markPrice: 104975.5,
  indexPrice: 104972.92,
  changeValue: 6358.25,
  changePercent: 6.45,
  isPositive: true,
  high24h: 105120,
  low24h: 98540.75,
  volume24h: 18742,
  fundingRate: 0.0102,
  nextFundingIn: '02:14:33',
};

export const FUTURES_CONTRACTS: FuturesContract[] = [
  DEFAULT_FUTURES_CONTRACT,
  {
    symbol: 'KSE30-PERP',
    name: 'KSE-30 Futures',
    expiry: 'Perpetual',
    exchange: 'PSX',
    markPrice: 45280.25,
    indexPrice: 45276.1,
    changeValue: 1240.5,
    changePercent: 2.82,
    isPositive: true,
    high24h: 45410,
    low24h: 43980,
    volume24h: 8420,
    fundingRate: 0.0088,
    nextFundingIn: '02:14:33',
  },
  {
    symbol: 'OGDC-JUN25',
    name: 'OGDC Futures',
    expiry: 'Jun 2025',
    exchange: 'PSX',
    markPrice: 128.45,
    indexPrice: 128.42,
    changeValue: 2.15,
    changePercent: 1.7,
    isPositive: true,
    high24h: 129.1,
    low24h: 126.2,
    volume24h: 45200,
    fundingRate: 0.0051,
    nextFundingIn: '02:14:33',
  },
  {
    symbol: 'LUCK-PERP',
    name: 'Lucky Cement Futures',
    expiry: 'Perpetual',
    exchange: 'PSX',
    markPrice: 892.5,
    indexPrice: 891.8,
    changeValue: -12.3,
    changePercent: -1.36,
    isPositive: false,
    high24h: 908,
    low24h: 885,
    volume24h: 22100,
    fundingRate: -0.0024,
    nextFundingIn: '02:14:33',
  },
];

export const MOCK_FUTURES_ASKS: FuturesBookLevel[] = [
  { price: 105003, size: 10, total: 210 },
  { price: 105002.5, size: 18, total: 200 },
  { price: 105002, size: 35, total: 182 },
  { price: 105001.5, size: 50, total: 147 },
  { price: 105001, size: 45, total: 97 },
  { price: 105000.5, size: 30, total: 52 },
  { price: 105000, size: 22, total: 22 },
  { price: 104999.5, size: 16, total: 16 },
];

export const MOCK_FUTURES_BIDS: FuturesBookLevel[] = [
  { price: 104975, size: 28, total: 28 },
  { price: 104974.5, size: 40, total: 68 },
  { price: 104974, size: 55, total: 123 },
  { price: 104973.5, size: 60, total: 183 },
  { price: 104973, size: 70, total: 253 },
  { price: 104972.5, size: 30, total: 283 },
  { price: 104972, size: 45, total: 328 },
  { price: 104971.5, size: 38, total: 366 },
];

export const MOCK_FUTURES_TRADES: FuturesTrade[] = [
  { id: 'ft1', price: 104975.5, qty: 4, time: '17:42:11', side: 'buy' },
  { id: 'ft2', price: 104974, qty: 2, time: '17:42:08', side: 'sell' },
  { id: 'ft3', price: 104975, qty: 6, time: '17:42:05', side: 'buy' },
  { id: 'ft4', price: 104973.5, qty: 3, time: '17:41:59', side: 'sell' },
  { id: 'ft5', price: 104976, qty: 8, time: '17:41:52', side: 'buy' },
  { id: 'ft6', price: 104974.5, qty: 1, time: '17:41:47', side: 'sell' },
  { id: 'ft7', price: 104975.5, qty: 5, time: '17:41:40', side: 'buy' },
  { id: 'ft8', price: 104973, qty: 7, time: '17:41:35', side: 'sell' },
  { id: 'ft9', price: 104976.5, qty: 2, time: '17:41:28', side: 'buy' },
  { id: 'ft10', price: 104974, qty: 4, time: '17:41:21', side: 'sell' },
];

export const MOCK_FUTURES_POSITIONS: FuturesPosition[] = [
  {
    id: 'fp1',
    side: 'Long',
    symbol: 'KSE100-PERP',
    expiry: 'Jun 2025',
    leverage: 10,
    sizeLots: 2,
    entryPrice: 104250,
    markPrice: 104975.5,
    unrealizedPnl: 14514,
    unrealizedPnlPct: 13.9,
  },
];

export const MOCK_FUTURES_HISTORY: FuturesHistoryItem[] = [
  {
    id: 'fh1',
    type: 'position_closed',
    symbol: 'KSE30-PERP',
    side: 'Short',
    quantity: 1,
    price: 45210.5,
    realizedPnl: 3240,
    leverage: 5,
    timestamp: '16:22:08 PKT',
  },
  {
    id: 'fh2',
    type: 'order_filled',
    symbol: 'KSE100-PERP',
    side: 'Long',
    quantity: 2,
    price: 103800,
    leverage: 10,
    orderType: 'Limit',
    timestamp: '14:05:41 PKT',
  },
];

export const MOCK_FUTURES_CANDLES: FuturesCandle[] = [
  { x: 0, open: 80, high: 60, low: 100, close: 70, volume: 42, isUp: true },
  { x: 10, open: 70, high: 40, low: 80, close: 50, volume: 38, isUp: true },
  { x: 20, open: 50, high: 20, low: 60, close: 30, volume: 55, isUp: true },
  { x: 30, open: 30, high: 10, low: 50, close: 20, volume: 48, isUp: true },
  { x: 40, open: 20, high: 10, low: 60, close: 40, volume: 62, isUp: false },
  { x: 50, open: 40, high: 20, low: 70, close: 60, volume: 44, isUp: false },
  { x: 60, open: 60, high: 40, low: 90, close: 80, volume: 51, isUp: false },
  { x: 70, open: 80, high: 60, low: 100, close: 95, volume: 47, isUp: false },
  { x: 80, open: 95, high: 70, low: 110, close: 80, volume: 58, isUp: true },
  { x: 90, open: 80, high: 50, low: 100, close: 60, volume: 41, isUp: true },
  { x: 100, open: 60, high: 30, low: 80, close: 40, volume: 53, isUp: true },
  { x: 110, open: 40, high: 15, low: 60, close: 25, volume: 49, isUp: true },
  { x: 120, open: 25, high: 10, low: 40, close: 30, volume: 36, isUp: false },
  { x: 130, open: 30, high: 15, low: 50, close: 40, volume: 40, isUp: false },
  { x: 140, open: 40, high: 25, low: 60, close: 50, volume: 45, isUp: false },
  { x: 150, open: 50, high: 35, low: 70, close: 60, volume: 43, isUp: false },
  { x: 160, open: 60, high: 45, low: 80, close: 75, volume: 39, isUp: false },
  { x: 170, open: 75, high: 60, low: 95, close: 85, volume: 52, isUp: true },
  { x: 180, open: 85, high: 70, low: 105, close: 90, volume: 46, isUp: true },
  { x: 190, open: 90, high: 75, low: 110, close: 100, volume: 57, isUp: true },
  { x: 200, open: 100, high: 80, low: 115, close: 95, volume: 50, isUp: false },
  { x: 210, open: 95, high: 70, low: 110, close: 80, volume: 48, isUp: false },
  { x: 220, open: 80, high: 60, low: 90, close: 60, volume: 42, isUp: false },
  { x: 230, open: 60, high: 40, low: 70, close: 50, volume: 37, isUp: false },
];

export function formatFuturesPrice(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseFuturesInput(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

export function calcUnrealizedPnl(
  side: FuturesSide,
  entryPrice: number,
  markPrice: number,
  sizeLots: number
): { pnl: number; pnlPct: number } {
  const direction = side === 'Long' ? 1 : -1;
  const notional = entryPrice * sizeLots;
  const pnl = (markPrice - entryPrice) * sizeLots * direction;
  const pnlPct = notional > 0 ? (pnl / notional) * 100 * (side === 'Long' ? 1 : 1) : 0;
  return { pnl, pnlPct };
}

export function estimateLiqPrice(side: FuturesSide, entryPrice: number, leverage: number): number {
  const buffer = (1 / leverage) * 0.85;
  return side === 'Long' ? entryPrice * (1 - buffer) : entryPrice * (1 + buffer);
}

export function scaleOrderBook(
  levels: FuturesBookLevel[],
  ratio: number
): FuturesBookLevel[] {
  if (ratio === 1) return levels;
  return levels.map((level) => ({
    ...level,
    price: Math.round(level.price * ratio * 100) / 100,
  }));
}

export function getScaledOrderBook(
  asks: FuturesBookLevel[],
  bids: FuturesBookLevel[],
  baseMarkPrice: number,
  targetMarkPrice: number
): { asks: FuturesBookLevel[]; bids: FuturesBookLevel[] } {
  const ratio = targetMarkPrice / baseMarkPrice;
  return {
    asks: scaleOrderBook(asks, ratio),
    bids: scaleOrderBook(bids, ratio),
  };
}
