import React from 'react';
import { View, Text } from 'react-native';
import { Stock } from '../../data/mockStocks';

interface StockStatsGridProps {
  stock: Stock;
}

export const StockStatsGrid: React.FC<StockStatsGridProps> = ({ stock }) => {
  return (
    <View className="px-4 py-4 border-b border-app-border border-t border-[#18191C]">
      <View className="flex-row justify-between mb-5">
        <View className="flex-[1]">
          <Text className="text-app-muted text-xs mb-1">Open</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.open?.toFixed(1) || '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-xs mb-1">High (R)</Text>
          <Text className="text-[#0ECB81] text-sm font-semibold">{stock.high?.toFixed(2) || '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-xs mb-1">Low</Text>
          <Text className="text-[#F6465D] text-sm font-semibold">{stock.low?.toFixed(2) || '-'}</Text>
        </View>
        <View className="flex-[0.8] items-end">
          <Text className="text-app-muted text-xs mb-1">LCL</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.lcl?.toFixed(1) || '-'}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-[1]">
          <Text className="text-app-muted text-xs mb-1">Volume</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-xs mb-1">Avg. Vol.</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.avgVolume || '-'}</Text>
        </View>
        <View className="flex-[1.8]">
          <Text className="text-app-muted text-xs mb-1">Mkt Cap</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.marketCap || '-'}</Text>
        </View>
      </View>
    </View>
  );
};
