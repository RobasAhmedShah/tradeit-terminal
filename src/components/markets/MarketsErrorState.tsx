import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function MarketsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name="cloud-offline-outline" size={40} color="#555" />
      <Text className="text-white font-bold text-base mt-4 mb-2">Couldn't load markets</Text>
      <Text className="text-[#9CA3AF] text-sm text-center mb-5">
        Check your connection and try again.
      </Text>
      <TouchableOpacity onPress={onRetry} className="border border-[#FF8A00] px-6 py-3 rounded-xl">
        <Text className="text-[#FF8A00] font-bold text-sm">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
