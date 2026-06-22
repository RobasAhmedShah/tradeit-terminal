import { OrderBookData } from '../data/mockOrderBook';
import { TradeExecution } from '../types';
import { Stock } from '../types';

function hashSymbol(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  return h;
}

function tickSize(price: number): number {
  if (price >= 1000) return 0.5;
  if (price >= 100) return 0.25;
  if (price >= 10) return 0.05;
  return 0.01;
}

export function buildOrderBookForStock(stock: Stock): OrderBookData {
  const tick = tickSize(stock.price);
  const spread = tick;
  const bestBid = stock.price - spread / 2;
  const bestAsk = stock.price + spread / 2;
  const seed = hashSymbol(stock.symbol);

  const bids = Array.from({ length: 11 }, (_, i) => {
    const qtyBase = 3000 + ((seed + i * 17) % 15000);
    return {
      price: Math.max(tick, bestBid - i * tick),
      qty: qtyBase + i * 420,
    };
  });

  const asks = Array.from({ length: 11 }, (_, i) => ({
    price: bestAsk + i * tick,
    qty: 2800 + ((seed + i * 23) % 14000) + i * 380,
  }));

  const spreadPct = stock.price > 0 ? (spread / stock.price) * 100 : 0;

  return {
    bids,
    asks,
    spread: {
      value: spread,
      percent: Math.round(spreadPct * 100) / 100,
    },
  };
}

export function buildTradesForStock(stock: Stock): TradeExecution[] {
  const seed = hashSymbol(stock.symbol);
  const tick = tickSize(stock.price);
  const sides: ('buy' | 'sell')[] = ['buy', 'sell', 'sell', 'buy', 'buy', 'sell', 'buy', 'sell', 'buy', 'sell', 'buy', 'sell'];

  return sides.map((type, i) => {
    const offset = ((seed + i) % 7) * tick * (type === 'buy' ? -1 : 1);
    const price = Math.max(tick, stock.price + offset);
    const qty = 800 + ((seed + i * 11) % 4500);
    const minute = 2 + i;
    const second = (seed + i * 7) % 60;
    return {
      id: `${stock.symbol}-t${i}`,
      price,
      qty,
      time: `11:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
      type,
    };
  });
}

export function getOrderBook(symbol: string, stock?: Stock): OrderBookData {
  if (stock) return buildOrderBookForStock(stock);
  const fallback: Stock = {
    id: 'fb',
    symbol,
    name: symbol,
    price: 904,
    changePercent: 0,
    isPositive: true,
  };
  return buildOrderBookForStock(fallback);
}

export function getTrades(symbol: string, stock?: Stock): TradeExecution[] {
  if (stock) return buildTradesForStock(stock);
  const fallback: Stock = {
    id: 'fb',
    symbol,
    name: symbol,
    price: 904,
    changePercent: 0,
    isPositive: true,
  };
  return buildTradesForStock(fallback);
}
