import React from 'react';
import { View, Text } from 'react-native';
import { Stock } from '../../data/mockStocks';

interface StockFinancialsTabProps {
  stock: Stock;
}

export const StockFinancialsTab: React.FC<StockFinancialsTabProps> = ({ stock }) => {
  return (
    <View className="px-4 py-6 mb-20 space-y-6">
      
      {/* Income Statement */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-sm font-bold">Income Statement (TTM)</Text>
          <Text className="text-[#9CA3AF] text-xs">PKR in Millions</Text>
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Revenue</Text>
            <Text className="text-white text-sm font-semibold">145,230</Text>
          </View>
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Gross Profit</Text>
            <Text className="text-white text-sm font-semibold">45,600</Text>
          </View>
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Net Income</Text>
            <Text className="text-white text-sm font-semibold">18,450</Text>
          </View>
          <View className="flex-row justify-between pb-1">
            <Text className="text-[#9CA3AF] text-sm">Profit Margin</Text>
            <Text className="text-[#00C853] text-sm font-semibold">12.7%</Text>
          </View>
        </View>
      </View>

      {/* Balance Sheet */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-sm font-bold">Balance Sheet</Text>
          <Text className="text-[#9CA3AF] text-xs">Most Recent Qtr</Text>
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Total Assets</Text>
            <Text className="text-white text-sm font-semibold">320,500</Text>
          </View>
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Total Liabilities</Text>
            <Text className="text-white text-sm font-semibold">180,200</Text>
          </View>
          <View className="flex-row justify-between pb-1">
            <Text className="text-[#9CA3AF] text-sm">Total Equity</Text>
            <Text className="text-white text-sm font-semibold">140,300</Text>
          </View>
        </View>
      </View>

      {/* Cash Flow */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-sm font-bold">Cash Flow (TTM)</Text>
          <Text className="text-[#9CA3AF] text-xs">PKR in Millions</Text>
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Operating CF</Text>
            <Text className="text-white text-sm font-semibold">22,500</Text>
          </View>
          <View className="flex-row justify-between border-b border-[#2A2B2F] pb-2">
            <Text className="text-[#9CA3AF] text-sm">Investing CF</Text>
            <Text className="text-white text-sm font-semibold">-5,200</Text>
          </View>
          <View className="flex-row justify-between pb-1">
            <Text className="text-[#9CA3AF] text-sm">Financing CF</Text>
            <Text className="text-white text-sm font-semibold">-4,800</Text>
          </View>
        </View>
      </View>

    </View>
  );
};
