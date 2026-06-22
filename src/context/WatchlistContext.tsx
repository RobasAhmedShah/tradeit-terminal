import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Stock, MOCK_MARKET_STOCKS } from '../data/mockStocks';
import { tickStockPrice } from '../utils/marketsHub';
import { loadWatchlistSymbols, saveWatchlistSymbols } from '../utils/watchlistPrefs';

interface WatchlistContextType {
  watchlist: Stock[];
  ready: boolean;
  isWatchlisted: (symbol: string) => boolean;
  toggleWatchlist: (stock: Stock) => void;
}

const stockMap = new Map(MOCK_MARKET_STOCKS.map((s) => [s.symbol, s]));

function hydrateWatchlist(symbols: string[], live: Record<string, Stock>): Stock[] {
  const stocks: Stock[] = [];
  for (const symbol of symbols) {
    const item = live[symbol] ?? stockMap.get(symbol);
    if (item) stocks.push(item);
  }
  return stocks;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  ready: false,
  isWatchlisted: () => false,
  toggleWatchlist: () => {},
});

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, Stock>>({});
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

  useEffect(() => {
    if (symbols.length === 0) return;

    const tick = () => {
      setLivePrices((prev) => {
        const next = { ...prev };
        for (const sym of symbols) {
          const base = next[sym] ?? stockMap.get(sym);
          if (base) next[sym] = tickStockPrice(base);
        }
        return next;
      });
    };

    const id = setInterval(tick, 3500);
    return () => clearInterval(id);
  }, [symbols]);

  const watchlist = useMemo(() => hydrateWatchlist(symbols, livePrices), [symbols, livePrices]);

  const isWatchlisted = useCallback((symbol: string) => symbols.includes(symbol), [symbols]);

  const toggleWatchlist = useCallback((stock: Stock) => {
    setSymbols((prev) => {
      const adding = !prev.includes(stock.symbol);
      if (adding) {
        setLivePrices((live) => ({ ...live, [stock.symbol]: stock }));
      }
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
