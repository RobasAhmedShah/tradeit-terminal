import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stock } from '../../types';

interface InfoTabContentProps {
  stock: Stock;
}

export const InfoTabContent: React.FC<InfoTabContentProps> = ({ stock }) => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 px-3 py-3 space-y-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      
      {/* Stock Overview Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4">
        <Text className="text-white text-sm font-bold mb-4">Stock Overview</Text>
        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Symbol</Text>
            <Text className="text-white text-[11px] font-semibold">{stock.symbol}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Company</Text>
            <Text className="text-white text-[11px] font-semibold text-right flex-1 ml-4" numberOfLines={1}>{stock.name}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Exchange</Text>
            <Text className="text-white text-[11px] font-semibold">PSX</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Board</Text>
            <Text className="text-white text-[11px] font-semibold">KSE 100</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Sector</Text>
            <Text className="text-white text-[11px] font-semibold">Financials / Multi</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Shariah Status</Text>
            <Text className={stock.isShariahCompliant ? 'text-[#00C853] text-[11px] font-semibold' : 'text-white text-[11px] font-semibold'}>
              {stock.isShariahCompliant ? 'Compliant' : 'Non-Compliant'}
            </Text>
          </View>
        </View>
      </View>

      {/* Trading Stats Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4">
        <Text className="text-white text-sm font-bold mb-4">Trading Stats</Text>
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Open</Text>
            <Text className="text-white text-[11px] font-semibold">{stock.open?.toFixed(2) || '892.50'}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Prev Close</Text>
            <Text className="text-white text-[11px] font-semibold">{(stock.price - (stock.changeValue || 0)).toFixed(2)}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">High</Text>
            <Text className="text-[#00C853] text-[11px] font-semibold">{stock.high?.toFixed(2) || '912.50'}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Low</Text>
            <Text className="text-[#FF3B30] text-[11px] font-semibold">{stock.low?.toFixed(2) || '888.00'}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Volume</Text>
            <Text className="text-white text-[11px] font-semibold">{stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : '2.90M'}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Avg Vol (20D)</Text>
            <Text className="text-white text-[11px] font-semibold">{stock.avgVolume || '2.21M'}</Text>
          </View>
          <View className="w-full">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Market Cap</Text>
            <Text className="text-white text-[11px] font-semibold">{stock.marketCap || 'Rs 69.42B'}</Text>
          </View>
        </View>
      </View>

      {/* Order Limits Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4">
        <Text className="text-white text-sm font-bold mb-4">Order Limits</Text>
        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Minimum Order</Text>
            <Text className="text-white text-[11px] font-semibold">1 share</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Tick Size</Text>
            <Text className="text-white text-[11px] font-semibold">Rs 0.25</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Order Types</Text>
            <Text className="text-white text-[11px] font-semibold">Limit, Market, Stop Limit</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Time in Force</Text>
            <Text className="text-white text-[11px] font-semibold">Day</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-[11px]">Settlement</Text>
            <Text className="text-white text-[11px] font-semibold">T+2</Text>
          </View>
        </View>
      </View>

      {/* Risk Note Card */}
      <View className="bg-[#FF8A00]/10 border border-[#FF8A00]/30 rounded-xl p-4 mb-2 flex-row">
        <Ionicons name="warning" size={20} color="#FF8A00" className="mr-3" />
        <View className="flex-1 ml-2">
          <Text className="text-[#FF8A00] text-[11px] font-semibold mb-1">Trading Notice</Text>
          <Text className="text-[#9CA3AF] text-[10px] leading-4">
            Stock prices can move quickly during market hours. Review price, quantity, and available buying power before placing orders.
          </Text>
        </View>
      </View>

      {/* Related Actions */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-2 mb-4">
        <TouchableOpacity className="flex-row items-center p-3 border-b border-[#2A2B2F]">
          <Ionicons name="star-outline" size={18} color="#9CA3AF" />
          <Text className="text-white text-xs font-semibold ml-3 flex-1">Add to Watchlist</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/stock/${stock.symbol}`)} className="flex-row items-center p-3 border-b border-[#2A2B2F]">
          <Ionicons name="podium-outline" size={18} color="#9CA3AF" />
          <Text className="text-white text-xs font-semibold ml-3 flex-1">View Stock Detail</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-3">
          <Ionicons name="notifications-outline" size={18} color="#9CA3AF" />
          <Text className="text-white text-xs font-semibold ml-3 flex-1">Set Price Alert</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};
