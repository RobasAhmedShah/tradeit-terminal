import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';

interface StockAnalysisTabProps {
  stock: Stock;
}

export const StockAnalysisTab: React.FC<StockAnalysisTabProps> = ({ stock }) => {
  const aiBadge = stock.aiInsight?.badge || 'Neutral';
  const aiBadgeColor = aiBadge === 'Bullish' ? 'text-[#00C853]' : aiBadge === 'Bearish' ? 'text-[#FF3B30]' : 'text-[#FF8A00]';
  const aiBgColor = aiBadge === 'Bullish' ? 'bg-[#002211]' : aiBadge === 'Bearish' ? 'bg-[#220B0A]' : 'bg-[#2A1A05]';

  return (
    <View className="px-4 py-6 mb-20 space-y-6">
      
      {/* AI Insight */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={16} color="#FF8A00" className="mr-2" />
            <Text className="text-white text-sm font-bold ml-2">TradeIT AI Insight</Text>
          </View>
          <View className={`${aiBgColor} px-2 py-1 rounded border border-[#2A2B2F]`}>
            <Text className={`${aiBadgeColor} text-[10px] font-bold`}>{aiBadge}</Text>
          </View>
        </View>
        <Text className="text-[#9CA3AF] text-xs leading-5">
          {stock.aiInsight?.text || "Our AI model suggests maintaining a neutral stance based on recent market volatility and technical indicators."}
        </Text>
      </View>

      {/* Analyst Ratings */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4 mb-4">
        <Text className="text-white text-sm font-bold mb-4">Analyst Ratings</Text>
        <View className="flex-row items-center mb-4">
          <View className="w-16 h-16 rounded-full border-4 border-[#00C853] items-center justify-center mr-4">
            <Text className="text-white text-lg font-bold">78%</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-semibold mb-1">Strong Buy Consensus</Text>
            <Text className="text-[#9CA3AF] text-xs">Based on 14 top financial analysts covering {stock.symbol} in the last 3 months.</Text>
          </View>
        </View>
        
        {/* Rating Bars */}
        <View className="space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-[#9CA3AF] text-xs w-12">Buy</Text>
            <View className="flex-1 h-2 bg-[#2A2B2F] rounded-full mx-2 overflow-hidden">
              <View className="h-full bg-[#00C853] w-[78%]" />
            </View>
            <Text className="text-white text-xs w-8 text-right">11</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[#9CA3AF] text-xs w-12">Hold</Text>
            <View className="flex-1 h-2 bg-[#2A2B2F] rounded-full mx-2 overflow-hidden">
              <View className="h-full bg-[#FF8A00] w-[14%]" />
            </View>
            <Text className="text-white text-xs w-8 text-right">2</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[#9CA3AF] text-xs w-12">Sell</Text>
            <View className="flex-1 h-2 bg-[#2A2B2F] rounded-full mx-2 overflow-hidden">
              <View className="h-full bg-[#FF3B30] w-[8%]" />
            </View>
            <Text className="text-white text-xs w-8 text-right">1</Text>
          </View>
        </View>
      </View>

      {/* Technical Summary */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4">
        <Text className="text-white text-sm font-bold mb-4">Technical Indicators</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#9CA3AF] text-xs">RSI (14)</Text>
          <Text className="text-white text-xs font-semibold">58.4 (Neutral)</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#9CA3AF] text-xs">MACD (12, 26)</Text>
          <Text className="text-[#00C853] text-xs font-semibold">Bullish</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#9CA3AF] text-xs">MA (50)</Text>
          <Text className="text-white text-xs font-semibold">Rs 142.50</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[#9CA3AF] text-xs">MA (200)</Text>
          <Text className="text-white text-xs font-semibold">Rs 138.20</Text>
        </View>
      </View>

    </View>
  );
};
