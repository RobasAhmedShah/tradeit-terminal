import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Order, OrderStatus } from '../data/mockOrders';
import { createOrderId, loadOrders, saveOrders } from '../utils/orderPrefs';

interface UpdateOrderPatch {
  price?: number;
  quantity?: number;
}

interface OrdersContextType {
  orders: Order[];
  ready: boolean;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  updateOrder: (id: string, patch: UpdateOrderPatch) => void;
  executeOrder: (id: string) => Order | null;
  addPendingOrder: (
    input: Omit<Order, 'id' | 'timeline' | 'date' | 'createdTime' | 'status' | 'filledQty' | 'remainingQty' | 'createdAt'> & {
      status?: OrderStatus;
      totalCost?: number;
    }
  ) => Order;
}

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  ready: false,
  getOrder: () => undefined,
  cancelOrder: () => {},
  updateOrder: () => {},
  executeOrder: () => null,
  addPendingOrder: () => ({}) as Order,
});

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadOrders().then((data) => {
      setOrders(data);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveOrders(orders);
  }, [orders, ready]);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (o.status === 'Executed' || o.status === 'Cancelled' || o.status === 'Rejected') return o;
        return {
          ...o,
          status: 'Cancelled' as OrderStatus,
          remainingQty: 0,
          timeline: [
            ...o.timeline.filter((t) => !t.isActive),
            { title: 'Cancelled by User', time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), isCompleted: true, isActive: true },
          ],
        };
      })
    );
  }, []);

  const updateOrder = useCallback((id: string, patch: UpdateOrderPatch) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const quantity = patch.quantity ?? o.quantity;
        const price = patch.price ?? o.price;
        return {
          ...o,
          quantity,
          price,
          remainingQty: Math.max(0, quantity - o.filledQty),
        };
      })
    );
  }, []);

  const executeOrder = useCallback((id: string): Order | null => {
    let executed: Order | null = null;

    setOrders((prev) => {
      const existing = prev.find((o) => o.id === id && o.status === 'Pending');
      if (!existing) return prev;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      });
      executed = {
        ...existing,
        status: 'Executed',
        filledQty: existing.quantity,
        remainingQty: 0,
        avgPrice: existing.price,
        timeline: [
          ...existing.timeline.filter((t) => !t.isActive),
          { title: 'Fully Executed', time: timeStr, isCompleted: true, isActive: true },
        ],
      };

      return prev.map((o) => (o.id === id ? executed! : o));
    });

    return executed;
  }, []);

  const addPendingOrder = useCallback(
    (
      input: Omit<Order, 'id' | 'timeline' | 'date' | 'createdTime' | 'status' | 'filledQty' | 'remainingQty' | 'createdAt'> & {
        status?: OrderStatus;
        totalCost?: number;
      }
    ) => {
      const id = createOrderId();
      const now = new Date();
      const order: Order = {
        ...input,
        id,
        status: input.status ?? 'Pending',
        filledQty: 0,
        remainingQty: input.quantity,
        totalCost: input.totalCost,
        createdAt: Date.now(),
        createdTime: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timeline: [
          { title: 'Created', time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }), isCompleted: true },
          { title: 'Submitted', time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }), isCompleted: true },
          { title: 'Exchange Accepted', time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }), isCompleted: true, isActive: true },
          { title: 'Fully Executed', isCompleted: false },
        ],
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    []
  );

  return (
    <OrdersContext.Provider value={{ orders, ready, getOrder, cancelOrder, updateOrder, executeOrder, addPendingOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
