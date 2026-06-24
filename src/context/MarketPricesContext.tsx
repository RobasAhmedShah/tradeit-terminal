import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_MARKET_STOCKS, Stock } from '../data/mockStocks';
import { tickStockPrice } from '../utils/marketsHub';

const TICK_MS = 3500;

interface MarketPricesContextType {
  lastTickAt: number;
  getStock: (symbol: string) => Stock | undefined;
  stocks: Stock[];
}

const stockMap = new Map(MOCK_MARKET_STOCKS.map((s) => [s.symbol, s]));

const MarketPricesContext = createContext<MarketPricesContextType>({
  lastTickAt: 0,
  getStock: () => undefined,
  stocks: MOCK_MARKET_STOCKS,
});

export const MarketPricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, Stock>>(() => {
    const initial: Record<string, Stock> = {};
    for (const stock of MOCK_MARKET_STOCKS) initial[stock.symbol] = stock;
    return initial;
  });
  const [lastTickAt, setLastTickAt] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next: Record<string, Stock> = { ...prev };
        for (const stock of MOCK_MARKET_STOCKS) {
          const base = next[stock.symbol] ?? stock;
          next[stock.symbol] = tickStockPrice(base);
        }
        return next;
      });
      setLastTickAt(Date.now());
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  const getStock = useCallback((symbol: string) => prices[symbol] ?? stockMap.get(symbol), [prices]);

  const stocks = useMemo(() => MOCK_MARKET_STOCKS.map((s) => prices[s.symbol] ?? s), [prices]);

  return (
    <MarketPricesContext.Provider value={{ lastTickAt, getStock, stocks }}>
      {children}
    </MarketPricesContext.Provider>
  );
};

export const useMarketPrices = () => useContext(MarketPricesContext);

export function useMarketStock(symbol: string | undefined): Stock | undefined {
  const { getStock, lastTickAt } = useMarketPrices();
  return useMemo(() => (symbol ? getStock(symbol) : undefined), [symbol, getStock, lastTickAt]);
}
