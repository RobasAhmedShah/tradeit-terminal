import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const PortfolioValueCard = () => {
  return (
    <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-5 mx-4 my-2">
      <View className="flex-row justify-between items-start">
        <View>
          <View className="flex-row items-center mb-1">
            <Text className="text-[#9CA3AF] text-sm mr-2">Total Portfolio Value</Text>
            <Ionicons name="eye-outline" size={16} color="#9CA3AF" />
          </View>
          <Text className="text-white text-3xl font-bold tracking-tight mb-3">Rs 104,973.92</Text>
          
          <Text className="text-[#9CA3AF] text-xs mb-1">Today's P/L</Text>
          <Text className="text-[#00C853] text-sm font-semibold mb-2">+Rs 6,357.68 (5.71%)</Text>
          <Text className="text-[#9CA3AF] text-xs">Invested: Rs 111,331.60</Text>
        </View>

        <View className="items-end">
          <TouchableOpacity className="flex-row items-center bg-[#18191C] rounded-full px-3 py-1 mb-6 border border-[#2A2B2F]">
            <Text className="text-white text-xs mr-1">All Accounts</Text>
            <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
          </TouchableOpacity>
          {/* Sparkline placeholder for Portfolio */}
          <View className="w-24 h-12">
            <Text className="text-[#00C853] opacity-50">/\/\__/\</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
