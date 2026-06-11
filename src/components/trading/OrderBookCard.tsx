import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ORDER_BOOK } from '../../data/mockOrderBook';

interface OrderBookCardProps {
  symbol: string;
}

export const OrderBookCard: React.FC<OrderBookCardProps> = ({ symbol }) => {
  const data = MOCK_ORDER_BOOK[symbol] || MOCK_ORDER_BOOK['AABS'];

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] p-2 flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-sm">Order Book</Text>
        <View className="flex-row items-center">
          <View className="bg-[#18191C] border border-[#2A2B2F] rounded px-2 py-1 flex-row items-center mr-2">
            <Text className="text-[#9CA3AF] text-[10px] mr-1">10</Text>
            <Ionicons name="caret-down" size={10} color="#9CA3AF" />
          </View>
          <Ionicons name="options-outline" size={14} color="#9CA3AF" />
        </View>
      </View>

      {/* Header Row */}
      <View className="flex-row justify-between mb-2">
        <View className="flex-1 flex-row pr-2 border-r border-[#2A2B2F]">
          <Text className="text-[#9CA3AF] text-[9px] w-[55%]">Bid (PKR)</Text>
          <Text className="text-[#9CA3AF] text-[9px] w-[45%] text-right">Qty</Text>
        </View>
        <View className="flex-1 flex-row pl-2">
          <Text className="text-[#9CA3AF] text-[9px] w-[55%]">Ask (PKR)</Text>
          <Text className="text-[#9CA3AF] text-[9px] w-[45%] text-right">Qty</Text>
        </View>
      </View>

      {/* Bids & Asks Grid */}
      <View className="flex-row justify-between">
        {/* Bids (Green) */}
        <View className="flex-1 pr-2 border-r border-[#2A2B2F]">
          {data.bids.map((bid, i) => (
            <View key={`bid-${i}`} className="flex-row mb-1 relative items-center">
              <View className="absolute right-0 top-0 bottom-0 bg-[#00C853]/10" style={{ width: `${Math.random() * 80 + 20}%` }} />
              <Text className="text-[#00C853] text-[10px] font-semibold w-[55%]">{bid.price.toFixed(2)}</Text>
              <Text className="text-white text-[10px] w-[45%] text-right">{bid.qty.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Asks (Red) */}
        <View className="flex-1 pl-2">
          {data.asks.map((ask, i) => (
            <View key={`ask-${i}`} className="flex-row mb-1 relative items-center">
              <View className="absolute left-0 top-0 bottom-0 bg-[#FF3B30]/10" style={{ width: `${Math.random() * 80 + 20}%` }} />
              <Text className="text-[#FF3B30] text-[10px] font-semibold w-[55%]">{ask.price.toFixed(2)}</Text>
              <Text className="text-white text-[10px] w-[45%] text-right">{ask.qty.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Spread Row */}
      <View className="flex-row justify-between items-center mt-1 pt-1.5 border-t border-[#2A2B2F]">
        <Text className="text-[#00C853] text-sm font-bold">{data.bids[0].price.toFixed(2)}</Text>
        <View className="items-center">
          <Text className="text-[#00C853] text-[9px]">{data.spread.value.toFixed(2)} ({data.spread.percent}%)</Text>
          <Text className="text-[#9CA3AF] text-[8px]">Spread</Text>
        </View>
        <Text className="text-[#FF3B30] text-sm font-bold">{data.asks[0].price.toFixed(2)}</Text>
      </View>
    </View>
  );
};
