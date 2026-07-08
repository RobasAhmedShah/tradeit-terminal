import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MOCK_TRADES } from '../../data/mockTrades';
import { buildTradesForStock } from '../../utils/tradeMarketDepth';
import { Stock } from '../../types';

interface TradesTabContentProps {
  stock: Stock;
}

type TradeFilter = 'All' | 'Buys' | 'Sells' | 'Large';

const LARGE_TRADE_QTY = 4000;
const FILTERS: TradeFilter[] = ['All', 'Buys', 'Sells', 'Large'];

function formatVolume(vol?: number): string {
  if (!vol) return '0.09M';
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(0)}K`;
  return vol.toLocaleString();
}

export const TradesTabContent: React.FC<TradesTabContentProps> = ({ stock }) => {
  const allTrades = MOCK_TRADES[stock.symbol] ?? buildTradesForStock(stock);
  const [filter, setFilter] = useState<TradeFilter>('All');

  const filteredTrades = useMemo(() => {
    return allTrades.filter((trade) => {
      if (filter === 'Buys') return trade.type === 'buy';
      if (filter === 'Sells') return trade.type === 'sell';
      if (filter === 'Large') return trade.qty >= LARGE_TRADE_QTY;
      return true;
    });
  }, [allTrades, filter]);

  const buyVolume = allTrades.filter((t) => t.type === 'buy').reduce((sum, t) => sum + t.qty, 0);
  const sellVolume = allTrades.filter((t) => t.type === 'sell').reduce((sum, t) => sum + t.qty, 0);
  const totalFlow = buyVolume + sellVolume;
  const buyPct = totalFlow > 0 ? Math.round((buyVolume / totalFlow) * 100) : 64;
  const sellPct = 100 - buyPct;

  const lastTrade = allTrades[0];
  const totalTradeQty = allTrades.reduce((sum, t) => sum + t.qty, 0);
  const avgTradeSize = allTrades.length > 0 ? Math.round(totalTradeQty / allTrades.length) : 0;

  return (
    <View className="px-4 pt-3 pb-6">
      {/* Summary Grid */}
      <View className="border border-[#2A2B2F] rounded-xl overflow-hidden mb-4">
        <View className="flex-row">
          <View className="flex-1 p-3.5 border-r border-b border-[#2A2B2F] bg-[#111214]">
            <Text className="text-[#9CA3AF] text-[10px] mb-1">Last Trade</Text>
            <Text className="text-white text-[14px] font-bold">
              Rs {lastTrade?.price.toFixed(2) ?? stock.price.toFixed(2)}
            </Text>
            <Text className="text-[#9CA3AF] text-[10px] mt-0.5">{lastTrade?.time ?? '—'}</Text>
          </View>
          <View className="flex-1 p-3.5 border-b border-[#2A2B2F] bg-[#111214]">
            <Text className="text-[#9CA3AF] text-[10px] mb-1">Total Volume</Text>
            <Text className="text-white text-[14px] font-bold">{formatVolume(stock.volume)}</Text>
          </View>
        </View>
        <View className="flex-row">
          <View className="flex-1 p-3.5 border-r border-[#2A2B2F] bg-[#111214]">
            <Text className="text-[#9CA3AF] text-[10px] mb-1">Trades Today</Text>
            <Text className="text-white text-[14px] font-bold">1,248</Text>
          </View>
          <View className="flex-1 p-3.5 bg-[#111214]">
            <Text className="text-[#9CA3AF] text-[10px] mb-1">Avg Trade Size</Text>
            <Text className="text-white text-[14px] font-bold">{avgTradeSize.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Trade Flow */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
        <Text className="text-[#9CA3AF] text-[12px] font-semibold mb-3">Trade Flow</Text>
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-[#0ECB81] text-[11px] font-medium">Buy Volume {buyPct}%</Text>
          <Text className="text-[#F6465D] text-[11px] font-medium">Sell Volume {sellPct}%</Text>
        </View>
        <View className="h-2 w-full bg-[#2A2B2F] rounded-full overflow-hidden flex-row">
          <View style={{ width: `${buyPct}%` }} className="h-full bg-[#0ECB81]" />
          <View style={{ width: `${sellPct}%` }} className="h-full bg-[#F6465D]" />
        </View>
      </View>

      {/* Filter Pills */}
      <View className="flex-row gap-2 mb-4">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border ${
                active ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#111214]'
              }`}
            >
              <Text className={`text-[11px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Trades Table */}
      <View>
        <View className="flex-row pb-2 mb-1 border-b border-[#2A2B2F]">
          <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-[1.1]">Price (PKR)</Text>
          <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-1 text-right">Qty</Text>
          <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-1 text-right">Time</Text>
          <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-[0.7] text-right">Side</Text>
        </View>

        {filteredTrades.map((trade) => {
          const isBuy = trade.type === 'buy';
          const sideColor = isBuy ? 'text-[#0ECB81]' : 'text-[#F6465D]';
          const isLarge = trade.qty >= LARGE_TRADE_QTY;

          return (
            <View key={trade.id} className="flex-row items-center py-2.5 border-b border-[#2A2B2F]">
              <Text className={`text-[12px] font-semibold flex-[1.1] ${sideColor}`}>
                {trade.price.toFixed(2)}
              </Text>
              <View className="flex-1 flex-row items-center justify-end">
                {isLarge && (
                  <View className="bg-[#FF8A00]/20 rounded px-1 py-0.5 mr-1.5">
                    <Text className="text-[#FF8A00] text-[9px] font-bold">L</Text>
                  </View>
                )}
                <Text className="text-white text-[12px]">{trade.qty.toLocaleString()}</Text>
              </View>
              <Text className="text-[#9CA3AF] text-[11px] flex-1 text-right">{trade.time}</Text>
              <Text className={`text-[11px] font-bold flex-[0.7] text-right ${sideColor}`}>
                {isBuy ? 'Buy' : 'Sell'}
              </Text>
            </View>
          );
        })}

        {filteredTrades.length === 0 && (
          <Text className="text-[#9CA3AF] text-xs text-center py-8">No trades match this filter.</Text>
        )}
      </View>
    </View>
  );
};
