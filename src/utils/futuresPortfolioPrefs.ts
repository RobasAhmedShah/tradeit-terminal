import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FuturesHistoryItem,
  FuturesOpenOrder,
  FuturesPosition,
} from '../data/mockFutures';

const STORAGE_KEY = '@tradeit/futures_portfolio_v2';

export interface FuturesPortfolioState {
  positions: FuturesPosition[];
  openOrders: FuturesOpenOrder[];
  orderHistory: FuturesHistoryItem[];
}

export const DEFAULT_FUTURES_PORTFOLIO: FuturesPortfolioState = {
  positions: [],
  openOrders: [],
  orderHistory: [],
};

export async function loadFuturesPortfolio(): Promise<FuturesPortfolioState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FUTURES_PORTFOLIO;
    const parsed = JSON.parse(raw) as Partial<FuturesPortfolioState>;
    return {
      positions: Array.isArray(parsed.positions) ? parsed.positions : [],
      openOrders: Array.isArray(parsed.openOrders) ? parsed.openOrders : [],
      orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : [],
    };
  } catch {
    return DEFAULT_FUTURES_PORTFOLIO;
  }
}

export async function saveFuturesPortfolio(state: FuturesPortfolioState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Non-blocking
  }
}
