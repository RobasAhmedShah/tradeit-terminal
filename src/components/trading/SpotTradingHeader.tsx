import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export const SpotTradingHeader = () => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-app-bg">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View className="flex-1 flex-row justify-center items-center">
        <Text className="text-app-text text-xl font-black italic">Trade</Text>
        <Text className="text-[#FF8A00] text-xl font-black italic">It</Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity className="p-2 relative" onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
