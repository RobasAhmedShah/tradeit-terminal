import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { NewsCard } from '../ui/NewsCard';
import { MOCK_NEWS, NEWS_CATEGORIES, NewsCategory } from '../../data/mockNews';
import { filterNews } from '../../utils/marketsHub';
import { MarketsEmptyState } from './MarketsEmptyState';
import { hapticSelection } from '../../utils/haptics';

export type NewsFilter = 'Discover' | NewsCategory;

interface NewsCategoryTabsProps {
  activeCategory: NewsFilter;
  onCategoryChange: (category: NewsFilter) => void;
}

export function NewsCategoryTabs({ activeCategory, onCategoryChange }: NewsCategoryTabsProps) {
  return (
    <View className="bg-[#050505] border-b border-[#141414]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}
      >
        {(['Discover', ...NEWS_CATEGORIES] as const).map((cat) => {
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
  onCategoryChange,
}: NewsTabPanelProps) {
  const router = useRouter();

  const visiblePosts = useMemo(() => {
    const base = MOCK_NEWS.filter((n) => !dismissedIds.has(n.id));
    const filtered = filterNews(base, query);
    return filtered.filter((n) => {
      if (activeCategory === 'Discover') return true;
      return n.category === activeCategory;
    });
  }, [query, activeCategory, dismissedIds]);

  const featured = visiblePosts.find((n) => n.featured);
  const regular = visiblePosts.filter((n) => n.id !== featured?.id);

  if (visiblePosts.length === 0) {
    return (
      <MarketsEmptyState
        icon="newspaper-outline"
        title="No news found"
        message={query ? 'Try a different search term.' : 'No posts in this category.'}
        actionLabel={query ? undefined : 'Show Discover'}
        onAction={query ? undefined : () => onCategoryChange?.('Discover')}
      />
    );
  }

  return (
    <View>
      {featured && (
        <NewsCard
          post={featured}
          featured
          saved={savedIds.has(featured.id)}
          onDismiss={() => onDismiss(featured.id)}
          onSave={() => onSave(featured.id)}
          onOpen={() => router.push(`/news/${featured.id}`)}
        />
      )}
      {regular.map((post) => (
        <NewsCard
          key={post.id}
          post={post}
          saved={savedIds.has(post.id)}
          onDismiss={() => onDismiss(post.id)}
          onSave={() => onSave(post.id)}
          onOpen={() => router.push(`/news/${post.id}`)}
        />
      ))}
    </View>
  );
}
