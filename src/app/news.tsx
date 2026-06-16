import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NewsCard } from '../components/ui/NewsCard';
import { MOCK_NEWS, NEWS_CATEGORIES, NewsCategory, NewsPost } from '../data/mockNews';

type ListItem =
  | { type: 'tabs' }
  | { type: 'post'; post: NewsPost; featured?: boolean };

export default function NewsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'Discover' | NewsCategory>('Discover');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);
  const isMounted   = useRef(false);

  /* scroll to top of list whenever category changes */
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [activeCategory]);

  const dismiss = (id: string) =>
    setDismissed(prev => new Set([...prev, id]));

  const visiblePosts = MOCK_NEWS.filter(n => !dismissed.has(n.id));
  const featuredPost = visiblePosts.find(n => n.featured);
  const regularPosts = visiblePosts.filter(n => {
    if (n.featured) return false;
    return activeCategory === 'Discover' || n.category === activeCategory;
  });
  const showFeatured =
    !!featuredPost &&
    (activeCategory === 'Discover' || activeCategory === featuredPost.category);

  const listData: ListItem[] = [
    { type: 'tabs' },
    ...(showFeatured ? [{ type: 'post' as const, post: featuredPost!, featured: true }] : []),
    ...regularPosts.map(n => ({ type: 'post' as const, post: n })),
  ];

  /* ── sticky category tabs ────────────────────────────────── */
  const renderTabs = () => (
    <View style={{ backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#141414' }}>
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

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'tabs') return renderTabs();
    return (
      <NewsCard
        post={item.post}
        featured={item.featured}
        onDismiss={() => dismiss(item.post.id)}
      />
    );
  };

  const isEmpty = !showFeatured && regularPosts.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#141414',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginLeft: -4 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Latest News</Text>

        <TouchableOpacity style={{ padding: 4, marginRight: -4 }}>
          <Ionicons name="options-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="newspaper-outline" size={48} color="#2A2B2F" />
          <Text style={{ color: '#555', marginTop: 12, fontSize: 14 }}>
            No posts in this category
          </Text>
          <TouchableOpacity
            onPress={() => setActiveCategory('Discover')}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: '#FF8A00', fontWeight: '600' }}>Show all</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'post' ? `post-${item.post.id}` : `tabs-${index}`
          }
          renderItem={renderItem}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 40 }} />}
          removeClippedSubviews={false}
        />
      )}
    </SafeAreaView>
  );
}
