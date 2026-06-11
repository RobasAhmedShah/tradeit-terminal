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
        <Text className="text-white text-base font-bold mb-2">About</Text>
        <Text className="text-[#9CA3AF] text-sm leading-5">
          {stock.about || `${stock.name} is a publicly traded company on the PSX.`}
        </Text>
      </View>

      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4">
        <Text className="text-white text-base font-bold mb-4">Key Stats</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-[#9CA3AF] text-xs mb-1">P/E</Text>
            <Text className="text-white text-sm font-semibold">{stock.peRatio || '-'}</Text>
          </View>
          <View>
            <Text className="text-[#9CA3AF] text-xs mb-1">EPS (TTM)</Text>
            <Text className="text-white text-sm font-semibold">{stock.eps || '-'}</Text>
          </View>
          <View>
            <Text className="text-[#9CA3AF] text-xs mb-1">Div. Yield</Text>
            <Text className="text-white text-sm font-semibold">{stock.dividendYield ? `${stock.dividendYield}%` : '-'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
