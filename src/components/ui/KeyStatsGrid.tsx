import React from 'react';
import { View, Text } from 'react-native';
import { Stock } from '../../data/mockStocks';

interface KeyStatsGridProps {
  stock: Stock;
}

export const KeyStatsGrid: React.FC<KeyStatsGridProps> = ({ stock }) => {
  return (
    <View className="px-4 py-6 border-b border-app-border">
      <View className="flex-row justify-between mb-4">
        <View className="flex-[1]">
          <Text className="text-app-muted text-[11px] mb-1">Open</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.open?.toFixed(1) || '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-[11px] mb-1">High (R)</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.high?.toFixed(2) || '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-[11px] mb-1">Low</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.low?.toFixed(2) || '-'}</Text>
        </View>
        <View className="flex-[0.5] items-end">
          <Text className="text-app-muted text-[11px] mb-1">LCL</Text>
          <Text className="text-app-text text-sm font-semibold">842.0</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-[1]">
          <Text className="text-app-muted text-[11px] mb-1">Volume</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : '-'}</Text>
        </View>
        <View className="flex-[1]">
          <Text className="text-app-muted text-[11px] mb-1">Avg. Vol.</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.avgVolume || '-'}</Text>
        </View>
        <View className="flex-[1.5]">
          <Text className="text-app-muted text-[11px] mb-1">Mkt Cap</Text>
          <Text className="text-app-text text-sm font-semibold">{stock.marketCap || '-'}</Text>
        </View>
      </View>
    </View>
  );
};
