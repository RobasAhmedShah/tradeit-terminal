import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../types';
import { buildTradesForStock } from '../../utils/tradeMarketDepth';

interface RecentTradesCardProps {
  symbol: string;
  stock?: Stock;
  compact?: boolean;
  maxRows?: number;
}

export const RecentTradesCard: React.FC<RecentTradesCardProps> = ({ symbol, stock, compact, maxRows }) => {
  const trades = useMemo(() => {
    if (!stock) return [];
    return buildTradesForStock(stock);
  }, [stock, symbol]);

  const visible = compact ? trades.slice(0, maxRows || 6) : trades;

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] p-2 flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-sm">Recent Trades</Text>
        <TouchableOpacity>
          <Text className="text-[#FF8A00] text-[10px] font-semibold">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-1.5">
        <Text className="text-[#9CA3AF] text-[9px] flex-1">Price (PKR)</Text>
        <Text className="text-[#9CA3AF] text-[9px] flex-1 text-center">Qty</Text>
        <Text className="text-[#9CA3AF] text-[9px] flex-[0.8] text-right">Time</Text>
      </View>

      {visible.map((trade) => (
        <View key={trade.id} className="flex-row justify-between items-center py-1">
          <Text className={`text-[10px] font-semibold flex-1 ${trade.type === 'buy' ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {trade.price.toFixed(2)}
          </Text>
          <Text className="text-white text-[10px] flex-1 text-center">{trade.qty.toLocaleString()}</Text>
          <Text className="text-[#9CA3AF] text-[9px] flex-[0.8] text-right">{trade.time}</Text>
        </View>
      ))}
    </View>
  );
};
