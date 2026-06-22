import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioActivity } from '../data/portfolioActivity';

const STORAGE_KEY = '@tradeit/portfolio_v4';

export interface PortfolioHoldingCore {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  chartPath: string;
}

export interface PortfolioPersistedState {
  buyingPower: number;
  holdings: PortfolioHoldingCore[];
  activities: PortfolioActivity[];
}

export const DEFAULT_PORTFOLIO_STATE: PortfolioPersistedState = {
  buyingPower: 0,
  holdings: [],
  activities: [],
};

export async function loadPortfolioState(): Promise<PortfolioPersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_STATE;
    const parsed = JSON.parse(raw) as Partial<PortfolioPersistedState>;
    return {
      buyingPower:
        typeof parsed.buyingPower === 'number' && parsed.buyingPower >= 0
          ? parsed.buyingPower
          : 0,
      holdings: Array.isArray(parsed.holdings) ? parsed.holdings : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    };
  } catch {
    return DEFAULT_PORTFOLIO_STATE;
  }
}

export async function savePortfolioState(state: PortfolioPersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Non-blocking
  }
}
