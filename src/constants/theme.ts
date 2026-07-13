import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  cardSoft: string;
  sheet: string;
  input: string;
  inputMuted: string;
  border: string;
  sheetBorder: string;
  primary: string;
  buy: string;
  sell: string;
  green: string;
  red: string;
  muted: string;
  mutedDark: string;
  mutedDarker: string;
  text: string;
  textSecondary: string;
  white: string;
  black: string;
  primaryTint: string;
  primarySoft: string;
  buySoft: string;
  sellSoft: string;
  tabBar: string;
  headerIcon: string;
  dangerBg: string;
};

export const LIGHT_COLORS: ThemeColors = {
  background: '#F4F5F7',
  card: '#FFFFFF',
  cardSoft: '#F0F1F3',
  sheet: '#FFFFFF',
  input: '#FFFFFF',
  inputMuted: '#F0F1F3',
  border: '#E4E6EB',
  sheetBorder: '#E4E6EB',
  primary: '#FF8A00',
  buy: '#0ECB81',
  sell: '#F6465D',
  green: '#0ECB81',
  red: '#F6465D',
  muted: '#6B7280',
  mutedDark: '#6B7280',
  mutedDarker: '#9CA3AF',
  text: '#111827',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
  primaryTint: '#FFF4E6',
  primarySoft: 'rgba(255,138,0,0.12)',
  buySoft: 'rgba(14,203,129,0.12)',
  sellSoft: 'rgba(246,70,93,0.12)',
  tabBar: '#FFFFFF',
  headerIcon: '#111827',
  dangerBg: '#FEF2F2',
};

export const DARK_COLORS: ThemeColors = {
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
  textSecondary: '#9CA3AF',
  white: '#FFFFFF',
  black: '#000000',
  primaryTint: '#1A0E00',
  primarySoft: 'rgba(255,138,0,0.12)',
  buySoft: 'rgba(14,203,129,0.12)',
  sellSoft: 'rgba(224, 46, 70, 0.69)',
  tabBar: '#111214',
  headerIcon: '#FFFFFF',
  dangerBg: '#200006',
};

/** @deprecated Prefer useTheme().colors — kept for gradual migration. Defaults to light. */
export const COLORS = LIGHT_COLORS;

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

export const UI = {
  screen: 'flex-1 bg-app-bg',
  card: 'bg-app-card border border-app-border rounded-xl',
  cardLg: 'bg-app-card border border-app-border rounded-2xl',
  sheet: 'bg-app-sheet rounded-t-3xl border-t border-app-border',
  input: 'bg-app-input border border-app-border rounded-xl',
  btnPrimary: 'bg-[#FF8A00] rounded-2xl py-4 items-center',
  btnPrimaryText: 'text-black font-bold text-[15px]',
  sectionTitle: 'text-app-text text-lg font-bold',
  sectionLink: 'text-[#FF8A00] text-sm font-semibold',
  label: 'text-app-muted text-[10px] font-semibold uppercase tracking-wider',
  muted: 'text-app-muted',
  divider: 'border-app-border',
} as const;

const STORAGE_KEY = '@tradeit/theme_mode_v1';

export async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch {
    // ignore
  }
  return 'light';
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function colorsForMode(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
