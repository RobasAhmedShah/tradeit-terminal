import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface StockPriceHeaderProps {
  stock: Stock;
}

export const StockPriceHeader: React.FC<StockPriceHeaderProps> = ({ stock }) => {
  const isPositive = stock.isPositive;
  const changeColor = isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = isPositive ? '+' : '';

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-baseline">
        <Text className={`${changeColor} text-5xl font-bold`}>{stock.price.toFixed(2)}</Text>
        <Text className="text-app-muted text-base ml-2 font-medium">PKR</Text>
      </View>
      
      <View className="flex-row items-center mt-1">
        <Text className={`${changeColor} text-base font-semibold`}>
          {sign}{stock.changeValue?.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%)
        </Text>
        <Text className="text-app-muted text-sm ml-2">Today</Text>
      </View>

      {stock.isShariahCompliant && (
        <View className="bg-[#002211] self-start px-3 py-1.5 rounded-full mt-4 border border-[#0ECB81]/30">
          <Text className="text-[#0ECB81] text-xs font-semibold">Shariah Compliant</Text>
        </View>
      )}
    </View>
  );
};
