import React, { createContext, useCallback, useContext, useState } from 'react';
import { EditOrderSheet } from '../components/orders/EditOrderSheet';

interface EditOrderSheetContextType {
  openEditOrder: (orderId: string) => void;
  closeEditOrder: () => void;
}

const EditOrderSheetContext = createContext<EditOrderSheetContextType>({
  openEditOrder: () => {},
  closeEditOrder: () => {},
});

export const EditOrderSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const openEditOrder = useCallback((id: string) => {
    setOrderId(id);
    setVisible(true);
  }, []);

  const closeEditOrder = useCallback(() => {
    setVisible(false);
    setOrderId(null);
  }, []);

  return (
    <EditOrderSheetContext.Provider value={{ openEditOrder, closeEditOrder }}>
      {children}
      <EditOrderSheet visible={visible} orderId={orderId} onClose={closeEditOrder} />
    </EditOrderSheetContext.Provider>
  );
};

export const useEditOrderSheet = () => useContext(EditOrderSheetContext);
