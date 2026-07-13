import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface StockOverviewCardsProps {
  stock: Stock;
}

export const StockOverviewCards: React.FC<StockOverviewCardsProps> = ({ stock }) => {
  return (
    <View className="px-4 py-6 space-y-6">
      
      {/* About Section */}
      <View>
        <Text className="text-app-text text-base font-bold mb-3">About the Company</Text>
        <Text className="text-app-muted text-sm leading-6">
          {stock.about || `${stock.name} is a publicly traded company on the PSX.`}
        </Text>
        <TouchableOpacity className="mt-2">
          <Text className="text-[#FF8A00] text-sm font-semibold">View More</Text>
        </TouchableOpacity>
      </View>

      {/* Key Stats Card */}
      <View className="border border-app-border rounded-2xl p-4 mt-6">
        <Text className="text-app-text text-sm font-bold mb-4">Key Stats</Text>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-app-muted text-xs mb-1">P/E</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.peRatio || '-'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-app-muted text-xs mb-1">EPS (TTM)</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.eps || '-'}</Text>
          </View>
          <View className="flex-[0.8] items-end">
            <Text className="text-app-muted text-xs mb-1">Div. Yield</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.dividendYield ? `${stock.dividendYield}%` : '-'}</Text>
          </View>
        </View>
      </View>

      {/* Performance & Metrics Row */}
      <View className="flex-row mt-4 space-x-4">
        {/* Performance Card */}
        <View className=" border border-app-border rounded-2xl p-4 flex-1 mr-2">
          <Text className="text-app-text text-sm font-bold mb-4">Performance</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">1D Return</Text>
              <Text className="text-[#0ECB81] text-xs font-semibold">+{stock.performance?.oneDay || '-'}%</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">1W Return</Text>
              <Text className="text-[#0ECB81] text-xs font-semibold">+{stock.performance?.oneWeek || '-'}%</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">1M Return</Text>
              <Text className="text-[#0ECB81] text-xs font-semibold">+{stock.performance?.oneMonth || '-'}%</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">3M Return</Text>
              <Text className="text-[#0ECB81] text-xs font-semibold">+{stock.performance?.threeMonth || '-'}%</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-app-muted text-xs">YTD Return</Text>
              <Text className="text-[#0ECB81] text-xs font-semibold">+{stock.performance?.ytd || '-'}%</Text>
            </View>
          </View>
        </View>

        {/* Key Metrics Card */}
        <View className=" border border-app-border rounded-2xl p-4 flex-1 ml-2">
          <Text className="text-app-text text-sm font-bold mb-4">Key Metrics</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">P/B</Text>
              <Text className="text-app-text text-xs font-semibold">{stock.metrics?.priceToBook || '-'}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">ROE</Text>
              <Text className="text-app-text text-xs font-semibold">{stock.metrics?.roe ? `${stock.metrics.roe}%` : '-'}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-app-muted text-xs">Debt/Eq</Text>
              <Text className="text-app-text text-xs font-semibold">{stock.metrics?.debtToEquity || '-'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-app-muted text-xs">Curr. Ratio</Text>
              <Text className="text-app-text text-xs font-semibold">{stock.metrics?.currentRatio || '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Dividend Info Card */}
      <View className="border border-app-border rounded-2xl p-4 mt-4">
        <Text className="text-app-text text-sm font-bold mb-4">Dividend Info</Text>
        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-4">
            <Text className="text-app-muted text-xs mb-1">Annual Div.</Text>
            <Text className="text-app-text text-sm font-semibold">Rs {stock.annualDividend || '-'}</Text>
          </View>
          <View className="w-1/2 mb-4 pl-4 border-l border-app-border">
            <Text className="text-app-muted text-xs mb-1">Frequency</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.dividendFreq || '-'}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-app-muted text-xs mb-1">Ex-Div Date</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.exDividendDate || '-'}</Text>
          </View>
          <View className="w-1/2 pl-4 border-l border-app-border">
            <Text className="text-app-muted text-xs mb-1">Pay Date</Text>
            <Text className="text-app-text text-sm font-semibold">{stock.payDate || '-'}</Text>
          </View>
        </View>
      </View>

      {/* AI / Analyst Insight Card */}
      {stock.aiInsight && (
        <View className="bg-[#1C172B] border border-[#3E2B63] rounded-2xl p-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={16} color="#B388FF" className="mr-2" />
              <Text className="text-app-text text-sm font-bold ml-2">AI / Analyst Insight</Text>
            </View>
            <View className="bg-[#0ECB81]/20 px-2 py-1 rounded">
              <Text className="text-[#0ECB81] text-[10px] font-bold uppercase">{stock.aiInsight.badge}</Text>
            </View>
          </View>
          <Text className="text-[#D1C4E9] text-sm leading-6">
            "{stock.aiInsight.text}"
          </Text>
        </View>
      )}
      
    </View>
  );
};
