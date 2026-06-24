import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthSession {
  userId: string;
  email: string;
  displayName: string;
  clientId: string;
  loggedInAt: number;
}

const STORAGE_KEY = '@tradeit/auth_session_v1';

export const DEMO_SESSION: AuthSession = {
  userId: 'tid-guest-001',
  email: 'guesttrader@email.com',
  displayName: 'Guest Trader',
  clientId: 'TID12345678',
  loggedInAt: Date.now(),
};

export async function loadAuthSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Non-blocking
  }
}

export async function clearAuthSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-blocking
  }
}
