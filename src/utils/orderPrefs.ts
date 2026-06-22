import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_ORDERS, Order } from '../data/mockOrders';

const STORAGE_KEY = '@tradeit/spot_orders_v1';

export async function loadOrders(): Promise<Order[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Non-blocking
  }
}

export function createOrderId(): string {
  return `PSX-2026-${String(Date.now()).slice(-6)}`;
}
