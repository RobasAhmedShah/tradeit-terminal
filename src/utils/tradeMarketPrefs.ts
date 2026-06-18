import AsyncStorage from '@react-native-async-storage/async-storage';
import { MARKET_FILTERS, MarketFilter, SORT_FIELDS, SortField } from './tradeMarket';

const STORAGE_KEY = '@tradeit/trade_market_prefs';

export interface TradeMarketPrefs {
  activeFilter: MarketFilter;
  sortField: SortField | null;
  sortDirection: 'asc' | 'desc';
}

export const DEFAULT_TRADE_MARKET_PREFS: TradeMarketPrefs = {
  activeFilter: 'All',
  sortField: null,
  sortDirection: 'desc',
};

function isMarketFilter(value: unknown): value is MarketFilter {
  return typeof value === 'string' && MARKET_FILTERS.includes(value as MarketFilter);
}

function isSortField(value: unknown): value is SortField {
  return typeof value === 'string' && SORT_FIELDS.includes(value as SortField);
}

export async function loadTradeMarketPrefs(): Promise<TradeMarketPrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TRADE_MARKET_PREFS;

    const parsed = JSON.parse(raw) as Partial<TradeMarketPrefs>;

    return {
      activeFilter: isMarketFilter(parsed.activeFilter)
        ? parsed.activeFilter
        : DEFAULT_TRADE_MARKET_PREFS.activeFilter,
      sortField:
        parsed.sortField === null
          ? null
          : isSortField(parsed.sortField)
            ? parsed.sortField
            : null,
      sortDirection: parsed.sortDirection === 'asc' ? 'asc' : 'desc',
    };
  } catch {
    return DEFAULT_TRADE_MARKET_PREFS;
  }
}

export async function saveTradeMarketPrefs(prefs: TradeMarketPrefs): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage failures should not block the trade screen.
  }
}
