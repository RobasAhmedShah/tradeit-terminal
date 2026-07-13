export interface ChartRulerPoint {
  x: number;
  y: number;
}

export interface ChartRulerBounds {
  width: number;
  height: number;
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  minPrice: number;
  maxPrice: number;
}

export interface ChartRulerStats {
  startPrice: number;
  endPrice: number;
  delta: number;
  deltaPct: number;
  bars: number;
  isUp: boolean;
}

export function priceFromChartY(
  y: number,
  { height, paddingTop, paddingBottom, minPrice, maxPrice }: ChartRulerBounds,
): number {
  const plotH = Math.max(height - paddingTop - paddingBottom, 1);
  const clampedY = Math.min(Math.max(y, paddingTop), height - paddingBottom);
  const ratio = (clampedY - paddingTop) / plotH;
  return maxPrice - ratio * (maxPrice - minPrice);
}

export function chartYFromPrice(
  price: number,
  bounds: ChartRulerBounds,
): number {
  const { height, paddingTop, paddingBottom, minPrice, maxPrice } = bounds;
  const plotH = Math.max(height - paddingTop - paddingBottom, 1);
  const span = maxPrice - minPrice || 1;
  const ratio = (maxPrice - price) / span;
  return paddingTop + ratio * plotH;
}

export function computeRulerStats(
  start: ChartRulerPoint,
  end: ChartRulerPoint,
  bounds: ChartRulerBounds,
  barStepPx = 12,
): ChartRulerStats {
  const startPrice = priceFromChartY(start.y, bounds);
  const endPrice = priceFromChartY(end.y, bounds);
  const delta = endPrice - startPrice;
  const deltaPct = startPrice !== 0 ? (delta / startPrice) * 100 : 0;
  const bars = Math.max(1, Math.round(Math.abs(end.x - start.x) / barStepPx));

  return {
    startPrice,
    endPrice,
    delta,
    deltaPct,
    bars,
    isUp: delta >= 0,
  };
}

export function formatRulerPrice(value: number, decimals = 2): string {
  if (value >= 1000) return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value.toFixed(decimals);
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TIMEFRAME_UNIT_MS: Record<string, number> = {
  '1m': 60_000,
  '15m': 15 * 60_000,
  '1H': 60 * 60_000,
  '4H': 4 * 60 * 60_000,
  '1D': 24 * 60 * 60_000,
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * Maps a crosshair x-position to a time-axis label, anchoring the right edge of
 * the plot to "now" and stepping back one timeframe unit per bar to the left.
 */
export function rulerDateLabel(
  x: number,
  bounds: ChartRulerBounds,
  barStepPx: number,
  timeframe: string,
  now: Date = new Date(),
): string {
  const plotRight = bounds.width - bounds.paddingX;
  const step = Math.max(barStepPx, 1);
  const barsFromRight = Math.max(0, Math.round((plotRight - x) / step));
  const unitMs = TIMEFRAME_UNIT_MS[timeframe] ?? TIMEFRAME_UNIT_MS['1D'];
  const d = new Date(now.getTime() - barsFromRight * unitMs);
  const dayBased = timeframe === '1D' || timeframe === '4H';

  const datePart = `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} '${pad(d.getFullYear() % 100)}`;
  if (dayBased) return datePart;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
