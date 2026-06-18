import AsyncStorage from '@react-native-async-storage/async-storage';
import { FuturesMarginMode } from '../data/mockFutures';

const STORAGE_KEY = '@tradeit/futures_trading_prefs';

export interface FuturesTradingPrefs {
  leverage: number;
  marginMode: FuturesMarginMode;
  contractSymbol: string;
}

export const DEFAULT_FUTURES_TRADING_PREFS: FuturesTradingPrefs = {
  leverage: 10,
  marginMode: 'Cross',
  contractSymbol: 'KSE100-PERP',
};

const LEVERAGE_VALUES = [1, 5, 10, 20, 50, 75, 100, 125];

function isMarginMode(value: unknown): value is FuturesMarginMode {
  return value === 'Cross' || value === 'Isolated';
}

export async function loadFuturesTradingPrefs(): Promise<FuturesTradingPrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FUTURES_TRADING_PREFS;

    const parsed = JSON.parse(raw) as Partial<FuturesTradingPrefs>;
    const leverage =
      typeof parsed.leverage === 'number' && LEVERAGE_VALUES.includes(parsed.leverage)
        ? parsed.leverage
        : DEFAULT_FUTURES_TRADING_PREFS.leverage;

    return {
      leverage,
      marginMode: isMarginMode(parsed.marginMode)
        ? parsed.marginMode
        : DEFAULT_FUTURES_TRADING_PREFS.marginMode,
      contractSymbol:
        typeof parsed.contractSymbol === 'string' && parsed.contractSymbol.length > 0
          ? parsed.contractSymbol
          : DEFAULT_FUTURES_TRADING_PREFS.contractSymbol,
    };
  } catch {
    return DEFAULT_FUTURES_TRADING_PREFS;
  }
}

export async function saveFuturesTradingPrefs(prefs: FuturesTradingPrefs): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Non-blocking
  }
}
