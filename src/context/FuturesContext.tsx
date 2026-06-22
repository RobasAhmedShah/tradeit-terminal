import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  FuturesContract,
  FuturesHistoryItem,
  FuturesOpenOrder,
  FuturesOrderPayload,
  FuturesPosition,
  FUTURES_CONTRACTS,
  calcUnrealizedPnl,
} from '../data/mockFutures';
import { FUTURES_MARKET_TICK_MS, tickFuturesContracts } from '../hooks/useFuturesMarket';
import {
  FuturesMarginBalance,
  loadFuturesMargin,
  saveFuturesMargin,
} from '../utils/futuresMarginPrefs';
import {
  FuturesPortfolioState,
  loadFuturesPortfolio,
  saveFuturesPortfolio,
} from '../utils/futuresPortfolioPrefs';

interface FuturesContextType {
  contracts: FuturesContract[];
  marginAvailable: number;
  marginUsed: number;
  isMarketLive: boolean;
  positions: FuturesPosition[];
  openOrders: FuturesOpenOrder[];
  orderHistory: FuturesHistoryItem[];
  getContractBySymbol: (symbol: string) => FuturesContract | undefined;
  fulfillFuturesOrder: (order: FuturesOrderPayload, orderId: string, timestamp: string) => void;
  closePosition: (position: FuturesPosition) => void;
  cancelOpenOrder: (order: FuturesOpenOrder) => void;
  fillOpenOrder: (orderId: string) => boolean;
  getPositionById: (id: string) => FuturesPosition | undefined;
  addFuturesMargin: (amount: number) => void;
}

const FuturesContext = createContext<FuturesContextType>({
  contracts: FUTURES_CONTRACTS,
  marginAvailable: 0,
  marginUsed: 0,
  isMarketLive: false,
  positions: [],
  openOrders: [],
  orderHistory: [],
  getContractBySymbol: () => undefined,
  fulfillFuturesOrder: () => {},
  closePosition: () => {},
  cancelOpenOrder: () => {},
  fillOpenOrder: () => false,
  getPositionById: () => undefined,
  addFuturesMargin: () => {},
});

function mergePosition(
  existing: FuturesPosition,
  price: number,
  quantity: number,
  markPrice: number
): FuturesPosition {
  const newSize = existing.sizeLots + quantity;
  const newEntry = (existing.entryPrice * existing.sizeLots + price * quantity) / newSize;
  const { pnl, pnlPct } = calcUnrealizedPnl(existing.side, newEntry, markPrice, newSize);
  return {
    ...existing,
    sizeLots: newSize,
    entryPrice: newEntry,
    markPrice,
    unrealizedPnl: pnl,
    unrealizedPnlPct: pnlPct,
  };
}

function buildCloseHistory(position: FuturesPosition): FuturesHistoryItem {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT';
  return {
    id: `fh-${Date.now()}`,
    type: 'position_closed',
    symbol: position.symbol,
    side: position.side,
    quantity: position.sizeLots,
    price: position.markPrice,
    realizedPnl: position.unrealizedPnl,
    leverage: position.leverage,
    timestamp,
  };
}

function buildCancelHistory(order: FuturesOpenOrder): FuturesHistoryItem {
  return {
    id: `fh-${Date.now()}`,
    type: 'order_cancelled',
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    price: order.price,
    leverage: order.leverage,
    orderType: order.orderType,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT',
  };
}

function refreshPositionMarks(
  positions: FuturesPosition[],
  contracts: FuturesContract[]
): FuturesPosition[] {
  return positions.map((position) => {
    const live = contracts.find((c) => c.symbol === position.symbol);
    if (!live) return position;
    const { pnl, pnlPct } = calcUnrealizedPnl(
      position.side,
      position.entryPrice,
      live.markPrice,
      position.sizeLots
    );
    return {
      ...position,
      markPrice: live.markPrice,
      unrealizedPnl: pnl,
      unrealizedPnlPct: pnlPct,
    };
  });
}

export const FuturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<FuturesContract[]>(FUTURES_CONTRACTS);
  const [margin, setMargin] = useState<FuturesMarginBalance>({ available: 0, used: 0 });
  const [marginLoaded, setMarginLoaded] = useState(false);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [isMarketLive, setIsMarketLive] = useState(false);
  const [positions, setPositions] = useState<FuturesPosition[]>([]);
  const [openOrders, setOpenOrders] = useState<FuturesOpenOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<FuturesHistoryItem[]>([]);

  useEffect(() => {
    loadFuturesMargin().then((loaded) => {
      setMargin(loaded);
      setMarginLoaded(true);
    });
    loadFuturesPortfolio().then((portfolio) => {
      setPositions(portfolio.positions);
      setOpenOrders(portfolio.openOrders);
      setOrderHistory(portfolio.orderHistory);
      setPortfolioLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!marginLoaded) return;
    saveFuturesMargin(margin);
  }, [margin, marginLoaded]);

  useEffect(() => {
    if (!portfolioLoaded) return;
    const state: FuturesPortfolioState = { positions, openOrders, orderHistory };
    saveFuturesPortfolio(state);
  }, [positions, openOrders, orderHistory, portfolioLoaded]);

  useEffect(() => {
    setIsMarketLive(true);
    const interval = setInterval(() => {
      setContracts((prev) => tickFuturesContracts(prev));
    }, FUTURES_MARKET_TICK_MS);
    return () => {
      clearInterval(interval);
      setIsMarketLive(false);
    };
  }, []);

  useEffect(() => {
    setPositions((prev) => refreshPositionMarks(prev, contracts));
  }, [contracts]);

  const getContractBySymbol = useCallback(
    (symbol: string) => contracts.find((c) => c.symbol === symbol),
    [contracts]
  );

  const addFuturesMargin = useCallback((amount: number) => {
    if (amount <= 0) return;
    setMargin((prev) => ({ ...prev, available: prev.available + amount }));
  }, []);

  const fulfillFuturesOrder = useCallback(
    (order: FuturesOrderPayload, orderId: string, timestamp: string) => {
      const isImmediate = order.orderType === 'Market';
      const marginCost = order.totalCost;

      setMargin((prev) => ({
        available: Math.max(0, prev.available - marginCost),
        used: prev.used + marginCost,
      }));

      if (isImmediate) {
        setPositions((prev) => {
          const idx = prev.findIndex(
            (p) => p.symbol === order.symbol && p.side === order.futuresSide
          );
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = mergePosition(
              prev[idx],
              order.price,
              order.quantity,
              order.currentMarketPrice
            );
            return updated;
          }
          const { pnl, pnlPct } = calcUnrealizedPnl(
            order.futuresSide,
            order.price,
            order.currentMarketPrice,
            order.quantity
          );
          const newPosition: FuturesPosition = {
            id: orderId,
            side: order.futuresSide,
            symbol: order.symbol,
            expiry: order.expiry ?? 'Perpetual',
            leverage: order.leverage,
            sizeLots: order.quantity,
            entryPrice: order.price,
            markPrice: order.currentMarketPrice,
            unrealizedPnl: pnl,
            unrealizedPnlPct: pnlPct,
          };
          return [newPosition, ...prev];
        });
        return;
      }

      const openOrder: FuturesOpenOrder = {
        id: orderId,
        symbol: order.symbol,
        expiry: order.expiry ?? 'Perpetual',
        side: order.futuresSide,
        orderType: order.orderType,
        price: order.price,
        quantity: order.quantity,
        leverage: order.leverage,
        marginMode: order.marginMode,
        requiredMargin: order.totalCost,
        status: 'Pending',
        createdTime: timestamp,
        createdAt: Date.now(),
      };
      setOpenOrders((prev) => [openOrder, ...prev]);
    },
    []
  );

  const closePosition = useCallback((position: FuturesPosition) => {
    const releasedMargin =
      (position.entryPrice * position.sizeLots) / Math.max(position.leverage, 1);
    setMargin((prev) => ({
      available: prev.available + releasedMargin,
      used: Math.max(0, prev.used - releasedMargin),
    }));
    setPositions((prev) => prev.filter((p) => p.id !== position.id));
    setOrderHistory((prev) => [buildCloseHistory(position), ...prev]);
  }, []);

  const cancelOpenOrder = useCallback((order: FuturesOpenOrder) => {
    setMargin((prev) => ({
      available: prev.available + order.requiredMargin,
      used: Math.max(0, prev.used - order.requiredMargin),
    }));
    setOpenOrders((prev) => prev.filter((o) => o.id !== order.id));
    setOrderHistory((prev) => [buildCancelHistory(order), ...prev]);
  }, []);

  const fillOpenOrder = useCallback(
    (orderId: string): boolean => {
      let filled = false;

      setOpenOrders((prevOrders) => {
        const order = prevOrders.find((o) => o.id === orderId);
        if (!order) return prevOrders;

        const contract = contracts.find((c) => c.symbol === order.symbol);
        const markPrice = contract?.markPrice ?? order.price;
        filled = true;

        setPositions((prevPos) => {
          const idx = prevPos.findIndex((p) => p.symbol === order.symbol && p.side === order.side);
          if (idx >= 0) {
            const updated = [...prevPos];
            updated[idx] = mergePosition(prevPos[idx], order.price, order.quantity, markPrice);
            return updated;
          }

          const { pnl, pnlPct } = calcUnrealizedPnl(
            order.side,
            order.price,
            markPrice,
            order.quantity
          );
          const newPosition: FuturesPosition = {
            id: order.id,
            side: order.side,
            symbol: order.symbol,
            expiry: order.expiry,
            leverage: order.leverage,
            sizeLots: order.quantity,
            entryPrice: order.price,
            markPrice,
            unrealizedPnl: pnl,
            unrealizedPnlPct: pnlPct,
          };
          return [newPosition, ...prevPos];
        });

        setOrderHistory((prev) => [
          {
            id: `fh-${Date.now()}`,
            type: 'order_filled',
            symbol: order.symbol,
            side: order.side,
            quantity: order.quantity,
            price: order.price,
            leverage: order.leverage,
            orderType: order.orderType,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT',
          },
          ...prev,
        ]);

        return prevOrders.filter((o) => o.id !== orderId);
      });

      return filled;
    },
    [contracts]
  );

  const getPositionById = useCallback(
    (id: string) => positions.find((p) => p.id === id),
    [positions]
  );

  return (
    <FuturesContext.Provider
      value={{
        contracts,
        marginAvailable: margin.available,
        marginUsed: margin.used,
        isMarketLive,
        positions,
        openOrders,
        orderHistory,
        getContractBySymbol,
        fulfillFuturesOrder,
        closePosition,
        cancelOpenOrder,
        fillOpenOrder,
        getPositionById,
        addFuturesMargin,
      }}
    >
      {children}
    </FuturesContext.Provider>
  );
};

export const useFutures = () => useContext(FuturesContext);
