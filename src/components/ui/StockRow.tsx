import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';
import { SparklinePlaceholder } from './SparklinePlaceholder';

interface StockRowProps {
  stock: Stock;
  onPress: () => void;
  onTradePress: () => void;
}

export const StockRow: React.FC<StockRowProps> = ({ stock, onPress, onTradePress }) => {
  const isPositive = stock.isPositive;
  const changeColor = isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]';
  const sign = isPositive ? '+' : '';

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between mx-4 mb-1 px-2 py-3 bg-[#111214] 
      border border-[#2A2B2F] rounded-xl"
    >
      {/* Left Column: Logo, Symbol, Name */}
      <View className="flex-[1.5] flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-[#18191C] items-center justify-center mr-2 border border-[#2A2B2F]">
          <Text className="text-white text-xs font-bold">{stock.symbol.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-sm" numberOfLines={1}>{stock.symbol}</Text>
          <Text className="text-[#9CA3AF] text-[10px]" numberOfLines={1}>{stock.name}</Text>
        </View>
      </View>

      {/* Sparkline Column */}
      <View className="flex-1 items-center justify-center">
        <SparklinePlaceholder isPositive={isPositive} width={40} height={20} />
      </View>

      {/* Middle Column 1: Current Price */}
      <View className="flex-[0.8] items-end justify-center pr-2">
        <Text className="text-white font-bold text-sm">{stock.price.toFixed(2)}</Text>
      </View>

      {/* Middle Column 2: Buy / Sell */}
      <View className="flex-[0.8] items-end justify-center pr-2">
        <Text className="text-[#00C853] text-[11px] font-semibold">{stock.buyPrice?.toFixed(2)}</Text>
        <Text className="text-[#FF3B30] text-[11px] font-semibold mt-0.5">{stock.sellPrice?.toFixed(2)}</Text>
      </View>

      {/* Change % and Absolute Change */}
      <View className="flex-[0.8] items-end justify-center">
        <Text className={`${changeColor} text-[11px] font-semibold`}>
          {sign}{stock.changePercent.toFixed(2)}%
        </Text>
        <Text className={`${changeColor} text-[11px] mt-0.5`}>
          {sign}{stock.changeValue?.toFixed(2)}
        </Text>
      </View>

      {/* Action Column (Trade Button or Chevron) */}
      <View className="w-[48px] items-end justify-center">
        {stock.symbol === 'OGDC' || stock.symbol === 'HBL' || stock.symbol === 'PSO' ? (
          <TouchableOpacity onPress={onTradePress} className="py-2 pl-2">
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onTradePress}
            className="border border-[#FF8A00] rounded p-1 px-2"
          >
            <Text className="text-[#FF8A00] text-[10px] font-bold">Trade</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
