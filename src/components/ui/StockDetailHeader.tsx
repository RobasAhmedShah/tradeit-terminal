import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

interface StockDetailHeaderProps {
  symbol: string;
  name: string;
}

export const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({ symbol, name }) => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-app-bg">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View className="flex-1 ml-4">
        <Text className="text-app-text text-base font-bold">{symbol}</Text>
        <Text className="text-app-muted text-xs">{name}</Text>
      </View>
    </View>
  );
};
