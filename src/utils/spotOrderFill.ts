import { Order } from '../data/mockOrders';

const MIN_ORDER_AGE_MS = 2000;

function isStopLimitOrder(order: Order): boolean {
  return order.type === 'Stop Limit' && order.stopPrice != null;
}

/** Stop price has been hit — limit leg is now active. */
export function shouldTriggerStopLimit(order: Order, marketPrice: number, now = Date.now()): boolean {
  if (!isStopLimitOrder(order) || order.stopTriggered) return false;
  if (order.status !== 'Pending') return false;
  if (!order.createdAt || now - order.createdAt < MIN_ORDER_AGE_MS) return false;
  if (!Number.isFinite(marketPrice) || marketPrice <= 0) return false;

  const stop = Number(order.stopPrice);
  if (!Number.isFinite(stop) || stop <= 0) return false;

  if (order.side === 'BUY') return marketPrice >= stop;
  if (order.side === 'SELL') return marketPrice <= stop;
  return false;
}

/** Returns true when a mock limit / triggered stop-limit order should fill. */
export function shouldFillSpotLimitOrder(order: Order, marketPrice: number, now = Date.now()): boolean {
  if (order.status !== 'Pending') return false;
  if (!order.createdAt || now - order.createdAt < MIN_ORDER_AGE_MS) return false;
  if (!Number.isFinite(marketPrice) || marketPrice <= 0) return false;

  if (isStopLimitOrder(order) && !order.stopTriggered) return false;

  const limit = Number(order.price);
  if (!Number.isFinite(limit) || limit <= 0) return false;

  if (order.side === 'BUY') return marketPrice <= limit;
  if (order.side === 'SELL') return marketPrice >= limit;
  return false;
}
