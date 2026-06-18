import { FuturesOrderType } from '../data/mockFutures';

export const MOCK_AVAILABLE_MARGIN = 111_331;
export const MOCK_USED_MARGIN = 18_742;

export function calcLotsFromMarginPercent(
  availableMargin: number,
  percent: number,
  price: number,
  leverage: number,
  orderType: FuturesOrderType
): number {
  if (percent <= 0 || price <= 0 || leverage <= 0) return 0;
  const marginToUse = availableMargin * (percent / 100);
  const orderValue = marginToUse * leverage;
  const lots = orderValue / price;
  const rounded = Math.floor(lots * 10) / 10;
  return orderType === 'Market' ? Math.max(1, rounded) : Math.max(0.1, rounded);
}

export function calcMarginUsageRatio(used: number, available: number): string {
  if (available <= 0) return '0%';
  return `${((used / (used + available)) * 100).toFixed(1)}%`;
}
