import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@tradeit/last_deposit_v1';

export type LastDepositPrefs = {
  method: string;
  bank: string;
  amount: number;
  savedAt: number;
};

export async function loadLastDeposit(): Promise<LastDepositPrefs | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastDepositPrefs;
    if (!parsed.method || !parsed.amount) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveLastDeposit(prefs: Omit<LastDepositPrefs, 'savedAt'>): Promise<void> {
  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({ ...prefs, savedAt: Date.now() } satisfies LastDepositPrefs),
    );
  } catch {
    // ignore
  }
}
