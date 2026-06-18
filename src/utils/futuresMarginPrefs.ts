import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_AVAILABLE_MARGIN, MOCK_USED_MARGIN } from './futuresOrderMath';

const STORAGE_KEY = '@tradeit/futures_margin';

export interface FuturesMarginBalance {
  available: number;
  used: number;
}

export const DEFAULT_FUTURES_MARGIN: FuturesMarginBalance = {
  available: MOCK_AVAILABLE_MARGIN,
  used: MOCK_USED_MARGIN,
};

export async function loadFuturesMargin(): Promise<FuturesMarginBalance> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FUTURES_MARGIN;
    const parsed = JSON.parse(raw) as Partial<FuturesMarginBalance>;
    return {
      available:
        typeof parsed.available === 'number' && parsed.available >= 0
          ? parsed.available
          : DEFAULT_FUTURES_MARGIN.available,
      used:
        typeof parsed.used === 'number' && parsed.used >= 0
          ? parsed.used
          : DEFAULT_FUTURES_MARGIN.used,
    };
  } catch {
    return DEFAULT_FUTURES_MARGIN;
  }
}

export async function saveFuturesMargin(balance: FuturesMarginBalance): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(balance));
  } catch {
    // Non-blocking
  }
}
