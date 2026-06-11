import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const SpotTradingHeader = () => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#050505]">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View className="flex-1 flex-row justify-center items-center">
        <Text className="text-white text-xl font-black italic">Trade</Text>
        <Text className="text-[#FF8A00] text-xl font-black italic">It</Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity className="p-2 relative">
          <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
          <View className="absolute top-2 right-2 bg-red-500 w-3.5 h-3.5 rounded-full items-center justify-center border border-[#050505]">
            <Text className="text-white text-[8px] font-bold">1</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="p-2 -mr-2">
          <Ionicons name="star" size={24} color="#FF8A00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
