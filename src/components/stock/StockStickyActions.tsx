import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StockStickyActionsProps {
  onTradePress: () => void;
  onWatchlistPress: () => void;
  isWatchlisted: boolean;
}

export const StockStickyActions: React.FC<StockStickyActionsProps> = ({ onTradePress, onWatchlistPress, isWatchlisted }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="absolute bottom-0 left-0 right-0 bg-[#050505] border-t border-[#2A2B2F] flex-row px-4 pt-3 pb-4 items-center justify-between shadow-lg shadow-black"
      style={{ paddingBottom: Math.max(insets.bottom + 8, 16) }}
    >
      <TouchableOpacity 
        onPress={onWatchlistPress}
        className={`flex-row items-center justify-center border rounded-xl px-5 py-3.5 mr-3 ${isWatchlisted ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#111214]'}`}
      >
        <Ionicons name={isWatchlisted ? "star" : "star-outline"} size={20} color={isWatchlisted ? "#FF8A00" : "#9CA3AF"} />
        <Text className={`ml-2 font-bold ${isWatchlisted ? 'text-[#FF8A00]' : 'text-white'}`}>
          {isWatchlisted ? 'Added' : 'Watchlist'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onTradePress}
        className="flex-1 bg-[#FF8A00] rounded-xl items-center justify-center py-3.5"
      >
        <Text className="text-black font-bold text-base">Trade</Text>
      </TouchableOpacity>
    </View>
  );
};
