import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface StockDetailHeaderProps {
  symbol: string;
  name: string;
  isWatchlisted: boolean;
  onWatchlistPress: () => void;
  onAlertPress?: () => void;
}

export const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({
  symbol,
  name,
  isWatchlisted,
  onWatchlistPress,
  onAlertPress,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#050505]">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View className="flex-1 ml-4 justify-center">
        <Text className="text-white text-base font-bold leading-tight">{symbol}</Text>
        <Text className="text-[#9CA3AF] text-xs leading-tight" numberOfLines={1}>{name}</Text>
      </View>

      <View className="flex-row items-center">
        {onAlertPress && (
          <TouchableOpacity onPress={onAlertPress} className="p-2">
            <Ionicons name="notifications-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} className="p-2">
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onWatchlistPress} className="p-2 -mr-2">
          <Ionicons name={isWatchlisted ? 'star' : 'star-outline'} size={24} color={isWatchlisted ? '#FF8A00' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
