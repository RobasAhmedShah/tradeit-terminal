/** TradeIt design tokens — single source of truth for UI consistency. */
export const COLORS = {
  background: '#050505',
  card: '#111214',
  cardSoft: '#18191C',
  sheet: '#161719',
  input: '#1C1E22',
  inputMuted: '#202227',
  border: '#2A2B2F',
  sheetBorder: '#25272D',
  primary: '#FF8A00',
  buy: '#0ECB81',
  sell: '#F6465D',
  green: '#0ECB81',
  red: '#F6465D',
  muted: '#9CA3AF',
  mutedDark: '#8A8D93',
  mutedDarker: '#5C6068',
  text: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  primaryTint: '#1A0E00',
  primarySoft: 'rgba(255,138,0,0.12)',
  buySoft: 'rgba(14,203,129,0.12)',
  sellSoft: 'rgba(224, 46, 70, 0.69)',
};

export const SIZES = {
  padding: 16,
  radiusSm: 8,
  radius: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusPill: 999,
};

export const TYPO = {
  caption: 10,
  label: 11,
  body: 13,
  title: 15,
  heading: 17,
  hero: 28,
} as const;

/** Reusable NativeWind class bundles. */
export const UI = {
  screen: 'flex-1 bg-[#050505]',
  card: 'bg-[#111214] border border-[#2A2B2F] rounded-xl',
  cardLg: 'bg-[#111214] border border-[#2A2B2F] rounded-2xl',
  sheet: 'bg-[#161719] rounded-t-3xl border-t border-[#25272D]',
  input: 'bg-[#1C1E22] border border-[#25272D] rounded-xl',
  btnPrimary: 'bg-[#FF8A00] rounded-2xl py-4 items-center',
  btnPrimaryText: 'text-black font-bold text-[15px]',
  sectionTitle: 'text-white text-lg font-bold',
  sectionLink: 'text-[#FF8A00] text-sm font-semibold',
  label: 'text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider',
  muted: 'text-[#8A8D93]',
  divider: 'border-[#2A2B2F]',
} as const;
