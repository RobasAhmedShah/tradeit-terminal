import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ORDER_BOOK } from '../../data/mockOrderBook';
import { Stock } from '../../types';

interface OrderBookTabContentProps {
  stock: Stock;
}

export const OrderBookTabContent: React.FC<OrderBookTabContentProps> = ({ stock }) => {
  const data = MOCK_ORDER_BOOK[stock.symbol] || MOCK_ORDER_BOOK['AABS'];
  const [depth, setDepth] = useState('10');

  // Calculate total volume for depth bars
  const totalBidVol = data.bids.reduce((sum, bid) => sum + bid.qty, 0);
  const totalAskVol = data.asks.reduce((sum, ask) => sum + ask.qty, 0);

  // Mock buy/sell pressure based on totals
  const totalVol = totalBidVol + totalAskVol;
  const buyPressure = Math.round((totalBidVol / totalVol) * 100) || 56;
  const sellPressure = 100 - buyPressure;

  return (
    <ScrollView className="flex-1 px-3 py-3 space-y-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      
      {/* Header Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-base font-bold">{stock.symbol}</Text>
          <Text className="text-white text-base font-bold">Rs {stock.price.toFixed(2)}</Text>
        </View>
        <Text className="text-[#9CA3AF] text-xs mb-3">
          Spread: {data.spread.value.toFixed(2)} ({data.spread.percent}%)
        </Text>
        
        {/* Pressure Indicator */}
        <View className="flex-row justify-between mb-1">
          <Text className="text-[#00C853] text-[10px]">Buy Pressure: {buyPressure}%</Text>
          <Text className="text-[#FF3B30] text-[10px]">Sell Pressure: {sellPressure}%</Text>
        </View>
        <View className="h-1.5 w-full bg-[#2A2B2F] rounded-full overflow-hidden flex-row">
          <View style={{ width: `${buyPressure}%` }} className="h-full bg-[#00C853]" />
          <View style={{ width: `${sellPressure}%` }} className="h-full bg-[#FF3B30]" />
        </View>
      </View>

      {/* Main Order Book Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3">
        
        {/* Controls */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-[#18191C] border border-[#2A2B2F] rounded px-2 py-1 flex-row items-center">
              <Text className="text-[#9CA3AF] text-[10px] mr-1">{depth}</Text>
              <Ionicons name="caret-down" size={10} color="#9CA3AF" />
            </View>
            <View className="bg-[#18191C] border border-[#2A2B2F] rounded px-2 py-1">
              <Text className="text-[#9CA3AF] text-[10px]">0.25</Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Ionicons name="list" size={16} color="#00C853" />
            <Ionicons name="options-outline" size={16} color="#9CA3AF" />
          </View>
        </View>

        {/* Table Header */}
        <View className="flex-row justify-between mb-2 pb-1 border-b border-[#2A2B2F]">
          <View className="flex-1 flex-row pr-2 border-r border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-[10px] w-[50%]">Bid (PKR)</Text>
            <Text className="text-[#9CA3AF] text-[10px] w-[50%] text-right">Bid Qty</Text>
          </View>
          <View className="flex-1 flex-row pl-2">
            <Text className="text-[#9CA3AF] text-[10px] w-[50%]">Ask (PKR)</Text>
            <Text className="text-[#9CA3AF] text-[10px] w-[50%] text-right">Ask Qty</Text>
          </View>
        </View>

        {/* Table Body */}
        <View className="flex-row justify-between">
          
          {/* Bids Column */}
          <View className="flex-1 pr-2 border-r border-[#2A2B2F]">
            {data.bids.slice(0, parseInt(depth)).map((bid, i) => {
              const depthPct = Math.min((bid.qty / (totalBidVol / 3)) * 100, 100);
              return (
                <View key={`bid-${i}`} className="flex-row mb-1.5 relative items-center">
                  <View className="absolute right-0 top-0 bottom-0 bg-[#00C853]/15" style={{ width: `${depthPct}%` }} />
                  <Text className="text-[#00C853] text-[11px] font-semibold w-[50%]">{bid.price.toFixed(2)}</Text>
                  <Text className="text-white text-[11px] w-[50%] text-right">{bid.qty.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>

          {/* Asks Column */}
          <View className="flex-1 pl-2">
            {data.asks.slice(0, parseInt(depth)).map((ask, i) => {
              const depthPct = Math.min((ask.qty / (totalAskVol / 3)) * 100, 100);
              return (
                <View key={`ask-${i}`} className="flex-row mb-1.5 relative items-center">
                  <View className="absolute left-0 top-0 bottom-0 bg-[#FF3B30]/15" style={{ width: `${depthPct}%` }} />
                  <Text className="text-[#FF3B30] text-[11px] font-semibold w-[50%]">{ask.price.toFixed(2)}</Text>
                  <Text className="text-white text-[11px] w-[50%] text-right">{ask.qty.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Summary Card */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-4 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-2">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Best Bid</Text>
          <Text className="text-[#00C853] text-sm font-bold">{data.bids[0]?.price.toFixed(2)}</Text>
        </View>
        <View className="w-[48%] mb-2 items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Best Ask</Text>
          <Text className="text-[#FF3B30] text-sm font-bold">{data.asks[0]?.price.toFixed(2)}</Text>
        </View>
        <View className="w-[48%]">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Mid Price</Text>
          <Text className="text-white text-sm font-bold">
            {((data.bids[0]?.price + data.asks[0]?.price) / 2).toFixed(2)}
          </Text>
        </View>
        <View className="w-[48%] items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Spread</Text>
          <Text className="text-white text-sm font-bold">{data.spread.value.toFixed(2)}</Text>
        </View>
      </View>
      
    </ScrollView>
  );
};
