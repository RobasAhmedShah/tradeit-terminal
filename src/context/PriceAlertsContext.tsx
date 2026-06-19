import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  PriceAlert,
  PriceAlertCondition,
  createAlertId,
  loadPriceAlerts,
  savePriceAlerts,
} from '../utils/priceAlertPrefs';

interface CreateAlertInput {
  symbol: string;
  name: string;
  condition: PriceAlertCondition;
  targetPrice: number;
}

interface PriceAlertsContextType {
  alerts: PriceAlert[];
  ready: boolean;
  addAlert: (input: CreateAlertInput) => PriceAlert;
  updateAlert: (id: string, patch: Partial<Pick<PriceAlert, 'condition' | 'targetPrice' | 'isActive'>>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  getAlertsForSymbol: (symbol: string) => PriceAlert[];
}

const PriceAlertsContext = createContext<PriceAlertsContextType>({
  alerts: [],
  ready: false,
  addAlert: () => ({ id: '', symbol: '', name: '', condition: 'above', targetPrice: 0, createdAt: '', isActive: true }),
  updateAlert: () => {},
  removeAlert: () => {},
  toggleAlert: () => {},
  getAlertsForSymbol: () => [],
});

export const PriceAlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadPriceAlerts().then((data) => {
      setAlerts(data);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePriceAlerts(alerts);
  }, [alerts, ready]);

  const addAlert = useCallback((input: CreateAlertInput) => {
    const next: PriceAlert = {
      id: createAlertId(),
      symbol: input.symbol,
      name: input.name,
      condition: input.condition,
      targetPrice: input.targetPrice,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setAlerts((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateAlert = useCallback(
    (id: string, patch: Partial<Pick<PriceAlert, 'condition' | 'targetPrice' | 'isActive'>>) => {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  }, []);

  const getAlertsForSymbol = useCallback(
    (symbol: string) => alerts.filter((a) => a.symbol === symbol),
    [alerts]
  );

  return (
    <PriceAlertsContext.Provider
      value={{ alerts, ready, addAlert, updateAlert, removeAlert, toggleAlert, getAlertsForSymbol }}
    >
      {children}
    </PriceAlertsContext.Provider>
  );
};

export const usePriceAlerts = () => useContext(PriceAlertsContext);
