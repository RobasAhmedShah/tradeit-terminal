export type ActivityType = 'deposit' | 'withdraw' | 'buy' | 'sell' | 'order_pending' | 'transfer';

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

export const SEED_ACTIVITIES: PortfolioActivity[] = [];

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
      return { name: 'time', color: '#FF8A00' };
    case 'transfer':
      return { name: 'swap-horizontal', color: '#FF8A00' };
    default:
      return { name: 'ellipse', color: '#9CA3AF' };
  }
}
