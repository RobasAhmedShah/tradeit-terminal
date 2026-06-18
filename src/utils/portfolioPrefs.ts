import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_PORTFOLIO_HOLDINGS, PORTFOLIO_SUMMARY } from '../data/mockPortfolio';
import { PortfolioActivity, SEED_ACTIVITIES } from '../data/portfolioActivity';

const STORAGE_KEY = '@tradeit/portfolio_v3';

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
  buyingPower: PORTFOLIO_SUMMARY.buyingPower,
  holdings: INITIAL_PORTFOLIO_HOLDINGS.map(({ symbol, name, qty, avgCost, chartPath }) => ({
    symbol,
    name,
    qty,
    avgCost,
    chartPath,
  })),
  activities: SEED_ACTIVITIES,
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
          : DEFAULT_PORTFOLIO_STATE.buyingPower,
      holdings: Array.isArray(parsed.holdings) ? parsed.holdings : DEFAULT_PORTFOLIO_STATE.holdings,
      activities: Array.isArray(parsed.activities) ? parsed.activities : DEFAULT_PORTFOLIO_STATE.activities,
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
