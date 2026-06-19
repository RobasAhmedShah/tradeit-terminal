import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWatchlist } from '../context/WatchlistContext';
import { MOCK_TOP_GAINERS, MOCK_TOP_LOSERS } from '../data/mockStocks';
import { Stock } from '../types';
import {
  filterStocks,
  getMostActiveStocks,
  MoverSegment,
  MoverSort,
  MarketsTab,
  parseMarketsTab,
  parseMoverSegment,
  sortStocks,
  tickStockPrice,
  WatchlistSort,
} from '../utils/marketsHub';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { MarketMoverRow } from '../components/markets/MarketMoverRow';
import { WatchlistSwipeRow } from '../components/markets/WatchlistSwipeRow';
import {
  NewsCategoryTabs,
  NewsTabPanel,
  NewsFilter,
} from '../components/markets/NewsTabPanel';
import { MarketsSkeleton } from '../components/markets/MarketsSkeleton';
import { MarketsEmptyState } from '../components/markets/MarketsEmptyState';
import { MarketsErrorState } from '../components/markets/MarketsErrorState';
import { SortFilterSheet } from '../components/markets/SortFilterSheet';

const MAIN_TABS: { id: MarketsTab; label: string }[] = [
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'movers', label: 'Movers' },
  { id: 'news', label: 'News' },
];

const MOVER_SEGMENTS: { id: MoverSegment; label: string }[] = [
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Top Losers' },
  { id: 'active', label: 'Most Active' },
];

export default function MarketsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string; type?: string; category?: string }>();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const initialTab = parseMarketsTab(params.tab);
  const initialSegment = parseMoverSegment(params.type);

  const [activeTab, setActiveTab] = useState<MarketsTab>(initialTab);
  const [moverSegment, setMoverSegment] = useState<MoverSegment>(initialSegment);
  const [query, setQuery] = useState('');
  const [watchlistSort, setWatchlistSort] = useState<WatchlistSort>('change');
  const [moverSort, setMoverSort] = useState<MoverSort>('change');
  const [showSort, setShowSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);
  const [liveMap, setLiveMap] = useState<Record<string, Stock>>({});
  const [dismissedNews, setDismissedNews] = useState<Set<string>>(new Set());
  const [savedNews, setSavedNews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (params.tab) setActiveTab(parseMarketsTab(params.tab));
    if (params.type) setMoverSegment(parseMoverSegment(params.type));
  }, [params.tab, params.type]);

  const baseMovers = useMemo(() => {
    if (moverSegment === 'gainers') return MOCK_TOP_GAINERS;
    if (moverSegment === 'losers') return MOCK_TOP_LOSERS;
    return getMostActiveStocks();
  }, [moverSegment]);

  const applyLive = useCallback(
    (stocks: Stock[]) =>
      stocks.map((s) => liveMap[s.symbol] ?? s),
    [liveMap]
  );

  const watchlistData = useMemo(() => {
    const live = applyLive(watchlist);
    return sortStocks(filterStocks(live, query), watchlistSort) as Stock[];
  }, [watchlist, query, watchlistSort, applyLive]);

  const moversData = useMemo(() => {
    const live = applyLive(baseMovers);
    const sorted = sortStocks(live, moverSort) as Stock[];
    return filterStocks(sorted, query);
  }, [baseMovers, query, moverSort, applyLive]);

  useEffect(() => {
    const symbols = new Set<string>();
    watchlist.forEach((s) => symbols.add(s.symbol));
    baseMovers.forEach((s) => symbols.add(s.symbol));

    const interval = setInterval(() => {
      setLiveMap((prev) => {
        const next = { ...prev };
        symbols.forEach((sym) => {
          const source =
            watchlist.find((s) => s.symbol === sym) ??
            baseMovers.find((s) => s.symbol === sym);
          if (source) next[sym] = tickStockPrice(prev[sym] ?? source);
        });
        return next;
      });
      setPulseTick((t) => t + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [watchlist, baseMovers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(false);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 450);
  };

  const sortOptions =
    activeTab === 'watchlist'
      ? [
          { key: 'change', label: '% Change' },
          { key: 'price', label: 'Price' },
          { key: 'name', label: 'Alphabetical' },
        ]
      : activeTab === 'movers'
        ? [
            { key: 'change', label: '% Change' },
            { key: 'volume', label: 'Volume' },
            { key: 'price', label: 'Price' },
            { key: 'name', label: 'Alphabetical' },
          ]
        : [];

  const selectedSort = activeTab === 'watchlist' ? watchlistSort : moverSort;

  const moverVariant = (stock: Stock): 'gainer' | 'loser' | 'active' => {
    if (moverSegment === 'losers') return 'loser';
    if (moverSegment === 'active') return 'active';
    return stock.isPositive ? 'gainer' : 'loser';
  };

  const renderWatchlist = () => {
    if (watchlistData.length === 0) {
      return (
        <MarketsEmptyState
          icon="star-outline"
          title="Watchlist is empty"
          message="Star stocks from any detail page, or browse the market to add symbols."
          actionLabel="Browse Trade"
          onAction={() => router.push('/(tabs)/trade')}
        />
      );
    }

    return (
      <FlatList
        data={watchlistData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WatchlistSwipeRow
            stock={item}
            pulse={pulseTick > 0}
            onRemove={() => toggleWatchlist(item)}
            onAlert={() =>
              router.push({ pathname: '/alerts/create', params: { symbol: item.symbol } })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF8A00" />
        }
        ListHeaderComponent={
          <View className="flex-row items-center justify-between px-4 py-2">
            <Text className="text-[#555] text-xs">{watchlistData.length} symbols</Text>
            <TouchableOpacity onPress={() => setShowSort(true)} className="flex-row items-center">
              <Ionicons name="swap-vertical-outline" size={13} color="#FF8A00" />
              <Text className="text-[#FF8A00] text-xs ml-1">Sort</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  const renderMovers = () => (
    <View className="flex-1">
      <View className="flex-row mx-4 my-3 p-1 bg-[#111214] rounded-xl border border-[#2A2B2F]">
        {MOVER_SEGMENTS.map((seg) => {
          const active = moverSegment === seg.id;
          return (
            <TouchableOpacity
              key={seg.id}
              onPress={() => {
                hapticSelection();
                setMoverSegment(seg.id);
              }}
              className={`flex-1 py-2 rounded-lg items-center ${active ? 'bg-[#FF8A00]' : ''}`}
            >
              <Text
                className={`text-[10px] font-bold ${active ? 'text-black' : 'text-[#9CA3AF]'}`}
                numberOfLines={1}
              >
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={moversData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MarketMoverRow
            stock={item}
            variant={moverVariant(item)}
            pulse={pulseTick > 0}
            onPress={() => router.push(`/stock/${item.symbol}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF8A00" />
        }
        ListHeaderComponent={
          <View className="flex-row items-center justify-between px-4 py-1">
            <Text className="text-[#555] text-xs">{moversData.length} stocks</Text>
            <TouchableOpacity onPress={() => setShowSort(true)} className="flex-row items-center">
              <Ionicons name="swap-vertical-outline" size={13} color="#FF8A00" />
              <Text className="text-[#FF8A00] text-xs ml-1">Sort</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <MarketsEmptyState
            icon="analytics-outline"
            title="No movers found"
            message="Try another segment or search term."
          />
        }
      />
    </View>
  );

  const parseNewsCategory = (category?: string): NewsFilter => {
    if (!category || category === 'Discover') return 'Discover';
    const valid = ['Markets', 'PSX', 'Trading', 'Economy', 'Crypto'] as const;
    return valid.includes(category as (typeof valid)[number])
      ? (category as NewsFilter)
      : 'Discover';
  };

  const [newsCategory, setNewsCategory] = useState<NewsFilter>(() =>
    parseNewsCategory(params.category)
  );

  useEffect(() => {
    if (params.category) setNewsCategory(parseNewsCategory(params.category));
  }, [params.category]);

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#141414]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[17px] font-bold">Markets</Text>
        <TouchableOpacity onPress={() => activeTab !== 'news' && setShowSort(true)} className="w-10 items-end">
          <Ionicons name="options-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="mx-4 mt-3 mb-2 flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-xl px-3 py-2.5">
        <Ionicons name="search-outline" size={18} color="#555" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search stocks, futures, news..."
          placeholderTextColor="#555"
          className="flex-1 text-white text-sm ml-2 py-0"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {/* Main tabs */}
      <View className="flex-row border-b border-[#141414] px-2">
        {MAIN_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                hapticSelection();
                setActiveTab(tab.id);
              }}
              className="flex-1 items-center py-3"
              style={{
                borderBottomWidth: 2,
                borderBottomColor: active ? '#FF8A00' : 'transparent',
              }}
            >
              <Text
                className={`text-[13px] font-bold ${active ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {loading ? (
        <MarketsSkeleton />
      ) : error ? (
        <MarketsErrorState onRetry={handleRetry} />
      ) : activeTab === 'watchlist' ? (
        renderWatchlist()
      ) : activeTab === 'movers' ? (
        renderMovers()
      ) : (
        <View className="flex-1">
          <NewsCategoryTabs
            activeCategory={newsCategory}
            onCategoryChange={setNewsCategory}
          />
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF8A00" />
            }
            showsVerticalScrollIndicator={false}
          >
            <NewsTabPanel
              query={query}
              activeCategory={newsCategory}
              savedIds={savedNews}
              dismissedIds={dismissedNews}
              onDismiss={(id) => setDismissedNews((prev) => new Set([...prev, id]))}
              onSave={(id) =>
                setSavedNews((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  hapticLight();
                  return next;
                })
              }
              onCategoryChange={setNewsCategory}
            />
          </ScrollView>
        </View>
      )}

      <SortFilterSheet
        visible={showSort && activeTab !== 'news'}
        title="Sort by"
        options={sortOptions}
        selected={selectedSort}
        onSelect={(key) => {
          if (activeTab === 'watchlist') setWatchlistSort(key as WatchlistSort);
          else setMoverSort(key as MoverSort);
        }}
        onClose={() => setShowSort(false)}
      />
    </SafeAreaView>
  );
}
