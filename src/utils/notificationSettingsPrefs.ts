import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  orderUpdates: boolean;
  priceAlerts: boolean;
  newsUpdates: boolean;
  pushEnabled: boolean;
}

const STORAGE_KEY = '@tradeit/notification_settings_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  orderUpdates: true,
  priceAlerts: true,
  newsUpdates: true,
  pushEnabled: true,
};

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Non-blocking
  }
}
