import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface StockDetailHeaderProps {
  symbol: string;
  name: string;
}

export const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({ symbol, name }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#050505]">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View className="flex-1 ml-4">
        <Text className="text-white text-base font-bold">{symbol}</Text>
        <Text className="text-[#9CA3AF] text-xs">{name}</Text>
      </View>
    </View>
  );
};
