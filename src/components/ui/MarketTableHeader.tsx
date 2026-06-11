import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MarketTableHeader = () => {
  return (
    <View className="flex-row items-center justify-between px-4 py-2 border-b border-[#2A2B2F]">
      <View className="flex-[1.5]">
        <Text className="text-[#9CA3AF] text-xs">Stock / Company</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        {/* Placeholder for Sparkline column header if needed, usually blank */}
      </View>
      <View className="flex-[0.8] items-end justify-center pr-2">
        <View className="flex-row items-center">
          <Text className="text-[#9CA3AF] text-[10px] mr-1">Price</Text>
          <Ionicons name="swap-vertical" size={10} color="#9CA3AF" />
        </View>
      </View>
      <View className="flex-[0.8] items-end justify-center pr-2">
        <Text className="text-[#9CA3AF] text-[10px]">Buy / Sell</Text>
      </View>
      <View className="flex-[0.8] items-end justify-center">
        <View className="flex-row items-center">
          <Text className="text-[#9CA3AF] text-[10px] mr-1">Change %</Text>
          <Ionicons name="swap-vertical" size={10} color="#9CA3AF" />
        </View>
      </View>
      <View className="w-[48px]" />
    </View>
  );
};
