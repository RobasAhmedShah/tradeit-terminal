import React from 'react';
import { View, Text } from 'react-native';
import { Stock } from '../../data/mockStocks';

interface InfoCardProps {
  stock: Stock;
}

export const InfoCard: React.FC<InfoCardProps> = ({ stock }) => {
  return (
    <View className="px-4 pt-4 pb-24">
      <View className="mb-6">
        <Text className="text-app-text text-base font-bold mb-2">About</Text>
        <Text className="text-app-muted text-sm leading-5">
          {stock.about || `${stock.name} is a publicly traded company on the PSX.`}
        </Text>
      </View>

      <View className="bg-app-card border border-app-border rounded-2xl p-4">
        <Text className="text-app-text text-base font-bold mb-4">Key Stats</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-app-muted text-xs mb-1">P/E</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.peRatio || '-'}</Text>
          </View>
          <View>
            <Text className="text-app-muted text-xs mb-1">EPS (TTM)</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.eps || '-'}</Text>
          </View>
          <View>
            <Text className="text-app-muted text-xs mb-1">Div. Yield</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.dividendYield ? `${stock.dividendYield}%` : '-'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
