import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  createNotificationId,
  dedupeNotifications,
  formatNotifTime,
  loadNotifications,
  saveNotifications,
} from '../utils/notificationPrefs';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  loadNotificationSettings,
  NotificationSettings,
  saveNotificationSettings,
} from '../utils/notificationSettingsPrefs';
import { isNotificationTypeEnabled } from '../utils/notificationRules';

interface PushNotificationInput {
  type: AppNotification['type'];
  title: string;
  body: string;
  symbol?: string;
  orderId?: string;
  alertId?: string;
  newsId?: string;
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  ready: boolean;
  settings: NotificationSettings;
  updateSettings: (settings: NotificationSettings) => void;
  pushNotification: (input: PushNotificationInput) => AppNotification | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  ready: false,
  settings: DEFAULT_NOTIFICATION_SETTINGS,
  updateSettings: () => {},
  pushNotification: () => null,
  markRead: () => {},
  markAllRead: () => {},
  removeNotification: () => {},
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadNotifications(), loadNotificationSettings()]).then(([items, prefs]) => {
      setNotifications((prev) => dedupeNotifications([...prev, ...items]));
      setSettings(prefs);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveNotifications(notifications);
  }, [notifications, ready]);

  const updateSettings = useCallback((next: NotificationSettings) => {
    setSettings(next);
    saveNotificationSettings(next);
  }, []);

  const pushNotification = useCallback(
    (input: PushNotificationInput): AppNotification | null => {
      if (!isNotificationTypeEnabled(input.type, settings)) return null;

      const createdAt = Date.now();
      const item: AppNotification = {
        id: createNotificationId(),
        type: input.type,
        title: input.title,
        body: input.body,
        time: formatNotifTime(createdAt),
        isRead: false,
        symbol: input.symbol,
        orderId: input.orderId,
        alertId: input.alertId,
        newsId: input.newsId,
        createdAt,
      };
      setNotifications((prev) => dedupeNotifications([item, ...prev]).slice(0, 80));
      return item;
    },
    [settings]
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        ready,
        settings,
        updateSettings,
        pushNotification,
        markRead,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
