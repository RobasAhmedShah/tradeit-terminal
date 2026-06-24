import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/ui/AppHeader';
import { TradeSearchBar } from '../../components/ui/TradeSearchBar';
import { FilterChip } from '../../components/ui/FilterChip';
import { AdvancedFilterChip } from '../../components/ui/AdvancedFilterChip';
import { MarketTableHeader } from '../../components/ui/MarketTableHeader';
import { StockRow } from '../../components/ui/StockRow';
import { KSE_100_SYMBOLS, KSE_30_SYMBOLS, MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { useWatchlist } from '../../context/WatchlistContext';
import {
  getDefaultSortDirection,
  getTradeMarketList,
  MARKET_FILTERS,
  MarketFilter,
  SORT_FIELDS,
  SortField,
} from '../../utils/tradeMarket';
import { loadTradeMarketPrefs, saveTradeMarketPrefs } from '../../utils/tradeMarketPrefs';
import { TradeListSkeleton } from '../../components/ui/ScreenSkeletons';

const FILTER_META: Record<MarketFilter, { isShariah?: boolean }> = {
  All: {},
  Shariah: { isShariah: true },
  'KSE 100': {},
  'KSE 30': {},
  'Top Volume': {},
  'Top Gainers': {},
  'Top Losers': {},
};

const SORT_ICONS: Partial<Record<SortField, 'bar-chart'>> = {
  Ranking: 'bar-chart',
};

export default function TradeScreen() {
  const router = useRouter();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  // Keep the TextInput responsive, but debounce the actual list filtering.
  const [draftQuery, setDraftQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<MarketFilter>('All');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadTradeMarketPrefs().then((prefs) => {
      if (!mounted) return;
      setActiveFilter(prefs.activeFilter);
      setSortField(prefs.sortField);
      setSortDirection(prefs.sortDirection);
      setPrefsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;

    saveTradeMarketPrefs({
      activeFilter,
      sortField,
      sortDirection,
    });
  }, [activeFilter, sortField, sortDirection, prefsLoaded]);

  const filteredStocks = useMemo(
    () =>
      getTradeMarketList(MOCK_MARKET_STOCKS, {
        searchQuery,
        filter: activeFilter,
        sortField,
        sortDirection,
        indexSets: { kse100: KSE_100_SYMBOLS, kse30: KSE_30_SYMBOLS },
      }),
    [searchQuery, activeFilter, sortField, sortDirection]
  );

  const handleRowPress = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  const handleFilterPress = (filter: MarketFilter) => {
    setActiveFilter(filter);
  };

  const handleSortPress = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortField(field);
    setSortDirection(getDefaultSortDirection(field));
  };

  const header = useMemo(
    () => (
      <View className="bg-[#050505]">
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {MARKET_FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                isShariah={FILTER_META[filter].isShariah}
                isActive={activeFilter === filter}
                onPress={() => handleFilterPress(filter)}
              />
            ))}
            <View className="w-4" />
          </ScrollView>
        </View>

        <View className="py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {SORT_FIELDS.map((field) => (
              <AdvancedFilterChip
                key={field}
                label={field}
                icon={SORT_ICONS[field]}
                isActive={sortField === field}
                sortDirection={sortField === field ? sortDirection : undefined}
                onPress={() => handleSortPress(field)}
              />
            ))}
            <View className="w-4" />
          </ScrollView>
        </View>

        <MarketTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSortPress={handleSortPress}
        />
      </View>
    ),
    [activeFilter, sortField, sortDirection]
  );

  const renderEmpty = () => (
    <View className="items-center justify-center px-8 py-16">
      <Ionicons name="search-outline" size={40} color="#2A2B2F" />
      <Text className="text-white text-base font-semibold mt-4 text-center">No stocks found</Text>
      <Text className="text-[#9CA3AF] text-sm mt-2 text-center">
        {draftQuery.trim()
          ? `No results for "${draftQuery.trim()}". Try another symbol or company name.`
          : 'No stocks match the selected filters. Try a different filter.'}
      </Text>
    </View>
  );

  // Debounce list filtering so typing doesn't steal focus.
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(draftQuery), 200);
    return () => clearTimeout(t);
  }, [draftQuery]);

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader />

      <TradeSearchBar value={draftQuery} onChangeText={setDraftQuery} />

      {!prefsLoaded ? (
        <TradeListSkeleton />
      ) : (
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockRow
            stock={item}
            onPress={() => handleRowPress(item.symbol)}
            isWatchlisted={isWatchlisted(item.symbol)}
            onWatchlistPress={() => toggleWatchlist(item)}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        // Keep layout stable while typing so the TextInput doesn't lose focus
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      )}
    </SafeAreaView>
  );
}
