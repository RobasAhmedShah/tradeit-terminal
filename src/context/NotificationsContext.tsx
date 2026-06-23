import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  createNotificationId,
  dedupeNotifications,
  formatNotifTime,
  loadNotifications,
  saveNotifications,
} from '../utils/notificationPrefs';

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
  pushNotification: (input: PushNotificationInput) => AppNotification;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  ready: false,
  pushNotification: () => ({
    id: '',
    type: 'system',
    title: '',
    body: '',
    time: '',
    isRead: false,
    createdAt: 0,
  }),
  markRead: () => {},
  markAllRead: () => {},
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadNotifications().then((items) => {
      setNotifications((prev) => dedupeNotifications([...prev, ...items]));
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveNotifications(notifications);
  }, [notifications, ready]);

  const pushNotification = useCallback((input: PushNotificationInput) => {
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
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, ready, pushNotification, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
