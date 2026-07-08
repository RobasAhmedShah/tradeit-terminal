import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { NewsCard } from '../ui/NewsCard';
import { COMMUNITY_FEED_TABS, CommunityFeedTab } from '../../data/mockNews';
import { filterNews } from '../../utils/marketsHub';
import { FollowingEmptyState } from '../community/FollowingEmptyState';
import { CommunityFeedEmpty } from '../community/CommunityFeedEmpty';
import { usePosts } from '../../context/PostsContext';
import { useComposePost } from '../../hooks/useComposePost';
import { hapticSelection } from '../../utils/haptics';

export type NewsFilter = CommunityFeedTab;

interface NewsCategoryTabsProps {
  activeCategory: NewsFilter;
  onCategoryChange: (category: NewsFilter) => void;
}

export function NewsCategoryTabs({ activeCategory, onCategoryChange }: NewsCategoryTabsProps) {
  return (
    <View className="bg-[#050505] border-b border-[#2A2B2F]">
      <View className="px-4 pt-3 pb-0">
        <Text className="text-white text-[15px] font-bold">Community</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}
      >
        {COMMUNITY_FEED_TABS.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                hapticSelection();
                onCategoryChange(cat);
              }}
              style={{
                marginRight: 20,
                paddingBottom: 6,
                borderBottomWidth: 2,
                borderBottomColor: active ? '#FF8A00' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
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
}

interface NewsTabPanelProps {
  query: string;
  activeCategory: NewsFilter;
  savedIds: Set<string>;
  dismissedIds: Set<string>;
  onDismiss: (id: string) => void;
  onSave: (id: string) => void;
  onCategoryChange?: (category: NewsFilter) => void;
}

export function NewsTabPanel({
  query,
  activeCategory,
  savedIds,
  dismissedIds,
  onDismiss,
  onSave,
}: NewsTabPanelProps) {
  const router = useRouter();
  const { getFeed, isLiked, toggleLike, getLikeCount, repostPost, openComments, isOwnPost, openPostActions } = usePosts();
  const { openCompose } = useComposePost();

  const visiblePosts = useMemo(() => {
    const base = getFeed({ category: activeCategory, excludeIds: dismissedIds });
    return filterNews(base, query);
  }, [getFeed, query, activeCategory, dismissedIds]);

  const isFollowingTab = activeCategory === 'Following';
  const featured = !isFollowingTab ? visiblePosts.find((n) => n.featured && !n.isUserPost) : undefined;
  const regular = visiblePosts.filter((n) => n.id !== featured?.id);

  if (visiblePosts.length === 0) {
    if (activeCategory === 'Following' && !query) {
      return <FollowingEmptyState />;
    }
    return (
      <CommunityFeedEmpty
        category={activeCategory}
        hasQuery={!!query}
        onCreatePost={openCompose}
      />
    );
  }

  const cardProps = (post: (typeof visiblePosts)[0]) => {
    const own = isOwnPost(post);
    return {
      post,
      saved: savedIds.has(post.id),
      liked: isLiked(post.id),
      likeCount: getLikeCount(post),
      isOwnPost: own,
      onLike: () => toggleLike(post.id),
      onComment: () => openComments(post.id),
      onRepost: () => repostPost(post.id),
      onDismiss: own ? undefined : () => onDismiss(post.id),
      onMore: () => openPostActions(post.id),
      onSave: () => onSave(post.id),
      onOpen: () => router.push(`/news/${post.id}`),
    };
  };

  return (
    <View>
      {featured && <NewsCard {...cardProps(featured)} featured />}
      {regular.map((post) => (
        <NewsCard key={post.id} {...cardProps(post)} />
      ))}
    </View>
  );
}
