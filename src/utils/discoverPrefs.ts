import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tradeit/discover_widgets_v1';

export interface DiscoverWidgetPrefs {
  showWatchlist: boolean;
  showMovers: boolean;
  showCommunity: boolean;
}

export const DEFAULT_DISCOVER_PREFS: DiscoverWidgetPrefs = {
  showWatchlist: true,
  showMovers: true,
  showCommunity: true,
};

export async function loadDiscoverPrefs(): Promise<DiscoverWidgetPrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DISCOVER_PREFS };
    const parsed = JSON.parse(raw) as Partial<DiscoverWidgetPrefs>;
    return {
      showWatchlist: parsed.showWatchlist ?? true,
      showMovers: parsed.showMovers ?? true,
      showCommunity: parsed.showCommunity ?? true,
    };
  } catch {
    return { ...DEFAULT_DISCOVER_PREFS };
  }
}

export async function saveDiscoverPrefs(prefs: DiscoverWidgetPrefs): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
