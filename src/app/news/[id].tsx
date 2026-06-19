import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_NEWS, Sentiment } from '../../data/mockNews';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

const SENTIMENT: Record<Sentiment, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  Bullish: { color: '#00C853', bg: '#001f0e', icon: 'trending-up', label: 'Bullish' },
  Bearish: { color: '#FF3B30', bg: '#200006', icon: 'trending-down', label: 'Bearish' },
  Neutral: { color: '#9CA3AF', bg: '#1a1a1a', icon: 'remove', label: 'Neutral' },
};

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const post = MOCK_NEWS.find((n) => n.id === id);

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Post not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#FF8A00]">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const cfg = post.sentiment ? SENTIMENT[post.sentiment] : null;

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#141414]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[17px] font-bold mr-10">Post</Text>
        <TouchableOpacity onPress={() => setSaved((s) => !s)} className="w-10 items-end">
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? '#FF8A00' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start mb-4">
          <View
            className="w-11 h-11 rounded-full items-center justify-center mr-3 border border-[#2A2B2F]"
            style={{ backgroundColor: post.author.color ?? '#1A0E00' }}
          >
            <Text className="text-[#FF8A00] font-bold">{post.author.initials}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-base mr-1">{post.author.name}</Text>
              {post.author.verified && <Ionicons name="checkmark-circle" size={14} color="#FF8A00" />}
            </View>
            <Text className="text-[#555] text-xs mt-0.5">{post.time} · {post.category}</Text>
          </View>
          {cfg && (
            <View className="flex-row items-center px-2 py-1 rounded-md" style={{ backgroundColor: cfg.bg }}>
              <Ionicons name={cfg.icon} size={12} color={cfg.color} />
              <Text className="text-xs font-semibold ml-1" style={{ color: cfg.color }}>
                {cfg.label}
              </Text>
            </View>
          )}
        </View>

        {post.tickers.length > 0 && (
          <View className="flex-row flex-wrap mb-4 gap-2">
            {post.tickers.map((t) => {
              const sym = t.replace('$', '');
              const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === sym);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => router.push(`/stock/${sym}`)}
                  className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-lg px-3 py-2"
                >
                  <Text className="text-[#FF8A00] font-bold text-sm mr-2">{sym}</Text>
                  {stock && (
                    <Text className={`text-xs font-semibold ${stock.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                      {stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text className="text-[#D0D0D0] text-[15px] leading-6 mb-6">{post.content}</Text>

        <View className="flex-row items-center py-4 border-t border-[#141414]">
          <View className="flex-row items-center mr-5">
            <Ionicons name="chatbubble-outline" size={16} color="#555" />
            <Text className="text-[#555] text-xs ml-1">{post.engagement.comments}</Text>
          </View>
          <View className="flex-row items-center mr-5">
            <Ionicons name="heart-outline" size={16} color="#555" />
            <Text className="text-[#555] text-xs ml-1">{post.engagement.likes}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={16} color="#555" />
            <Text className="text-[#555] text-xs ml-1">{post.engagement.views}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
