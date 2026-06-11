import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../data/mockStocks';
import { Ionicons } from '@expo/vector-icons';

interface MarketMoverChipProps {
  stock: Stock;
}

export const MarketMoverChip: React.FC<MarketMoverChipProps> = ({ stock }) => {
  const isPositive = stock.isPositive;
  const bgColor = isPositive ? 'bg-[#002211]' : 'bg-[#220B0A]';
  const color = isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]';
  
  return (
    <TouchableOpacity className="flex-row items-center justify-between bg-[#111214] border border-[#2A2B2F] rounded-lg px-3 py-2 mb-2 w-full">
      <Text className="text-white font-bold">{stock.symbol}</Text>
      <View className="flex-row items-center">
        <Ionicons name={isPositive ? "caret-up" : "caret-down"} size={12} color={isPositive ? '#00C853' : '#FF3B30'} />
        <Text className={`ml-1 text-xs font-semibold ${color}`}>
          {Math.abs(stock.changePercent).toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};
