import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { News } from '../../data/mockNews';
import { Ionicons } from '@expo/vector-icons';

interface NewsCardProps {
  news: News;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <TouchableOpacity className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mx-4 mb-4 flex-row">
      <View className="w-24 h-20 bg-[#18191C] rounded-lg mr-3 items-center justify-center">
        {/* Placeholder for News Image */}
        <Ionicons name="image-outline" size={24} color="#9CA3AF" />
      </View>
      <View className="flex-1 justify-between py-1">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            <Text className="text-[#9CA3AF] text-[10px] mr-2">{news.source}</Text>
            <Text className="text-[#9CA3AF] text-[10px]">{news.time}</Text>
          </View>
          <Ionicons name="open-outline" size={12} color="#9CA3AF" />
        </View>
        <Text className="text-white text-xs font-semibold leading-snug" numberOfLines={3}>
          {news.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
