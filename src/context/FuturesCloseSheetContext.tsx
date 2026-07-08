import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { FuturesCloseSheet } from '../components/futures/FuturesCloseSheet';
import { FuturesPosition } from '../data/mockFutures';

interface FuturesCloseSheetContextType {
  openCloseSheet: (position: FuturesPosition, onClosed?: () => void) => void;
  closeCloseSheet: () => void;
}

const FuturesCloseSheetContext = createContext<FuturesCloseSheetContextType>({
  openCloseSheet: () => {},
  closeCloseSheet: () => {},
});

export const FuturesCloseSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<FuturesPosition | null>(null);
  const onClosedRef = useRef<(() => void) | null>(null);

  const openCloseSheet = useCallback((pos: FuturesPosition, onClosed?: () => void) => {
    onClosedRef.current = onClosed ?? null;
    setPosition(pos);
    setVisible(true);
  }, []);

  const closeCloseSheet = useCallback(() => {
    setVisible(false);
    setPosition(null);
    const cb = onClosedRef.current;
    onClosedRef.current = null;
    cb?.();
  }, []);

  return (
    <FuturesCloseSheetContext.Provider value={{ openCloseSheet, closeCloseSheet }}>
      {children}
      <FuturesCloseSheet visible={visible} position={position} onClose={closeCloseSheet} />
    </FuturesCloseSheetContext.Provider>
  );
};

export const useFuturesCloseSheet = () => useContext(FuturesCloseSheetContext);
