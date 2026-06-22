import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppNotificationType = 'order' | 'alert' | 'news' | 'system';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  symbol?: string;
  orderId?: string;
  alertId?: string;
  newsId?: string;
  createdAt: number;
}

const STORAGE_KEY = '@tradeit/notifications_v1';

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'Order Executed',
    body: 'Your BUY order for FANM (500 shares @ Rs 904.00) has been fully executed.',
    time: '2m ago',
    isRead: false,
    symbol: 'FANM',
    orderId: 'PSX-2026-001247',
    createdAt: Date.now() - 120000,
  },
  {
    id: 'n2',
    type: 'alert',
    title: 'Price Alert — HBL',
    body: 'HBL crossed your alert price of Rs 210.00. Currently trading at Rs 210.75.',
    time: '18m ago',
    isRead: false,
    symbol: 'HBL',
    alertId: 'pa1',
    createdAt: Date.now() - 1080000,
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'Price Alert — PSO',
    body: 'PSO is up +6.92% today, crossing your watchlist alert threshold.',
    time: '45m ago',
    isRead: false,
    symbol: 'PSO',
    createdAt: Date.now() - 2700000,
  },
  {
    id: 'n4',
    type: 'order',
    title: 'Order Pending',
    body: 'Your SELL order for OGDC (200 shares @ Rs 120.00) is queued on PSX.',
    time: '1h ago',
    isRead: true,
    symbol: 'OGDC',
    orderId: 'PSX-2026-001246',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'n5',
    type: 'news',
    title: 'Market Update',
    body: "KSE-100 index gains 412 points in today's session, led by fertilizer and banking sectors.",
    time: '2h ago',
    isRead: true,
    newsId: 'n-market-1',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Funds Credited',
    body: 'Rs 500,000.00 has been successfully deposited to your TradeIt wallet.',
    time: '1d ago',
    isRead: true,
    createdAt: Date.now() - 86400000,
  },
];

export function formatNotifTime(createdAt: number): string {
  const diff = Date.now() - createdAt;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export async function loadNotifications(): Promise<AppNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_NOTIFICATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_NOTIFICATIONS;
  } catch {
    return SEED_NOTIFICATIONS;
  }
}

export async function saveNotifications(items: AppNotification[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Non-blocking
  }
}
