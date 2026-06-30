import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { TransferSheet } from '../components/funds/TransferSheet';

interface TransferSheetContextType {
  openTransfer: (onClosed?: () => void) => void;
  closeTransfer: () => void;
}

const TransferSheetContext = createContext<TransferSheetContextType>({
  openTransfer: () => {},
  closeTransfer: () => {},
});

export const TransferSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const onClosedRef = useRef<(() => void) | null>(null);

  const openTransfer = useCallback((onClosed?: () => void) => {
    onClosedRef.current = onClosed ?? null;
    setVisible(true);
  }, []);

  const closeTransfer = useCallback(() => {
    setVisible(false);
    const cb = onClosedRef.current;
    onClosedRef.current = null;
    cb?.();
  }, []);

  return (
    <TransferSheetContext.Provider value={{ openTransfer, closeTransfer }}>
      {children}
      <TransferSheet visible={visible} onClose={closeTransfer} />
    </TransferSheetContext.Provider>
  );
};

export const useTransferSheet = () => useContext(TransferSheetContext);
