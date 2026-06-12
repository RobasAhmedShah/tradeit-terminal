import { TradeExecution } from '../types';

export const MOCK_TRADES: Record<string, TradeExecution[]> = {
  AABS: [
    { id: 't1', price: 904.50, qty: 2000, time: '11:02:15', type: 'buy' },
    { id: 't2', price: 903.50, qty: 1500, time: '11:01:58', type: 'sell' },
    { id: 't3', price: 903.00, qty: 3400, time: '11:01:41', type: 'sell' },
    { id: 't4', price: 904.00, qty: 1200, time: '11:01:25', type: 'buy' },
    { id: 't5', price: 903.50, qty: 2600, time: '11:01:10', type: 'sell' },
    { id: 't6', price: 904.50, qty: 5000, time: '11:00:52', type: 'buy' },
    { id: 't7', price: 905.00, qty: 1800, time: '11:00:37', type: 'buy' },
    { id: 't8', price: 902.50, qty: 2100, time: '11:00:18', type: 'sell' },
    { id: 't9', price: 904.00, qty: 4300, time: '10:59:55', type: 'buy' },
    { id: 't10', price: 903.00, qty: 1700, time: '10:59:32', type: 'sell' },
    { id: 't11', price: 904.50, qty: 3900, time: '10:59:11', type: 'buy' },
    { id: 't12', price: 905.50, qty: 2200, time: '10:58:49', type: 'buy' },
  ],
  FANM: [
    { id: 't1', price: 7.55, qty: 20000, time: '11:02:15', type: 'buy' },
    { id: 't2', price: 7.50, qty: 15000, time: '11:01:58', type: 'sell' },
    { id: 't3', price: 7.45, qty: 34000, time: '11:01:41', type: 'sell' },
    { id: 't4', price: 7.55, qty: 12000, time: '11:01:25', type: 'buy' },
    { id: 't5', price: 7.50, qty: 26000, time: '11:01:10', type: 'sell' },
    { id: 't6', price: 7.60, qty: 50000, time: '11:00:52', type: 'buy' },
    { id: 't7', price: 7.65, qty: 18000, time: '11:00:37', type: 'buy' },
    { id: 't8', price: 7.40, qty: 21000, time: '11:00:18', type: 'sell' },
    { id: 't9', price: 7.55, qty: 43000, time: '10:59:55', type: 'buy' },
    { id: 't10', price: 7.45, qty: 17000, time: '10:59:32', type: 'sell' },
    { id: 't11', price: 7.60, qty: 39000, time: '10:59:11', type: 'buy' },
    { id: 't12', price: 7.70, qty: 22000, time: '10:58:49', type: 'buy' },
  ]
};
