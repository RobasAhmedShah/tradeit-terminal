/** Brand colors for PSX stock logos (fallback when image fails). */
export const STOCK_LOGO_COLORS: Record<string, string> = {
  FANM: '#1B5E20',
  FFLM: '#2E7D32',
  FTSM: '#455A64',
  REDCO: '#E65100',
  BPL: '#0D47A1',
  PSO: '#B71C1C',
  HBL: '#1565C0',
  OGDC: '#00695C',
  AABS: '#6A1B9A',
  PIAHCLB: '#0277BD',
  SAZEW: '#C62828',
  LEUL: '#37474F',
  FATM: '#558B2F',
  IDSM: '#5D4037',
  PAKQATAR: '#1A237E',
  ZUMA: '#4E342E',
  PQGTL: '#283593',
  SNGP: '#00838F',
  BTC: '#F7931A',
};

const FALLBACK_PALETTE = [
  '#FF8A00',
  '#0ECB81',
  '#3B9EFF',
  '#A78BFA',
  '#F6465D',
  '#14B8A6',
  '#F59E0B',
  '#6366F1',
];

/** Direct brand logo URLs (TradingView / verified sources). */
export const STOCK_LOGO_URLS: Record<string, string> = {
  FFLM: 'https://s3-symbol-logo.tradingview.com/first-fidelity-leasing-modaraba--600.png',
  FTSM: 'https://s3-symbol-logo.tradingview.com/first-tri-star-modaraba--600.png',
  REDCO: 'https://s3-symbol-logo.tradingview.com/redco-textiles--big.svg',
  AABS: 'https://s3-symbol-logo.tradingview.com/al-abbas-sugar-mills--big.svg',
  SAZEW: 'https://s3-symbol-logo.tradingview.com/sazgar-engineering-works--big.svg',
  LEUL: 'https://s3-symbol-logo.tradingview.com/centrus--big.svg',
  IDSM: 'https://s3-symbol-logo.tradingview.com/ideal-spinning-mills--big.svg',
  ZUMA: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQED3lx7fWzSK0WYbCRwWN-yHOl_rSGd-FojGpMak1KEFNQlPo3TpGygoA&s=10',
};

/** MarketScreener / ZoneBourse instrument IDs for PSX company logos. */
const STOCK_LOGO_INSTRUMENT_IDS: Record<string, number> = {
  FANM: 6492700,
  FFLM: 6495780,
  FTSM: 6496906,
  REDCO: 46699028,
  BPL: 20702002,
  PSO: 6492706,
  HBL: 6493903,
  OGDC: 6496743,
  AABS: 20703816,
  SAZEW: 20706823,
  LEUL: 46699000,
  FATM: 6500938,
  IDSM: 20703837,
  ZUMA: 46698952,
};

const ZONE_BOURSE_LOGO = (id: number) =>
  `https://cdn.zonebourse.com/static/instruments-squared-${id}`;

export function getStockLogoColor(symbol: string, explicit?: string): string {
  if (explicit) return explicit;
  const key = symbol.toUpperCase();
  if (STOCK_LOGO_COLORS[key]) return STOCK_LOGO_COLORS[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

export function getStockLogoInitials(symbol: string): string {
  const clean = symbol.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (clean.length >= 2) return clean.slice(0, 2);
  return (clean || '?').slice(0, 1);
}

function normalizeDomain(website?: string): string | undefined {
  if (!website) return undefined;
  const domain = website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  return domain || undefined;
}

/** Ordered logo candidates: explicit URL → brand CDN → site favicons. */
export function getStockLogoUris(
  symbol: string,
  website?: string,
  logoUrl?: string,
): string[] {
  const uris: string[] = [];
  if (logoUrl) uris.push(logoUrl);

  const key = symbol.toUpperCase();
  if (STOCK_LOGO_URLS[key]) uris.push(STOCK_LOGO_URLS[key]);

  const instrumentId = STOCK_LOGO_INSTRUMENT_IDS[key];
  if (instrumentId) uris.push(ZONE_BOURSE_LOGO(instrumentId));

  const domain = normalizeDomain(website);
  if (domain) {
    uris.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    uris.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  }

  return [...new Set(uris)];
}

/** Primary logo URI for a stock symbol. */
export function getStockLogoUri(
  symbol: string,
  website?: string,
  logoUrl?: string,
): string | undefined {
  return getStockLogoUris(symbol, website, logoUrl)[0];
}

/** @deprecated Use getStockLogoUri(symbol, website) instead. */
export function getStockLogoUriFromWebsite(website?: string): string | undefined {
  const domain = normalizeDomain(website);
  if (!domain) return undefined;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
