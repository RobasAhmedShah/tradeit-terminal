import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MOCK_MARKET_STOCKS } from '../data/mockStocks';
import { PortfolioHolding, PortfolioSummary } from '../data/mockPortfolio';
import { PortfolioActivity } from '../data/portfolioActivity';
import { Stock } from '../types';
import { tickStockPrice } from '../utils/marketsHub';
import {
  DEFAULT_PORTFOLIO_STATE,
  loadPortfolioState,
  PortfolioHoldingCore,
  PortfolioPersistedState,
  savePortfolioState,
} from '../utils/portfolioPrefs';

export interface SpotOrderPayload {
  symbol: string;
  companyName?: string;
  side: 'BUY' | 'SELL' | string;
  price: number;
  quantity: number;
  totalCost: number;
  orderId?: string;
  orderType?: string;
}

function mergeHolding(
  existing: PortfolioHoldingCore,
  quantity: number,
  price: number
): PortfolioHoldingCore {
  const newQty = existing.qty + quantity;
  const newAvg =
    newQty > 0
      ? (existing.avgCost * existing.qty + price * quantity) / newQty
      : existing.avgCost;
  return { ...existing, qty: newQty, avgCost: newAvg };
}

function toDisplayHolding(core: PortfolioHoldingCore, stock?: Stock): PortfolioHolding {
  const livePrice = stock?.price ?? core.avgCost;
  const currentValue = core.qty * livePrice;
  const dayChange = core.qty * (stock?.changeValue ?? 0);
  return {
    symbol: core.symbol,
    name: core.name,
    qty: core.qty,
    currentValue,
    avgCost: core.avgCost,
    dayChange,
    dayChangePct: stock?.changePercent ?? 0,
    chartPath: core.chartPath,
  };
}

function buildSummary(holdings: PortfolioHolding[], buyingPower: number): PortfolioSummary {
  const holdingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const invested = holdings.reduce((sum, h) => sum + h.qty * h.avgCost, 0);
  const todayPnl = holdings.reduce((sum, h) => sum + h.dayChange, 0);
  const totalReturn = holdingsValue - invested;
  const baseForPct = holdingsValue - todayPnl;

  return {
    totalValue: holdingsValue + buyingPower,
    holdingsValue,
    todayPnl,
    todayPnlPct: baseForPct > 0 ? Math.round((todayPnl / baseForPct) * 10000) / 100 : 0,
    totalReturn,
    totalReturnPct: invested > 0 ? Math.round((totalReturn / invested) * 10000) / 100 : 0,
    invested,
    buyingPower,
  };
}

function prependActivity(activities: PortfolioActivity[], item: PortfolioActivity): PortfolioActivity[] {
  return [item, ...activities].slice(0, 50);
}

interface PortfolioContextType {
  holdings: PortfolioHolding[];
  recentTradeSymbols: string[];
  summary: PortfolioSummary;
  activities: PortfolioActivity[];
  isRefreshing: boolean;
  lastRefreshedAt: number | null;
  applySpotTrade: (order: SpotOrderPayload) => void;
  addCash: (amount: number) => void;
  withdrawCash: (amount: number) => void;
  refreshPortfolio: () => Promise<void>;
  getStockBySymbol: (symbol: string) => Stock | undefined;
  getHolding: (symbol: string) => PortfolioHolding | undefined;
}

const PortfolioContext = createContext<PortfolioContextType>({
  holdings: [],
  recentTradeSymbols: [],
  summary: {
    totalValue: 0,
    holdingsValue: 0,
    todayPnl: 0,
    todayPnlPct: 0,
    totalReturn: 0,
    totalReturnPct: 0,
    invested: 0,
    buyingPower: 0,
  },
  activities: [],
  isRefreshing: false,
  lastRefreshedAt: null,
  applySpotTrade: () => {},
  addCash: () => {},
  withdrawCash: () => {},
  refreshPortfolio: async () => {},
  getStockBySymbol: () => undefined,
  getHolding: () => undefined,
});

const stockMap = new Map(MOCK_MARKET_STOCKS.map((s) => [s.symbol, s]));

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioPersistedState>(DEFAULT_PORTFOLIO_STATE);
  const [livePrices, setLivePrices] = useState<Record<string, Stock>>({});
  const [recentTradeSymbols, setRecentTradeSymbols] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);

  useEffect(() => {
    loadPortfolioState().then((state) => {
      setPortfolio(state);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    savePortfolioState(portfolio);
  }, [portfolio, loaded]);

  const holdingSymbols = useMemo(
    () => portfolio.holdings.filter((h) => h.qty > 0).map((h) => h.symbol),
    [portfolio.holdings]
  );

  useEffect(() => {
    if (holdingSymbols.length === 0) return;

    const tick = () => {
      setLivePrices((prev) => {
        const next = { ...prev };
        for (const sym of holdingSymbols) {
          const base = next[sym] ?? stockMap.get(sym);
          if (base) next[sym] = tickStockPrice(base);
        }
        return next;
      });
    };

    const id = setInterval(tick, 3500);
    return () => clearInterval(id);
  }, [holdingSymbols]);

  const holdings = useMemo(
    () =>
      portfolio.holdings
        .filter((h) => h.qty > 0)
        .map((core) => toDisplayHolding(core, livePrices[core.symbol] ?? stockMap.get(core.symbol))),
    [portfolio.holdings, livePrices]
  );

  const summary = useMemo(
    () => buildSummary(holdings, portfolio.buyingPower),
    [holdings, portfolio.buyingPower]
  );

  const getStockBySymbol = useCallback((symbol: string) => stockMap.get(symbol), []);

  const getHolding = useCallback(
    (symbol: string) => holdings.find((h) => h.symbol === symbol),
    [holdings]
  );

  const refreshPortfolio = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const state = await loadPortfolioState();
    setPortfolio(state);
    setLastRefreshedAt(Date.now());
    setIsRefreshing(false);
  }, []);

  const addCash = useCallback((amount: number) => {
    if (amount <= 0) return;
    const activity: PortfolioActivity = {
      id: `act-dep-${Date.now()}`,
      type: 'deposit',
      title: 'Deposit received',
      subtitle: 'Added to buying power',
      amount,
      timestamp: Date.now(),
      status: 'completed',
    };
    setPortfolio((prev) => ({
      ...prev,
      buyingPower: prev.buyingPower + amount,
      activities: prependActivity(prev.activities, activity),
    }));
  }, []);

  const withdrawCash = useCallback((amount: number) => {
    if (amount <= 0) return;
    setPortfolio((prev) => {
      if (prev.buyingPower < amount) return prev;
      const activity: PortfolioActivity = {
        id: `act-wd-${Date.now()}`,
        type: 'withdraw',
        title: 'Withdrawal submitted',
        subtitle: 'Processing to your bank',
        amount,
        timestamp: Date.now(),
        status: 'processing',
      };
      return {
        ...prev,
        buyingPower: prev.buyingPower - amount,
        activities: prependActivity(prev.activities, activity),
      };
    });
  }, []);

  const applySpotTrade = useCallback((order: SpotOrderPayload) => {
    const isBuy = order.side === 'BUY' || order.side === 'Buy' || order.side === 'buy';
    const price = Number(order.price);
    const quantity = Number(order.quantity);
    const totalCost = Number(order.totalCost);
    if (!order.symbol || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    const orderType = order.orderType ?? 'Market';
    const activity: PortfolioActivity = {
      id: `act-${Date.now()}`,
      type: isBuy ? 'buy' : 'sell',
      title: isBuy ? `Bought ${order.symbol}` : `Sold ${order.symbol}`,
      subtitle: `${order.side} ${quantity} @ Rs ${price.toLocaleString()} · ${orderType}`,
      amount: totalCost,
      symbol: order.symbol,
      orderId: order.orderId,
      timestamp: Date.now(),
      status: 'completed',
    };

    setPortfolio((prev) => {
      if (isBuy) {
        if (!Number.isFinite(totalCost) || totalCost > prev.buyingPower) return prev;

        const idx = prev.holdings.findIndex((h) => h.symbol === order.symbol);
        let holdings: PortfolioHoldingCore[];
        if (idx >= 0) {
          holdings = [...prev.holdings];
          holdings[idx] = mergeHolding(prev.holdings[idx], quantity, price);
        } else {
          const stock = stockMap.get(order.symbol);
          holdings = [
            {
              symbol: order.symbol,
              name: order.companyName ?? stock?.name ?? order.symbol,
              qty: quantity,
              avgCost: price,
              chartPath: 'M0,12 L10,8 L20,14 L30,6 L40,10',
            },
            ...prev.holdings,
          ];
        }

        return {
          buyingPower: prev.buyingPower - totalCost,
          holdings,
          activities: prependActivity(prev.activities, activity),
        };
      }

      const existing = prev.holdings.find((h) => h.symbol === order.symbol);
      if (!existing || existing.qty < quantity) return prev;

      const holdings = prev.holdings.map((h) =>
        h.symbol === order.symbol
          ? { ...h, qty: Math.max(0, h.qty - quantity) }
          : h
      );

      return {
        buyingPower: prev.buyingPower + totalCost,
        holdings,
        activities: prependActivity(prev.activities, activity),
      };
    });

    setRecentTradeSymbols((prev) => [order.symbol, ...prev.filter((s) => s !== order.symbol)].slice(0, 20));
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        recentTradeSymbols,
        summary,
        activities: portfolio.activities,
        isRefreshing,
        lastRefreshedAt,
        applySpotTrade,
        addCash,
        withdrawCash,
        refreshPortfolio,
        getStockBySymbol,
        getHolding,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
