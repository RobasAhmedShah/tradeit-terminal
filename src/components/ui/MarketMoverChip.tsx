import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../data/mockStocks';
import { Ionicons } from '@expo/vector-icons';
import { StockLogo } from './StockLogo';
import { View } from 'react-native';

interface MarketMoverChipProps {
  stock: Stock;
  onPress?: () => void;
}

export const MarketMoverChip: React.FC<MarketMoverChipProps> = ({ stock, onPress }) => {
  const isPositive = stock.isPositive;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-app-card border border-app-border rounded-xl flex-row items-center mr-3"
      style={{ paddingHorizontal: 12, paddingVertical: 10 }}
    >
      <View className="mr-2">
        <StockLogo
          symbol={stock.symbol}
          logoUrl={stock.logoUrl}
          logoColor={stock.logoColor}
          website={stock.website}
          size={24}
        />
      </View>
      <Text className="text-app-text font-bold text-[14px] mr-2">{stock.symbol}</Text>
      <Ionicons
        name={isPositive ? 'caret-up' : 'caret-down'}
        size={13}
        color={isPositive ? '#0ECB81' : '#F6465D'}
      />
      <Text
        className={`ml-1 text-[13px] font-semibold ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
      >
        {Math.abs(stock.changePercent).toFixed(2)}%
      </Text>
    </TouchableOpacity>
  );
};
