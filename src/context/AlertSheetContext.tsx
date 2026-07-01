import React, { createContext, useCallback, useContext, useState } from 'react';
import { PriceAlertSheet } from '../components/alerts/PriceAlertSheet';

interface AlertSheetContextType {
  openAlert: (symbol?: string) => void;
  openEditAlert: (alertId: string) => void;
  closeAlert: () => void;
}

const AlertSheetContext = createContext<AlertSheetContextType>({
  openAlert: () => {},
  openEditAlert: () => {},
  closeAlert: () => {},
});

export const AlertSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const openAlert = useCallback((sym?: string) => {
    setEditId(null);
    setSymbol(sym ?? null);
    setVisible(true);
  }, []);

  const openEditAlert = useCallback((alertId: string) => {
    setEditId(alertId);
    setSymbol(null);
    setVisible(true);
  }, []);

  const closeAlert = useCallback(() => {
    setVisible(false);
    setEditId(null);
    setSymbol(null);
  }, []);

  return (
    <AlertSheetContext.Provider value={{ openAlert, openEditAlert, closeAlert }}>
      {children}
      <PriceAlertSheet visible={visible} presetSymbol={symbol} editId={editId} onClose={closeAlert} />
    </AlertSheetContext.Provider>
  );
};

export const useAlertSheet = () => useContext(AlertSheetContext);
