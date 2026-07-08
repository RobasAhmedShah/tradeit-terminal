import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FuturesOpenOrder, formatFuturesPrice } from '../../data/mockFutures';

interface FuturesOpenOrderRowProps {
  order: FuturesOpenOrder;
  onCancel: (order: FuturesOpenOrder) => void;
}

export const FuturesOpenOrderRow: React.FC<FuturesOpenOrderRowProps> = ({ order, onCancel }) => {
  const isLong = order.side === 'Long';

  return (
    <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-2">
      <View className="flex-row items-center">
        <View
          className={`px-1.5 py-0.5 rounded border ${
            isLong ? 'bg-[#0ECB81]/10 border-[#0ECB81]/30' : 'bg-[#F6465D]/10 border-[#F6465D]/30'
          }`}
        >
          <Text className={`text-[11px] font-bold ${isLong ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {order.side}
          </Text>
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-white text-sm font-semibold">{order.symbol}</Text>
          <Text className="text-[#9CA3AF] text-[11px]">
            {order.orderType} · {order.leverage}x {order.marginMode}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onCancel(order)}
          className="bg-[#18191C] border border-[#2A2B2F] px-2.5 py-1 rounded"
        >
          <Text className="text-[#F6465D] text-[11px] font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-2.5">
        <View className="flex-1">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Qty (Lots)</Text>
          <Text className="text-white text-xs font-medium">{order.quantity}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Price</Text>
          <Text className="text-white text-xs font-medium">{formatFuturesPrice(order.price)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Margin</Text>
          <Text className="text-white text-xs font-medium">{formatFuturesPrice(order.requiredMargin)}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Time</Text>
          <Text className="text-[#9CA3AF] text-[10px] font-medium">{order.createdTime}</Text>
        </View>
      </View>
    </View>
  );
};
