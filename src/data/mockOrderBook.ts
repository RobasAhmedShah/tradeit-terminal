export interface OrderBookEntry {
  price: number;
  qty: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
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
    ],
    asks: [
      { price: 904.00, qty: 6300 },
      { price: 904.50, qty: 7800 },
      { price: 905.00, qty: 11200 },
      { price: 905.50, qty: 13400 },
      { price: 906.00, qty: 15600 },
    ],
    spread: {
      value: 0.50,
      percent: 0.06,
    }
  },
  FANM: {
    bids: [
      { price: 903.50, qty: 5200 },
      { price: 903.00, qty: 8400 },
      { price: 902.50, qty: 12600 },
      { price: 902.00, qty: 18300 },
      { price: 901.50, qty: 9700 },
    ],
    asks: [
      { price: 904.50, qty: 6300 },
      { price: 905.00, qty: 7800 },
      { price: 905.50, qty: 11200 },
      { price: 906.00, qty: 13400 },
      { price: 906.50, qty: 15600 },
    ],
    spread: {
      value: 1.00,
      percent: 0.11,
    }
  }
};
