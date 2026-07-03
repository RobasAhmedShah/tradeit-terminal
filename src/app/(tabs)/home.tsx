import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader }          from '../../components/ui/AppHeader';
import { DiscoverBalanceStrip } from '../../components/discover/DiscoverBalanceStrip';
import { SectionHeader }      from '../../components/ui/SectionHeader';
import { StockMiniCard }      from '../../components/ui/StockMiniCard';
import { MarketMoverChip }    from '../../components/ui/MarketMoverChip';
import { NewsCard }           from '../../components/ui/NewsCard';
import { useWatchlist }       from '../../context/WatchlistContext';
import { MOCK_TOP_GAINERS, MOCK_TOP_LOSERS } from '../../data/mockStocks';
import { MOCK_NEWS, NEWS_CATEGORIES, NewsCategory, NewsPost } from '../../data/mockNews';

/* ─── list item types ─────────────────────────────────────── */
type ListItem =
  | { type: 'above-news' }
  | { type: 'news-tabs' }
  | { type: 'news'; post: NewsPost; featured?: boolean };

/* ─── screen ──────────────────────────────────────────────── */
export default function HomeScreen() {
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const [activeCategory, setActiveCategory] = useState<'Discover' | NewsCategory>('Discover');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  /* refs for scroll-to-news on category change */
  const flatListRef     = useRef<FlatList>(null);
  const aboveNewsHeight = useRef(0);
  const isMounted       = useRef(false);

  const dismiss = (id: string) =>
    setDismissed(prev => new Set([...prev, id]));

  const visibleNews  = MOCK_NEWS.filter(n => !dismissed.has(n.id));
  const featuredPost = visibleNews.find(n => n.featured);
  const regularPosts = visibleNews.filter(n => {
    if (n.featured) return false;
    return activeCategory === 'Discover' || n.category === activeCategory;
  });
  const showFeatured =
    !!featuredPost &&
    (activeCategory === 'Discover' || activeCategory === featuredPost.category);

  const listData: ListItem[] = [
    { type: 'above-news' },
    { type: 'news-tabs' },
    ...(showFeatured ? [{ type: 'news' as const, post: featuredPost!, featured: true }] : []),
    ...regularPosts.map(n => ({ type: 'news' as const, post: n })),
  ];

  /* when category changes, scroll so sticky tabs are at top and posts are visible */
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    flatListRef.current?.scrollToOffset({
      offset: aboveNewsHeight.current,
      animated: true,
    });
  }, [activeCategory]);

  /* ── above-news block ────────────────────────────────────── */
  const renderAboveNews = () => (
    <View onLayout={e => { aboveNewsHeight.current = e.nativeEvent.layout.height; }}>
      <DiscoverBalanceStrip />

      {/* Watchlist */}
      <SectionHeader
        title="Watchlist"
        subtitle="My Stocks"
        onViewAll={() => router.push('/markets?tab=watchlist')}
      />
      {watchlist.length === 0 ? (
        <View className="mx-4 py-6 items-center bg-[#111214] border border-[#1e1e1e] rounded-xl mb-2">
          <Ionicons name="star-outline" size={28} color="#444" />
          <Text className="text-[#888] text-sm mt-2 text-center px-4">
            Star stocks from Trade or any stock page — they appear here instantly.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/trade')} className="mt-3">
            <Text className="text-[#FF8A00] text-sm font-semibold">Browse Stocks →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 20, paddingBottom: 8 }}
        >
          {watchlist.map(stock => (
            <StockMiniCard
              key={stock.id}
              stock={stock}
              onPress={() => router.push(`/stock/${stock.symbol}`)}
            />
          ))}
        </ScrollView>
      )}

      {/* Top Gainers */}
      <View className="mt-5 mb-4">
        <View className="flex-row items-end justify-between px-4 mb-3">
          <Text className="text-white text-base font-bold">Top Gainers</Text>
          <TouchableOpacity onPress={() => router.push('/markets?tab=movers&type=gainers')} className="flex-row items-center">
            <Text className="text-[#FF8A00] text-sm mr-1">View all</Text>
            <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {MOCK_TOP_GAINERS.map(stock => (
            <MarketMoverChip key={stock.id} stock={stock} onPress={() => router.push(`/stock/${stock.symbol}`)} />
          ))}
        </ScrollView>
      </View>

      {/* Top Losers */}
      <View className="mb-2">
        <View className="flex-row items-end justify-between px-4 mb-3">
          <Text className="text-white text-base font-bold">Top Losers</Text>
          <TouchableOpacity onPress={() => router.push('/markets?tab=movers&type=losers')} className="flex-row items-center">
            <Text className="text-[#FF8A00] text-sm mr-1">View all</Text>
            <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {MOCK_TOP_LOSERS.map(stock => (
            <MarketMoverChip key={stock.id} stock={stock} onPress={() => router.push(`/stock/${stock.symbol}`)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  /* ── sticky news-tabs block ──────────────────────────────── */
  const renderNewsTabs = () => (
    <View style={{ backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#141414' }}>
      <View className="flex-row items-center justify-between px-4 pt-5 pb-1">
        <Text className="text-white text-lg font-bold">Latest News</Text>
        <TouchableOpacity onPress={() => router.push('/markets?tab=news')} className="flex-row items-center">
          <Text className="text-[#FF8A00] text-sm mr-1">View all</Text>
          <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
      >
        {(['Discover', ...NEWS_CATEGORIES] as const).map(cat => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={{
                marginRight: 24,
                paddingBottom: 10,
                borderBottomWidth: 2,
                borderBottomColor: active ? '#FF8A00' : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: active ? '700' : '500',
                color: active ? '#FF8A00' : '#9CA3AF',
              }}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  /* ── FlatList renderItem ─────────────────────────────────── */
  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'above-news') return renderAboveNews();
    if (item.type === 'news-tabs')  return renderNewsTabs();
    if (item.type === 'news')
      return (
        <NewsCard
          post={item.post}
          featured={item.featured}
          onDismiss={() => dismiss(item.post.id)}
          onOpen={() => router.push(`/news/${item.post.id}`)}
        />
      );
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader />
      <FlatList
        ref={flatListRef}
        data={listData}
        keyExtractor={(item, index) =>
          item.type === 'news' ? `news-${item.post.id}` : `${item.type}-${index}`
        }
        renderItem={renderItem}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
}
