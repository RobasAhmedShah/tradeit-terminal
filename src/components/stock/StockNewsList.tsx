import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface StockNewsListProps {
  stock: Stock;
}

export const StockNewsList: React.FC<StockNewsListProps> = ({ stock }) => {
  if (!stock.news || stock.news.length === 0) return null;

  return (
    <View className="px-4 pb-24 mt-2">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="text-white text-lg font-bold">Latest News</Text>
        <TouchableOpacity>
          <Text className="text-[#FF8A00] text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {stock.news.map((item, index) => (
        <TouchableOpacity 
          key={item.id} 
          className={`flex-row items-center py-4 ${index !== stock.news!.length - 1 ? 'border-b border-[#2A2B2F]' : ''}`}
        >
          {/* Thumbnail Placeholder */}
          <View className="w-16 h-16 bg-[#18191C] rounded-lg items-center justify-center mr-4 border border-[#2A2B2F]">
            <Ionicons name="newspaper-outline" size={24} color="#9CA3AF" />
          </View>
          
          <View className="flex-1 justify-between py-1">
            <Text className="text-white text-sm font-bold leading-5 mb-2" numberOfLines={2}>
              {item.title}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-[#9CA3AF] text-[10px] mr-2">{item.source}</Text>
                <View className="w-1 h-1 rounded-full bg-[#2A2B2F] mr-2" />
                <Text className="text-[#9CA3AF] text-[10px]">{item.time}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
