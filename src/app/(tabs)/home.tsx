import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/ui/AppHeader';
import { DiscoverBalanceStrip } from '../../components/discover/DiscoverBalanceStrip';
import { DiscoverCustomizeSheet } from '../../components/discover/DiscoverCustomizeSheet';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StockMiniCard } from '../../components/ui/StockMiniCard';
import { MarketMoverChip } from '../../components/ui/MarketMoverChip';
import { NewsCard } from '../../components/ui/NewsCard';
import { useWatchlist } from '../../context/WatchlistContext';
import { MOCK_TOP_GAINERS, MOCK_TOP_LOSERS } from '../../data/mockStocks';
import { COMMUNITY_FEED_TABS, CommunityFeedTab, NewsPost } from '../../data/mockNews';
import { FollowingEmptyState } from '../../components/community/FollowingEmptyState';
import { CommunityFeedEmpty } from '../../components/community/CommunityFeedEmpty';
import { useComposePost } from '../../hooks/useComposePost';
import { usePosts } from '../../context/PostsContext';
import {
  DEFAULT_DISCOVER_PREFS,
  DiscoverWidgetPrefs,
  loadDiscoverPrefs,
  saveDiscoverPrefs,
} from '../../utils/discoverPrefs';
import { hapticLight } from '../../utils/haptics';

/* ─── list item types ─────────────────────────────────────── */
type ListItem =
  | { type: 'above-news' }
  | { type: 'balance-only' }
  | { type: 'news-tabs' }
  | { type: 'following-empty' }
  | { type: 'community-empty' }
  | { type: 'news'; post: NewsPost; featured?: boolean };

/* ─── screen ──────────────────────────────────────────────── */
export default function HomeScreen() {
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const {
    getFeed,
    isLiked,
    toggleLike,
    getLikeCount,
    openComments,
    repostPost,
    isOwnPost,
    openPostActions,
    refreshPosts,
  } = usePosts();
  const { openCompose } = useComposePost();
  const [activeCategory, setActiveCategory] = useState<CommunityFeedTab>('Discover');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [prefs, setPrefs] = useState<DiscoverWidgetPrefs>(DEFAULT_DISCOVER_PREFS);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);

  /* refs for scroll-to-news on category change */
  const flatListRef = useRef<FlatList>(null);
  const aboveNewsHeight = useRef(0);
  const isMounted = useRef(false);

  useEffect(() => {
    loadDiscoverPrefs().then((loaded) => {
      setPrefs(loaded);
      setPrefsReady(true);
    });
  }, []);

  const updatePrefs = useCallback((next: DiscoverWidgetPrefs) => {
    setPrefs(next);
    saveDiscoverPrefs(next);
  }, []);

  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  }, [refreshPosts]);

  const visibleNews = getFeed({ category: activeCategory, excludeIds: dismissed });
  const featuredPost = visibleNews.find((n) => n.featured && !n.isUserPost);
  const regularPosts = visibleNews.filter((n) => {
    if (n.id === featuredPost?.id) return false;
    return true;
  });
  const showFeatured =
    !!featuredPost &&
    activeCategory !== 'Following' &&
    (activeCategory === 'Discover' || activeCategory === featuredPost.category);

  const showCommunity = prefs.showCommunity;
  const hasAboveWidgets = prefs.showWatchlist || prefs.showMovers;
  /** Balance alone when community is on but watchlist/movers are off */
  const showBalanceOnly = !hasAboveWidgets && showCommunity;

  const listData: ListItem[] = [
    ...(hasAboveWidgets ? [{ type: 'above-news' as const }] : []),
    ...(showBalanceOnly ? [{ type: 'balance-only' as const }] : []),
    ...(showCommunity
      ? ([
          { type: 'news-tabs' as const },
          ...(visibleNews.length === 0
            ? [
                activeCategory === 'Following'
                  ? { type: 'following-empty' as const }
                  : { type: 'community-empty' as const },
              ]
            : [
                ...(showFeatured ? [{ type: 'news' as const, post: featuredPost!, featured: true }] : []),
                ...regularPosts.map((n) => ({ type: 'news' as const, post: n })),
              ]),
        ] as ListItem[])
      : []),
  ];

  /* when category changes, scroll so sticky tabs are at top and posts are visible */
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (!hasAboveWidgets && !showBalanceOnly) return;
    flatListRef.current?.scrollToOffset({
      offset: aboveNewsHeight.current,
      animated: true,
    });
  }, [activeCategory, hasAboveWidgets, showBalanceOnly]);

  const stickyIndex =
    hasAboveWidgets && showCommunity
      ? 1
      : showBalanceOnly
        ? 1
        : showCommunity
          ? 0
          : undefined;

  /* ── above-news block ────────────────────────────────────── */
  const renderAboveNews = () => (
    <View
      onLayout={(e) => {
        aboveNewsHeight.current = e.nativeEvent.layout.height;
      }}
    >
      <DiscoverBalanceStrip />

      {prefs.showWatchlist && (
        <>
          <SectionHeader
            title="Watchlist"
            subtitle="My Stocks"
            onViewAll={() => router.push('/markets?tab=watchlist')}
          />
          {watchlist.length === 0 ? (
            <View className="mx-4 py-6 items-center bg-[#111214] border border-[#2A2B2F] rounded-xl mb-2">
              <Ionicons name="star-outline" size={28} color="#444" />
              <Text className="text-[#8A8D93] text-sm mt-2 text-center px-4">
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
              {watchlist.map((stock) => (
                <StockMiniCard
                  key={stock.id}
                  stock={stock}
                  onPress={() => router.push(`/stock/${stock.symbol}`)}
                />
              ))}
            </ScrollView>
          )}
        </>
      )}

      {prefs.showMovers && (
        <>
          <View className="mt-5 mb-4">
            <View className="flex-row items-end justify-between px-4 mb-3">
              <Text className="text-white text-base font-bold">Top Gainers</Text>
              <TouchableOpacity
                onPress={() => router.push('/markets?tab=movers&type=gainers')}
                className="flex-row items-center"
              >
                <Text className="text-[#FF8A00] text-sm mr-1">View all</Text>
                <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {MOCK_TOP_GAINERS.map((stock) => (
                <MarketMoverChip
                  key={stock.id}
                  stock={stock}
                  onPress={() => router.push(`/stock/${stock.symbol}`)}
                />
              ))}
            </ScrollView>
          </View>

          <View className="mb-2">
            <View className="flex-row items-end justify-between px-4 mb-3">
              <Text className="text-white text-base font-bold">Top Losers</Text>
              <TouchableOpacity
                onPress={() => router.push('/markets?tab=movers&type=losers')}
                className="flex-row items-center"
              >
                <Text className="text-[#FF8A00] text-sm mr-1">View all</Text>
                <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {MOCK_TOP_LOSERS.map((stock) => (
                <MarketMoverChip
                  key={stock.id}
                  stock={stock}
                  onPress={() => router.push(`/stock/${stock.symbol}`)}
                />
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );

  /* ── sticky news-tabs block ──────────────────────────────── */
  const renderNewsTabs = () => (
    <View style={{ backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#2A2B2F' }}>
      <View className="flex-row items-center justify-between px-4 pt-5 pb-1">
        <Text className="text-white text-lg font-bold">Community</Text>
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
        {COMMUNITY_FEED_TABS.map((cat) => {
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
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: active ? '700' : '500',
                  color: active ? '#FF8A00' : '#9CA3AF',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderEmptyDiscover = () => (
    <View className="flex-1 px-4 pt-2">
      <DiscoverBalanceStrip />
      <View className="mt-8 items-center py-10 px-6 bg-[#111214] border border-[#2A2B2F] rounded-2xl">
        <Ionicons name="grid-outline" size={36} color="#444" />
        <Text className="text-white text-base font-bold mt-4">All widgets hidden</Text>
        <Text className="text-[#8A8D93] text-sm text-center mt-2 leading-5">
          Turn on Watchlist, Movers, or Community from Customize.
        </Text>
        <TouchableOpacity
          onPress={() => {
            hapticLight();
            setCustomizeOpen(true);
          }}
          className="mt-5 bg-[#FF8A00] px-5 py-3 rounded-full"
        >
          <Text className="text-black font-bold text-sm">Customize Discover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── FlatList renderItem ─────────────────────────────────── */
  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'above-news') return renderAboveNews();
    if (item.type === 'balance-only') {
      return (
        <View
          onLayout={(e) => {
            aboveNewsHeight.current = e.nativeEvent.layout.height;
          }}
        >
          <DiscoverBalanceStrip />
        </View>
      );
    }
    if (item.type === 'news-tabs') return renderNewsTabs();
    if (item.type === 'following-empty') return <FollowingEmptyState />;
    if (item.type === 'community-empty') {
      return <CommunityFeedEmpty category={activeCategory} onCreatePost={openCompose} />;
    }
    if (item.type === 'news') {
      const own = isOwnPost(item.post);
      return (
        <NewsCard
          post={item.post}
          featured={item.featured}
          liked={isLiked(item.post.id)}
          likeCount={getLikeCount(item.post)}
          isOwnPost={own}
          onLike={() => toggleLike(item.post.id)}
          onComment={() => openComments(item.post.id)}
          onRepost={() => repostPost(item.post.id)}
          onDismiss={own ? undefined : () => dismiss(item.post.id)}
          onMore={() => openPostActions(item.post.id)}
          onOpen={() => router.push(`/news/${item.post.id}`)}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader
        variant="discover"
        onCustomize={() => {
          hapticLight();
          setCustomizeOpen(true);
        }}
      />
      {!prefsReady ? null : listData.length === 0 ? (
        renderEmptyDiscover()
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'news'
              ? `news-${item.post.id}`
              : item.type === 'following-empty'
                ? 'following-empty'
                : item.type === 'community-empty'
                  ? 'community-empty'
                  : `${item.type}-${index}`
          }
          renderItem={renderItem}
          stickyHeaderIndices={stickyIndex !== undefined ? [stickyIndex] : undefined}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF8A00" />
          }
        />
      )}

      <DiscoverCustomizeSheet
        visible={customizeOpen}
        prefs={prefs}
        onChange={updatePrefs}
        onClose={() => setCustomizeOpen(false)}
      />
    </SafeAreaView>
  );
}
