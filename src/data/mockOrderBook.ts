import { OrderBookLevel } from '../types';

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: {
    value: number;
    percent: number;
  };
}

export const MOCK_ORDER_BOOK: Record<string, OrderBookData> = {
  AABS: {
    bids: [
      { price: 903.50, qty: 5200 },
      { price: 903.00, qty: 8400 },
      { price: 902.50, qty: 12600 },
      { price: 902.00, qty: 18300 },
      { price: 901.50, qty: 9700 },
      { price: 901.00, qty: 7900 },
      { price: 900.50, qty: 6200 },
      { price: 900.00, qty: 11500 },
      { price: 899.50, qty: 4100 },
      { price: 899.00, qty: 3800 },
    ],
    asks: [
      { price: 904.50, qty: 6300 },
      { price: 905.00, qty: 7800 },
      { price: 905.50, qty: 11200 },
      { price: 906.00, qty: 13400 },
      { price: 906.50, qty: 15600 },
      { price: 907.00, qty: 8900 },
      { price: 907.50, qty: 6700 },
      { price: 908.00, qty: 10200 },
      { price: 908.50, qty: 5400 },
      { price: 909.00, qty: 3900 },
    ],
    spread: {
      value: 0.50,
      percent: 0.06,
    }
  },
  FANM: {
    bids: [
      { price: 7.50, qty: 52000 },
      { price: 7.45, qty: 84000 },
      { price: 7.40, qty: 126000 },
      { price: 7.35, qty: 183000 },
      { price: 7.30, qty: 97000 },
      { price: 7.25, qty: 79000 },
      { price: 7.20, qty: 62000 },
      { price: 7.15, qty: 115000 },
      { price: 7.10, qty: 41000 },
      { price: 7.05, qty: 38000 },
    ],
    asks: [
      { price: 7.55, qty: 63000 },
      { price: 7.60, qty: 78000 },
      { price: 7.65, qty: 112000 },
      { price: 7.70, qty: 134000 },
      { price: 7.75, qty: 156000 },
      { price: 7.80, qty: 89000 },
      { price: 7.85, qty: 67000 },
      { price: 7.90, qty: 102000 },
      { price: 7.95, qty: 54000 },
      { price: 8.00, qty: 39000 },
    ],
    spread: {
      value: 0.05,
      percent: 0.66,
    }
  }
};
