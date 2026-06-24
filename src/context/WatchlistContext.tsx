import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Stock, MOCK_MARKET_STOCKS } from '../data/mockStocks';
import { useMarketPrices } from './MarketPricesContext';
import { loadWatchlistSymbols, saveWatchlistSymbols } from '../utils/watchlistPrefs';

interface WatchlistContextType {
  watchlist: Stock[];
  ready: boolean;
  isWatchlisted: (symbol: string) => boolean;
  toggleWatchlist: (stock: Stock) => void;
}

const stockMap = new Map(MOCK_MARKET_STOCKS.map((s) => [s.symbol, s]));

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  ready: false,
  isWatchlisted: () => false,
  toggleWatchlist: () => {},
});

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getStock, lastTickAt } = useMarketPrices();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadWatchlistSymbols().then((loaded) => {
      setSymbols(loaded);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveWatchlistSymbols(symbols);
  }, [symbols, ready]);

  const watchlist = useMemo(() => {
    const stocks: Stock[] = [];
    for (const symbol of symbols) {
      const item = getStock(symbol) ?? stockMap.get(symbol);
      if (item) stocks.push(item);
    }
    return stocks;
  }, [symbols, getStock, lastTickAt]);

  const isWatchlisted = useCallback((symbol: string) => symbols.includes(symbol), [symbols]);

  const toggleWatchlist = useCallback((stock: Stock) => {
    setSymbols((prev) => {
      const adding = !prev.includes(stock.symbol);
      return adding ? [...prev, stock.symbol] : prev.filter((s) => s !== stock.symbol);
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlist, ready, isWatchlisted, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
