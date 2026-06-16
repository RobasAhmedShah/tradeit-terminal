import React, { createContext, useContext, useState } from 'react';
import { Stock, MOCK_WATCHLIST } from '../data/mockStocks';

interface WatchlistContextType {
  watchlist: Stock[];
  isWatchlisted: (symbol: string) => boolean;
  toggleWatchlist: (stock: Stock) => void;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  isWatchlisted: () => false,
  toggleWatchlist: () => {},
});

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Stock[]>(MOCK_WATCHLIST);

  const isWatchlisted = (symbol: string) => watchlist.some(s => s.symbol === symbol);

  const toggleWatchlist = (stock: Stock) => {
    setWatchlist(prev =>
      prev.some(s => s.symbol === stock.symbol)
        ? prev.filter(s => s.symbol !== stock.symbol)
        : [...prev, stock]
    );
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, isWatchlisted, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
