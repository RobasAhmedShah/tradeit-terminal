import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StockStickyActionsProps {
  onTradePress: () => void;
  onWatchlistPress: () => void;
  onAlertPress?: () => void;
  isWatchlisted: boolean;
}

export const StockStickyActions: React.FC<StockStickyActionsProps> = ({
  onTradePress,
  onWatchlistPress,
  onAlertPress,
  isWatchlisted,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="absolute bottom-0 left-0 right-0 bg-app-bg border-t border-app-border flex-row px-4 pt-3 pb-4 items-center justify-between shadow-lg shadow-black"
      style={{ paddingBottom: Math.max(insets.bottom + 8, 16) }}
    >
      <View className="flex-row items-center flex-1 mr-3">
        {onAlertPress && (
          <TouchableOpacity
            onPress={onAlertPress}
            className="items-center justify-center border border-app-border bg-app-card rounded-xl px-4 py-3.5 mr-2"
          >
            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onWatchlistPress}
          className={`flex-1 flex-row items-center justify-center border rounded-xl px-4 py-3.5 ${
            isWatchlisted ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-app-border bg-app-card'
          }`}
        >
          <Ionicons
            name={isWatchlisted ? 'star' : 'star-outline'}
            size={20}
            color={isWatchlisted ? '#FF8A00' : '#9CA3AF'}
          />
          <Text className={`ml-2 font-bold text-sm ${isWatchlisted ? 'text-[#FF8A00]' : 'text-app-text'}`}>
            {isWatchlisted ? 'Added' : 'Watchlist'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={onTradePress}
        className="flex-1 bg-[#FF8A00] rounded-xl items-center justify-center py-3.5"
      >
        <Text className="text-black font-bold text-base">Trade</Text>
      </TouchableOpacity>
    </View>
  );
};
