import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MOCK_TRADES } from '../../data/mockTrades';
import { Stock } from '../../types';

interface TradesTabContentProps {
  stock: Stock;
}

export const TradesTabContent: React.FC<TradesTabContentProps> = ({ stock }) => {
  const allTrades = MOCK_TRADES[stock.symbol] || MOCK_TRADES['AABS'];
  const [filter, setFilter] = useState<'All' | 'Buys' | 'Sells' | 'Large'>('All');

  const filteredTrades = allTrades.filter(trade => {
    if (filter === 'Buys') return trade.type === 'buy';
    if (filter === 'Sells') return trade.type === 'sell';
    if (filter === 'Large') return trade.qty >= 4000;
    return true;
  });

  // Calculate flow summary
  const buyVolume = allTrades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.qty, 0);
  const sellVolume = allTrades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.qty, 0);
  const totalVolume = buyVolume + sellVolume;
  const buyPct = Math.round((buyVolume / totalVolume) * 100) || 56;
  const sellPct = 100 - buyPct;

  return (
    <ScrollView className="flex-1 px-3 py-3 space-y-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      
      {/* Header Summary */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-3">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Last Trade</Text>
          <Text className="text-white text-sm font-bold">Rs {stock.price.toFixed(2)}</Text>
        </View>
        <View className="w-[48%] mb-3 items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Total Volume</Text>
          <Text className="text-white text-sm font-bold">{stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : '2.90M'}</Text>
        </View>
        <View className="w-[48%]">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Trades Today</Text>
          <Text className="text-white text-sm font-bold">1,248</Text>
        </View>
        <View className="w-[48%] items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Avg Trade Size</Text>
          <Text className="text-white text-sm font-bold">2,320</Text>
        </View>
      </View>

      {/* Trade Intensity Mini Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#9CA3AF] text-xs font-semibold">Trade Flow Intensity</Text>
          <Text className="text-[#00C853] text-xs font-bold">+Rs 1.25M Net</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-[#00C853] text-[10px]">Buy Volume: {buyPct}%</Text>
          <Text className="text-[#FF3B30] text-[10px]">Sell Volume: {sellPct}%</Text>
        </View>
        <View className="h-1.5 w-full bg-[#2A2B2F] rounded-full overflow-hidden flex-row">
          <View style={{ width: `${buyPct}%` }} className="h-full bg-[#00C853]" />
          <View style={{ width: `${sellPct}%` }} className="h-full bg-[#FF3B30]" />
        </View>
      </View>

      {/* Main Trades Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-4">
        
        {/* Filters */}
        <View className="flex-row gap-2 mb-3">
          {['All', 'Buys', 'Sells', 'Large'].map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-full border ${filter === f ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#18191C]'}`}
            >
              <Text className={`text-[10px] font-semibold ${filter === f ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table Header */}
        <View className="flex-row justify-between mb-2 pb-1 border-b border-[#2A2B2F]">
          <Text className="text-[#9CA3AF] text-[10px] flex-1">Price (PKR)</Text>
          <Text className="text-[#9CA3AF] text-[10px] flex-[0.8] text-right">Qty</Text>
          <Text className="text-[#9CA3AF] text-[10px] flex-[0.8] text-right">Time</Text>
          <Text className="text-[#9CA3AF] text-[10px] flex-[0.6] text-right">Side</Text>
        </View>

        {/* Trades List */}
        {filteredTrades.map(trade => (
          <View key={trade.id} className="flex-row justify-between items-center py-1.5">
            <Text className={`text-[11px] font-semibold flex-1 ${trade.type === 'buy' ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
              {trade.price.toFixed(2)}
            </Text>
            <View className="flex-[0.8] flex-row items-center justify-end">
              {trade.qty >= 4000 && (
                <View className="bg-[#FF8A00]/20 px-1 py-0.5 rounded mr-1">
                  <Text className="text-[#FF8A00] text-[8px] font-bold">L</Text>
                </View>
              )}
              <Text className="text-white text-[11px] text-right">{trade.qty.toLocaleString()}</Text>
            </View>
            <Text className="text-[#9CA3AF] text-[10px] flex-[0.8] text-right">{trade.time}</Text>
            <Text className={`text-[10px] font-bold flex-[0.6] text-right ${trade.type === 'buy' ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
              {trade.type === 'buy' ? 'Buy' : 'Sell'}
            </Text>
          </View>
        ))}

        {filteredTrades.length === 0 && (
          <Text className="text-[#9CA3AF] text-xs text-center py-4">No trades match this filter.</Text>
        )}
      </View>

    </ScrollView>
  );
};
