import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../data/mockStocks';
import { Ionicons } from '@expo/vector-icons';

interface MarketMoverChipProps {
  stock: Stock;
  onPress?: () => void;
}

export const MarketMoverChip: React.FC<MarketMoverChipProps> = ({ stock, onPress }) => {
  const isPositive = stock.isPositive;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#111214] border border-[#2A2B2F] rounded-xl flex-row items-center mr-3"
      style={{ paddingHorizontal: 14, paddingVertical: 12 }}
    >
      <Text className="text-white font-bold text-[14px] mr-2.5">{stock.symbol}</Text>
      <Ionicons name={isPositive ? 'caret-up' : 'caret-down'} size={13} color={isPositive ? '#00C853' : '#FF3B30'} />
      <Text className={`ml-1 text-[13px] font-semibold ${isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
        {Math.abs(stock.changePercent).toFixed(2)}%
      </Text>
    </TouchableOpacity>
  );
};
