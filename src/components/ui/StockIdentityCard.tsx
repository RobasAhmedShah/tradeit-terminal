import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface StockIdentityCardProps {
  stock: Stock;
}

export const StockIdentityCard: React.FC<StockIdentityCardProps> = ({ stock }) => {
  const isPositive = stock.isPositive;
  const changeColor = isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = isPositive ? '+' : '';

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-end">
          <Text className={`${changeColor} text-4xl font-bold`}>{stock.price.toFixed(2)}</Text>
          <Text className="text-app-muted text-sm ml-2 mb-1">PKR</Text>
        </View>
        <Ionicons name="star-outline" size={24} color="#9CA3AF" />
      </View>
      
      <Text className={`${changeColor} text-sm font-semibold mt-1`}>
        {sign}{stock.changeValue?.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%) <Text className="text-app-muted font-normal">Today</Text>
      </Text>

      {stock.isShariahCompliant && (
        <View className="bg-[#002211] self-start px-3 py-1 rounded-full mt-3 border border-[#0ECB81]/30">
          <Text className="text-[#0ECB81] text-xs font-semibold">Shariah Compliant</Text>
        </View>
      )}
    </View>
  );
};
