import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FuturesContract, FuturesTrade, formatFuturesPrice } from '../../data/mockFutures';

interface FuturesTradesPanelProps {
  contract: FuturesContract;
  trades: FuturesTrade[];
}

export const FuturesTradesPanel: React.FC<FuturesTradesPanelProps> = ({ contract, trades }) => {
  const buyVolume = trades.filter((t) => t.side === 'buy').reduce((sum, t) => sum + t.qty, 0);
  const sellVolume = trades.filter((t) => t.side === 'sell').reduce((sum, t) => sum + t.qty, 0);
  const total = buyVolume + sellVolume || 1;
  const buyPct = Math.round((buyVolume / total) * 100);

  return (
    <ScrollView className="mx-4 mb-3" showsVerticalScrollIndicator={false}>
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-3">
        <View className="flex-row justify-between mb-2">
          <View>
            <Text className="text-[#9CA3AF] text-xs">Last Price</Text>
            <Text className="text-white text-sm font-bold">{formatFuturesPrice(contract.markPrice)}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[#9CA3AF] text-xs">24h Volume</Text>
            <Text className="text-white text-sm font-bold">{contract.volume24h.toLocaleString()}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-[#00C853] text-xs">Buy {buyPct}%</Text>
          <View className="flex-1 h-1.5 bg-[#18191C] rounded-full overflow-hidden flex-row">
            <View className="h-full bg-[#00C853]" style={{ width: `${buyPct}%` }} />
            <View className="h-full bg-[#FF3B30]" style={{ width: `${100 - buyPct}%` }} />
          </View>
          <Text className="text-[#FF3B30] text-xs">Sell {100 - buyPct}%</Text>
        </View>
      </View>

      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl overflow-hidden">
        <View className="flex-row px-3 py-2 border-b border-[#2A2B2F]">
          <Text className="text-[#9CA3AF] text-xs flex-1">Price (PKR)</Text>
          <Text className="text-[#9CA3AF] text-xs w-16 text-right">Qty</Text>
          <Text className="text-[#9CA3AF] text-xs w-16 text-right">Time</Text>
        </View>
        {trades.map((trade) => (
          <View key={trade.id} className="flex-row px-3 py-2 border-b border-[#18191C]">
            <Text
              className={`flex-1 text-sm font-semibold ${trade.side === 'buy' ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
            >
              {formatFuturesPrice(trade.price)}
            </Text>
            <Text className="text-white text-sm w-16 text-right">{trade.qty}</Text>
            <Text className="text-[#9CA3AF] text-sm w-16 text-right">{trade.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
