import { useEffect, useRef } from 'react';
import { useFutures } from '../../context/FuturesContext';

const FILL_DELAY_MS = 5000;
const POLL_MS = 2000;

/** Auto-fills pending futures limit orders after a short delay (demo). */
export function FuturesOrderFillMonitor() {
  const { openOrders, fillOpenOrder } = useFutures();
  const fillingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      for (const order of openOrders) {
        if (order.orderType !== 'Limit' || !order.createdAt) continue;
        if (now - order.createdAt < FILL_DELAY_MS) continue;
        if (fillingRef.current.has(order.id)) continue;

        fillingRef.current.add(order.id);
        fillOpenOrder(order.id);
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [openOrders, fillOpenOrder]);

  return null;
}
