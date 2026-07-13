import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface MarketRangeStripProps {
  stock: Stock;
}

export const MarketRangeStrip: React.FC<MarketRangeStripProps> = ({ stock }) => {
  const isPositive = stock.isPositive;
  const changeColor = isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = isPositive ? '+' : '';

  return (
    <View className="bg-app-card border border-app-border rounded-xl py-3 px-3 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-3">
          <Text className="text-app-text font-bold text-xs">{stock.symbol}</Text>
          <Text className="text-app-text font-bold text-sm">Rs {stock.price.toFixed(2)}</Text>
        </View>
        <View>
          <Text className={`${changeColor} text-[10px]`}>{sign}{stock.changeValue?.toFixed(2)}</Text>
          <Text className={`${changeColor} text-[10px]`}>({sign}{stock.changePercent.toFixed(2)}%)</Text>
        </View>
      </View>

      <View className="flex-row space-x-6">
        {/* Day Range */}
        <View className="items-center">
          <Text className="text-app-muted text-[9px] mb-1">Day Range</Text>
          <View className="w-16 h-0.5 bg-[#F6465D] flex-row">
            <View className="w-1/2 h-full bg-[#0ECB81]" />
          </View>
          <View className="flex-row justify-between w-full mt-1">
            <Text className="text-[#F6465D] text-[8px]">{stock.low?.toFixed(2)}</Text>
            <Text className="text-[#0ECB81] text-[8px]">{stock.high?.toFixed(2)}</Text>
          </View>
        </View>

        {/* 52W Range */}
        <View className="items-center">
          <Text className="text-app-muted text-[9px] mb-1">52W Range</Text>
          <View className="w-16 h-0.5 bg-[#F6465D] flex-row">
            <View className="w-3/4 h-full bg-[#0ECB81]" />
          </View>
          <View className="flex-row justify-between w-full mt-1">
            <Text className="text-[#F6465D] text-[8px]">612.00</Text>
            <Text className="text-[#0ECB81] text-[8px]">1,015.00</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
