import { useEffect, useRef } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Order } from '../../data/mockOrders';

const FILL_DELAY_MS = 60_000;
const POLL_MS = 2000;

function estimateTotalCost(price: number, quantity: number): number {
  const tradeValue = price * quantity;
  return tradeValue + tradeValue * 0.0015 + tradeValue * 0.0001 + tradeValue * 0.00005;
}

function toSpotPayload(order: Order) {
  const price = Number(order.price);
  const quantity = Number(order.quantity);
  const totalCost = order.totalCost ?? estimateTotalCost(price, quantity);
  return {
    symbol: order.symbol,
    companyName: order.companyName,
    side: order.side,
    price,
    quantity,
    totalCost,
    orderId: order.id,
    orderType: order.type,
  };
}

/**
 * Simulates exchange fills for pending limit orders, then updates portfolio holdings.
 */
export function OrderFillMonitor() {
  const { orders, ready, executeOrder } = useOrders();
  const { applySpotTrade } = usePortfolio();
  const { pushNotification } = useNotifications();
  const fillingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      const now = Date.now();

      for (const order of orders) {
        if (order.status !== 'Pending' || !order.createdAt) continue;
        if (now - order.createdAt < FILL_DELAY_MS) continue;
        if (fillingRef.current.has(order.id)) continue;

        fillingRef.current.add(order.id);
        const filled = executeOrder(order.id);
        if (!filled) {
          fillingRef.current.delete(order.id);
          continue;
        }

        applySpotTrade(toSpotPayload(filled));

        pushNotification({
          type: 'order',
          title: 'Order Filled',
          body: `${filled.side} ${filled.quantity} ${filled.symbol} @ Rs ${filled.price.toFixed(2)} has been executed.`,
          symbol: filled.symbol,
          orderId: filled.id,
        });
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [orders, ready, executeOrder, applySpotTrade, pushNotification]);

  return null;
}
