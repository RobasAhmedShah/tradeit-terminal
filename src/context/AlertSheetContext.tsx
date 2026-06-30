import React, { createContext, useCallback, useContext, useState } from 'react';
import { PriceAlertSheet } from '../components/alerts/PriceAlertSheet';

interface AlertSheetContextType {
  openAlert: (symbol?: string) => void;
  closeAlert: () => void;
}

const AlertSheetContext = createContext<AlertSheetContextType>({
  openAlert: () => {},
  closeAlert: () => {},
});

export const AlertSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);

  const openAlert = useCallback((sym?: string) => {
    setSymbol(sym ?? null);
    setVisible(true);
  }, []);

  const closeAlert = useCallback(() => setVisible(false), []);

  return (
    <AlertSheetContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      <PriceAlertSheet visible={visible} presetSymbol={symbol} onClose={closeAlert} />
    </AlertSheetContext.Provider>
  );
};

export const useAlertSheet = () => useContext(AlertSheetContext);
