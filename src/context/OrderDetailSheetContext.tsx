import React, { createContext, useCallback, useContext, useState } from 'react';
import { OrderDetailSheet } from '../components/orders/OrderDetailSheet';

interface OrderDetailSheetContextType {
  openOrderDetail: (orderId: string) => void;
  closeOrderDetail: () => void;
}

const OrderDetailSheetContext = createContext<OrderDetailSheetContextType>({
  openOrderDetail: () => {},
  closeOrderDetail: () => {},
});

export const OrderDetailSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const openOrderDetail = useCallback((id: string) => {
    setOrderId(id);
    setVisible(true);
  }, []);

  const closeOrderDetail = useCallback(() => {
    setVisible(false);
    setOrderId(null);
  }, []);

  return (
    <OrderDetailSheetContext.Provider value={{ openOrderDetail, closeOrderDetail }}>
      {children}
      <OrderDetailSheet visible={visible} orderId={orderId} onClose={closeOrderDetail} />
    </OrderDetailSheetContext.Provider>
  );
};

export const useOrderDetailSheet = () => useContext(OrderDetailSheetContext);
