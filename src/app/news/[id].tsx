import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Sentiment } from '../../data/mockNews';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { usePosts } from '../../context/PostsContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { hapticSelection } from '../../utils/haptics';
import { safeBack } from '../../utils/navigation';

const SENTIMENT: Record<Sentiment, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  Bullish: { color: COLORS.buy, bg: 'rgba(14,203,129,0.12)', icon: 'trending-up', label: 'Bullish' },
  Bearish: { color: COLORS.sell, bg: 'rgba(246,70,93,0.12)', icon: 'trending-down', label: 'Bearish' },
  Neutral: { color: COLORS.muted, bg: 'rgba(107,114,128,0.12)', icon: 'remove', label: 'Neutral' },
};

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const {
    getPostById,
    isLiked,
    toggleLike,
    getLikeCount,
    recordView,
    openComments,
    repostPost,
    isOwnPost,
    openPostActions,
    getAuthorKey,
    isFollowing,
    toggleFollow,
    ready,
  } = usePosts();
  const [saved, setSaved] = useState(false);
  const viewedRef = useRef<string | null>(null);
  const hadPostRef = useRef(false);

  const post = id && ready ? getPostById(id) : undefined;
  const own = post ? isOwnPost(post) : false;
  const authorKey = post ? getAuthorKey(post) : '';
  const following = authorKey ? isFollowing(authorKey) : false;

  useEffect(() => {
    if (!id || viewedRef.current === id) return;
    viewedRef.current = id;
    recordView(id);
  }, [id, recordView]);

  useEffect(() => {
    if (post) hadPostRef.current = true;
    if (hadPostRef.current && ready && !post) safeBack(router, '/markets?tab=news');
  }, [post, ready, router]);

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-app-bg justify-center items-center">
        <Text className="text-app-text text-lg">Post not found</Text>
        <TouchableOpacity onPress={() => safeBack(router, '/markets?tab=news')} className="mt-4">
          <Text className="text-[#FF8A00]">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const cfg = post.sentiment ? SENTIMENT[post.sentiment] : null;
  const liked = isLiked(post.id);
  const likes = getLikeCount(post);

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="flex-row items-center px-4 py-3 border-b border-app-border">
        <TouchableOpacity onPress={() => safeBack(router, '/markets?tab=news')} className="w-10">
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-app-text text-[17px] font-bold">Post</Text>
        <View className="flex-row items-center min-w-[72px] justify-end gap-2">
          <TouchableOpacity onPress={() => setSaved((s) => !s)}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? '#FF8A00' : '#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPostActions(post.id)}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {post.repostOf && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="repeat" size={14} color="#8A8D93" />
            <Text className="text-app-muted text-xs ml-2">
              Reposted from {post.repostOf.authorName}
            </Text>
          </View>
        )}

        {/* Author row — matches feed card: name left, sentiment + follow right */}
        <View className="flex-row items-start mb-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-2.5 border border-app-border"
            style={{ backgroundColor: post.author.color ?? '#1A0E00' }}
          >
            <Text className="text-[#FF8A00] text-[13px] font-bold">{post.author.initials}</Text>
          </View>
          <View className="flex-1 mr-2">
            <View className="flex-row items-center">
              <Text className="text-app-text font-bold text-[13px] mr-1" numberOfLines={1}>
                {post.author.name}
              </Text>
              {post.author.verified && (
                <Ionicons name="checkmark-circle" size={13} color="#FF8A00" />
              )}
              {own && (
                <View className="ml-1.5 bg-[#FF8A00]/15 px-1.5 py-0.5 rounded">
                  <Text className="text-[#FF8A00] text-[9px] font-bold">YOU</Text>
                </View>
              )}
            </View>
            <Text className="text-app-muted text-[11px] mt-0.5">
              {post.time} · {post.category}
            </Text>
          </View>
          {cfg && (
            <View
              className="flex-row items-center px-2 py-1 rounded-md ml-1"
              style={{ backgroundColor: cfg.bg }}
            >
              <Ionicons name={cfg.icon} size={11} color={cfg.color} />
              <Text className="text-[11px] font-semibold ml-1" style={{ color: cfg.color }}>
                {cfg.label}
              </Text>
            </View>
          )}
          {!own && (
            <TouchableOpacity
              onPress={() => {
                hapticSelection();
                toggleFollow(authorKey);
              }}
              className="px-3 py-1.5 rounded-full border ml-2"
              style={{
                borderColor: following ? colors.border : COLORS.primary,
                backgroundColor: following ? 'transparent' : `${COLORS.primary}18`,
              }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: following ? colors.mutedDark : COLORS.primary }}
              >
                {following ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cashtags — same as feed card */}
        {post.tickers.length > 0 && (
          <View className="flex-row flex-wrap mb-1.5">
            {post.tickers.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => router.push(`/stock/${t.replace('$', '')}`)}
                className="mr-2.5"
              >
                <Text className="text-[#FF8A00] font-bold text-[13px]">{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text className="text-app-text text-[15px] leading-6 mb-3">{post.content}</Text>

        {post.imageUri ? (
          <Image
            source={{ uri: post.imageUri }}
            className="w-full h-48 rounded-xl mb-3 bg-app-card"
            resizeMode="cover"
          />
        ) : null}

        {/* Price chips — same as feed card */}
        {post.tickers.length > 0 && (
          <View className="flex-row flex-wrap mb-6 gap-2">
            {post.tickers.map((t) => {
              const sym = t.replace('$', '');
              const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === sym);
              if (!stock) return null;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => router.push(`/stock/${sym}`)}
                  className="flex-row items-center bg-app-card border border-app-border rounded-lg px-2.5 py-1.5"
                >
                  <Text className="text-app-text font-semibold text-xs mr-1">{sym}</Text>
                  <Ionicons
                    name={stock.isPositive ? 'caret-up' : 'caret-down'}
                    size={10}
                    color={stock.isPositive ? '#0ECB81' : '#F6465D'}
                  />
                  <Text
                    className={`text-[11px] font-semibold ml-0.5 ${
                      stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                    }`}
                  >
                    {stock.changePercent.toFixed(2)}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View className="flex-row items-center py-4 border-t border-b border-app-border mb-4">
          <TouchableOpacity onPress={() => openComments(post.id)} className="flex-row items-center mr-5">
            <Ionicons name="chatbubble-outline" size={18} color="#8A8D93" />
            <Text className="text-app-muted text-xs ml-1">{post.engagement.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => repostPost(post.id)} className="flex-row items-center mr-5">
            <Ionicons name="repeat-outline" size={18} color="#8A8D93" />
            <Text className="text-app-muted text-xs ml-1">{post.engagement.reposts}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleLike(post.id)} className="flex-row items-center mr-5">
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? COLORS.sell : '#8A8D93'} />
            <Text className="text-xs ml-1" style={{ color: liked ? COLORS.sell : '#8A8D93' }}>
              {likes}
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={18} color="#8A8D93" />
            <Text className="text-app-muted text-xs ml-1">{post.engagement.views}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => openComments(post.id)}
          className="bg-app-card border border-app-border rounded-xl py-3.5 items-center"
        >
          <Text className="text-[#FF8A00] text-sm font-semibold">View comments</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
