import { Stock } from '../types';

function hashSymbol(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  return h;
}

export interface ChartPoint {
  x: number;
  y: number;
  price: number;
}

export interface CandlePoint {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isUp: boolean;
  volume: number;
}

export function generateLineSeries(stock: Stock, points = 24): ChartPoint[] {
  const seed = hashSymbol(stock.symbol);
  const base = stock.price;
  const range = Math.max(base * 0.04, 2);
  let price = base - range * 0.35;

  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin((i + seed % 10) * 0.55) * range * 0.35;
    const drift = (i / points) * range * 0.5;
    const noise = ((seed + i * 13) % 100) / 100 - 0.5;
    price = Math.max(base * 0.85, price + wave * 0.15 + noise * range * 0.08 + drift * 0.08);
    if (i === points - 1) price = base;
    return { x: i, y: 0, price };
  });
}

export type ChartTimeframe = '1m' | '15m' | '1H' | '4H' | '1D';

const TIMEFRAME_CONFIG: Record<ChartTimeframe, { count: number; step: number; span: number }> = {
  '1m': { count: 28, step: 10, span: 0.12 },
  '15m': { count: 22, step: 12, span: 0.22 },
  '1H': { count: 20, step: 13, span: 0.38 },
  '4H': { count: 18, step: 14, span: 0.58 },
  '1D': { count: 16, step: 15, span: 1 },
};

export function generateCandles(stock: Stock, timeframe: ChartTimeframe = '1D'): CandlePoint[] {
  const seed = hashSymbol(stock.symbol);
  const { count, step, span } = TIMEFRAME_CONFIG[timeframe];
  const tick = stock.price >= 1000 ? 0.5 : 0.25;
  const moveScale = Math.max(tick, stock.price * 0.001 * span);
  let close = stock.open ?? stock.price * (1 - 0.015 * span);

  return Array.from({ length: count }, (_, i) => {
    const dir = ((seed + i * 7) % 10) > 4 ? 1 : -1;
    const open = close;
    const move = moveScale * (1.2 + ((seed + i) % 5));
    close = Math.max(tick, open + dir * move);
    if (i === count - 1) close = stock.price;
    const high = Math.max(open, close) + tick * (((seed + i) % 3) + 1);
    const low = Math.min(open, close) - tick * (((seed + i + 2) % 3) + 1);
    return {
      x: 8 + i * step,
      open,
      high,
      low,
      close,
      isUp: close >= open,
      volume: 20 + ((seed + i * 5) % 80),
    };
  });
}

export function seriesToSvgPath(
  series: ChartPoint[],
  width: number,
  height: number,
  padding = 12
): { path: string; min: number; max: number } {
  const prices = series.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(series.length - 1, 1);

  const coords = series.map((p, i) => {
    const x = padding + i * stepX;
    const y = padding + ((max - p.price) / span) * (height - padding * 2);
    return { x, y };
  });

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`).join(' ');
  return { path, min, max };
}
