import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StickyActionBarProps {
  onTradePress: () => void;
  onWatchlistPress: () => void;
  isWatchlisted?: boolean;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ onTradePress, onWatchlistPress, isWatchlisted = false }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="absolute bottom-0 left-0 right-0 bg-[#050505] border-t border-[#2A2B2F] flex-row px-4 pt-3 pb-4 items-center justify-between"
      style={{ paddingBottom: Math.max(insets.bottom + 8, 16) }}
    >
      <TouchableOpacity 
        onPress={onWatchlistPress}
        className="flex-row items-center justify-center border border-[#2A2B2F] rounded-xl px-4 py-3 mr-3"
      >
        <Ionicons name={isWatchlisted ? "star" : "star-outline"} size={20} color={isWatchlisted ? "#FF8A00" : "#9CA3AF"} />
        <Text className={`ml-2 font-semibold ${isWatchlisted ? 'text-[#FF8A00]' : 'text-white'}`}>
          Watchlist
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onTradePress}
        className="flex-1 bg-[#FF8A00] rounded-xl items-center justify-center py-3"
      >
        <Text className="text-black font-bold text-base">Trade</Text>
      </TouchableOpacity>
    </View>
  );
};
