import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@tradeit/last_withdraw_v1';

export type LastWithdrawPrefs = {
  method: string;
  bank: string;
  amount: number;
  savedAt: number;
};

export async function loadLastWithdraw(): Promise<LastWithdrawPrefs | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastWithdrawPrefs;
    if (!parsed.method || !parsed.amount) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveLastWithdraw(prefs: Omit<LastWithdrawPrefs, 'savedAt'>): Promise<void> {
  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({ ...prefs, savedAt: Date.now() } satisfies LastWithdrawPrefs),
    );
  } catch {
    // ignore
  }
}
