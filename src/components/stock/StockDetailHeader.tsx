import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

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
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-app-bg">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View className="flex-1 ml-4 justify-center">
        <Text className="text-app-text text-base font-bold leading-tight">{symbol}</Text>
        <Text className="text-app-muted text-xs" numberOfLines={1}>
          {name}
        </Text>
      </View>

      <View className="flex-row items-center">
        {onAlertPress && (
          <TouchableOpacity onPress={onAlertPress} className="p-2">
            <Ionicons name="notifications-outline" size={22} color={colors.muted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onWatchlistPress} className="p-2">
          <Ionicons
            name={isWatchlisted ? 'star' : 'star-outline'}
            size={22}
            color={isWatchlisted ? '#FF8A00' : colors.muted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
