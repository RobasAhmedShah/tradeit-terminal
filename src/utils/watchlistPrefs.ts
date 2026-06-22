import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tradeit/watchlist_v2';

export async function loadWatchlistSymbols(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string' && s.length > 0);
  } catch {
    return [];
  }
}

export async function saveWatchlistSymbols(symbols: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  } catch {
    // Non-blocking
  }
}
