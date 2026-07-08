import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../data/mockStocks';
import { SparklinePlaceholder } from './SparklinePlaceholder';
import { Ionicons } from '@expo/vector-icons';

interface StockMiniCardProps {
  stock: Stock;
  onPress?: () => void;
}

export const StockMiniCard: React.FC<StockMiniCardProps> = ({ stock, onPress }) => {
  const isPositive = stock.isPositive;

  return (
    <TouchableOpacity onPress={onPress} className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mr-3 w-36">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-[#18191C] items-center justify-center mr-2">
          {/* Logo placeholder */}
          <Text className="text-white text-xs font-bold">{stock.symbol.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold" numberOfLines={1}>{stock.symbol}</Text>
          <Text className="text-[#9CA3AF] text-[10px]" numberOfLines={1}>{stock.name}</Text>
        </View>
      </View>
      
      <Text className="text-white font-bold text-lg mb-1">Rs {stock.price.toFixed(2)}</Text>
      
      <View className="flex-row items-center mb-2">
        <Ionicons name={isPositive ? "caret-up" : "caret-down"} size={12} color={isPositive ? '#0ECB81' : '#F6465D'} />
        <Text className={`text-xs ml-1 ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
          {Math.abs(stock.changePercent).toFixed(2)}%
        </Text>
      </View>

      <SparklinePlaceholder isPositive={isPositive} width={100} height={20} />
    </TouchableOpacity>
  );
};
