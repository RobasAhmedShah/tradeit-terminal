export type ActivityType = 'deposit' | 'withdraw' | 'buy' | 'sell' | 'order_pending';

export interface PortfolioActivity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  amount: number;
  symbol?: string;
  orderId?: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'processing';
}

export const SEED_ACTIVITIES: PortfolioActivity[] = [
  {
    id: 'act-seed-1',
    type: 'order_pending',
    title: 'Pending sell order',
    subtitle: 'SELL 500 SAZEW @ Rs 2,125.00',
    amount: 1062500,
    symbol: 'SAZEW',
    orderId: 'PSX-2026-001246',
    timestamp: Date.now() - 1000 * 60 * 45,
    status: 'pending',
  },
];

export function formatActivityTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function activityIcon(type: ActivityType): { name: string; color: string } {
  switch (type) {
    case 'deposit':
      return { name: 'arrow-down-circle', color: '#00C853' };
    case 'withdraw':
      return { name: 'arrow-up-circle', color: '#FF3B30' };
    case 'buy':
      return { name: 'trending-up', color: '#00C853' };
    case 'sell':
      return { name: 'trending-down', color: '#FF3B30' };
    case 'order_pending':
    default:
      return { name: 'time', color: '#FF8A00' };
  }
}
