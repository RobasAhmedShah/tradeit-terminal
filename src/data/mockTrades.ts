export interface TradeEntry {
  id: string;
  price: number;
  qty: number;
  time: string;
  type: 'buy' | 'sell';
}

export const MOCK_TRADES: Record<string, TradeEntry[]> = {
  AABS: [
    { id: 't1', price: 904.00, qty: 2000, time: '11:02:15', type: 'buy' },
    { id: 't2', price: 903.50, qty: 1500, time: '11:01:58', type: 'sell' },
    { id: 't3', price: 903.00, qty: 3400, time: '11:01:41', type: 'sell' },
    { id: 't4', price: 904.00, qty: 1200, time: '11:01:25', type: 'buy' },
    { id: 't5', price: 903.50, qty: 2600, time: '11:01:10', type: 'sell' },
  ],
  FANM: [
    { id: 't1', price: 904.50, qty: 2000, time: '11:02:15', type: 'buy' },
    { id: 't2', price: 903.50, qty: 1500, time: '11:01:58', type: 'sell' },
    { id: 't3', price: 903.00, qty: 3400, time: '11:01:41', type: 'sell' },
    { id: 't4', price: 904.50, qty: 1200, time: '11:01:25', type: 'buy' },
    { id: 't5', price: 903.50, qty: 2600, time: '11:01:10', type: 'sell' },
  ]
};
