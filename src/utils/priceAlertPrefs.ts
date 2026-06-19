import AsyncStorage from '@react-native-async-storage/async-storage';

export type PriceAlertCondition = 'above' | 'below';

export interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  condition: PriceAlertCondition;
  targetPrice: number;
  createdAt: string;
  isActive: boolean;
}

const STORAGE_KEY = '@tradeit/price_alerts_v1';

export const SEED_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'pa1',
    symbol: 'HBL',
    name: 'Habib Bank Limited',
    condition: 'above',
    targetPrice: 210,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isActive: true,
  },
  {
    id: 'pa2',
    symbol: 'PSO',
    name: 'Pakistan State Oil',
    condition: 'below',
    targetPrice: 380,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
  },
];

export async function loadPriceAlerts(): Promise<PriceAlert[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_PRICE_ALERTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PRICE_ALERTS;
  } catch {
    return SEED_PRICE_ALERTS;
  }
}

export async function savePriceAlerts(alerts: PriceAlert[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // Non-blocking
  }
}

export function createAlertId(): string {
  return `pa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
