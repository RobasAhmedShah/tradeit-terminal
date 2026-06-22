export type OrderStatus = 'Pending' | 'Partially Filled' | 'Executed' | 'Cancelled' | 'Rejected' | 'Queued';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'Limit' | 'Market' | 'Stop Limit';

export interface OrderTimelineEvent {
  title: string;
  time?: string;
  isCompleted: boolean;
  isActive?: boolean;
}

export interface Order {
  id: string;
  symbol: string;
  companyName: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  filledQty: number;
  remainingQty: number;
  price: number;
  avgPrice?: number;
  totalCost?: number;
  status: OrderStatus;
  createdTime: string;
  createdAt?: number;
  date: string;
  timeline: OrderTimelineEvent[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'PSX-2026-001245',
    symbol: 'FANM',
    companyName: 'Fauji Fertilizer Co. Ltd.',
    side: 'BUY',
    type: 'Limit',
    quantity: 100,
    filledQty: 40,
    remainingQty: 60,
    price: 904.00,
    avgPrice: 903.75,
    status: 'Partially Filled',
    createdTime: '11:24 AM',
    date: '12 Jun 2026',
    timeline: [
      { title: 'Created', time: '11:24:05 AM', isCompleted: true },
      { title: 'Submitted', time: '11:24:08 AM', isCompleted: true },
      { title: 'Exchange Accepted', time: '11:24:10 AM', isCompleted: true },
      { title: 'Partially Filled', time: '11:45:22 AM', isCompleted: true, isActive: true },
      { title: 'Fully Executed', isCompleted: false },
    ]
  },
  {
    id: 'PSX-2026-001246',
    symbol: 'SAZEW',
    companyName: 'Sazgar Engineering Works Ltd.',
    side: 'SELL',
    type: 'Limit',
    quantity: 500,
    filledQty: 0,
    remainingQty: 500,
    price: 2125.00,
    status: 'Pending',
    createdTime: '12:05 PM',
    date: '12 Jun 2026',
    timeline: [
      { title: 'Created', time: '12:05:10 PM', isCompleted: true },
      { title: 'Submitted', time: '12:05:12 PM', isCompleted: true },
      { title: 'Exchange Accepted', time: '12:05:15 PM', isCompleted: true, isActive: true },
      { title: 'Partially Filled', isCompleted: false },
      { title: 'Fully Executed', isCompleted: false },
    ]
  },
  {
    id: 'PSX-2026-001247',
    symbol: 'OGDC',
    companyName: 'Oil & Gas Development Company Ltd.',
    side: 'BUY',
    type: 'Market',
    quantity: 1000,
    filledQty: 1000,
    remainingQty: 0,
    price: 135.50,
    avgPrice: 135.50,
    status: 'Executed',
    createdTime: '09:30 AM',
    date: '11 Jun 2026',
    timeline: [
      { title: 'Created', time: '09:30:00 AM', isCompleted: true },
      { title: 'Submitted', time: '09:30:01 AM', isCompleted: true },
      { title: 'Exchange Accepted', time: '09:30:02 AM', isCompleted: true },
      { title: 'Fully Executed', time: '09:30:05 AM', isCompleted: true, isActive: true },
    ]
  },
  {
    id: 'PSX-2026-001248',
    symbol: 'HUBC',
    companyName: 'Hub Power Company Ltd.',
    side: 'SELL',
    type: 'Limit',
    quantity: 2000,
    filledQty: 0,
    remainingQty: 2000,
    price: 155.00,
    status: 'Cancelled',
    createdTime: '10:15 AM',
    date: '10 Jun 2026',
    timeline: [
      { title: 'Created', time: '10:15:00 AM', isCompleted: true },
      { title: 'Submitted', time: '10:15:02 AM', isCompleted: true },
      { title: 'Exchange Accepted', time: '10:15:05 AM', isCompleted: true },
      { title: 'Cancelled by User', time: '14:20:00 PM', isCompleted: true, isActive: true },
    ]
  },
  {
    id: 'PSX-2026-001249',
    symbol: 'TRG',
    companyName: 'TRG Pakistan Ltd.',
    side: 'BUY',
    type: 'Limit',
    quantity: 500,
    filledQty: 0,
    remainingQty: 500,
    price: 52.00,
    status: 'Rejected',
    createdTime: '14:00 PM',
    date: '09 Jun 2026',
    timeline: [
      { title: 'Created', time: '14:00:00 PM', isCompleted: true },
      { title: 'Submitted', time: '14:00:02 PM', isCompleted: true },
      { title: 'Rejected by Exchange', time: '14:00:05 PM', isCompleted: true, isActive: true },
    ]
  },
  {
    id: 'PSX-2026-001250',
    symbol: 'AABS',
    companyName: 'Al-Abbas Sugar Mills',
    side: 'BUY',
    type: 'Limit',
    quantity: 150,
    filledQty: 0,
    remainingQty: 150,
    price: 890.00,
    status: 'Queued',
    createdTime: '08:00 AM',
    date: '12 Jun 2026',
    timeline: [
      { title: 'Created', time: '08:00:00 AM', isCompleted: true },
      { title: 'Queued for Pre-Open', time: '08:00:05 AM', isCompleted: true, isActive: true },
      { title: 'Submitted', isCompleted: false },
      { title: 'Exchange Accepted', isCompleted: false },
    ]
  }
];
