import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ORDER_BOOK } from '../../data/mockOrderBook';
import { OrderBookLevel, Stock } from '../../types';

interface OrderBookTabContentProps {
  stock: Stock;
}

const DEPTH_OPTIONS = ['5', '10', '15'] as const;

function depthPercent(qty: number, maxQty: number): number {
  if (maxQty <= 0) return 0;
  return Math.min(100, Math.round((qty / maxQty) * 100));
}

function BookSide({
  levels,
  side,
  maxQty,
}: {
  levels: OrderBookLevel[];
  side: 'bid' | 'ask';
  maxQty: number;
}) {
  const priceColor = side === 'bid' ? 'text-[#00C853]' : 'text-[#FF3B30]';
  const barColor = side === 'bid' ? '#00C853' : '#FF3B30';

  return (
    <View className="flex-1">
      {levels.map((level, i) => {
        const pct = depthPercent(level.qty, maxQty);
        return (
          <View key={`${side}-${i}`} className="flex-row items-center py-[5px] relative overflow-hidden">
            <View
              className="absolute top-0 bottom-0"
              style={{
                ...(side === 'bid' ? { right: 0 } : { left: 0 }),
                width: `${Math.max(pct, 8)}%`,
                backgroundColor: barColor,
                opacity: 0.12,
              }}
            />
            <Text className={`${priceColor} text-[12px] font-semibold flex-1`}>
              {level.price.toFixed(2)}
            </Text>
            <Text className="text-white text-[12px] font-medium w-[52px] text-right">
              {level.qty.toLocaleString()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export const OrderBookTabContent: React.FC<OrderBookTabContentProps> = ({ stock }) => {
  const data = MOCK_ORDER_BOOK[stock.symbol] || MOCK_ORDER_BOOK['SAZEW'];
  const [depthIdx, setDepthIdx] = useState(1);
  const depth = DEPTH_OPTIONS[depthIdx];

  const visibleBids = useMemo(() => data.bids.slice(0, parseInt(depth, 10)), [data.bids, depth]);
  const visibleAsks = useMemo(() => data.asks.slice(0, parseInt(depth, 10)), [data.asks, depth]);

  const maxBidQty = useMemo(() => Math.max(...visibleBids.map((b) => b.qty), 1), [visibleBids]);
  const maxAskQty = useMemo(() => Math.max(...visibleAsks.map((a) => a.qty), 1), [visibleAsks]);

  const totalBidVol = visibleBids.reduce((sum, bid) => sum + bid.qty, 0);
  const totalAskVol = visibleAsks.reduce((sum, ask) => sum + ask.qty, 0);
  const totalVol = totalBidVol + totalAskVol;
  const buyPressure = totalVol > 0 ? Math.round((totalBidVol / totalVol) * 100) : 52;
  const sellPressure = 100 - buyPressure;

  const bestBid = data.bids[0]?.price ?? 0;
  const bestAsk = data.asks[0]?.price ?? 0;
  const midPrice = (bestBid + bestAsk) / 2;

  const cycleDepth = () => setDepthIdx((i) => (i + 1) % DEPTH_OPTIONS.length);

  return (
    <View className="px-4 pt-3 pb-6">
      {/* Market Depth Summary */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-[15px] font-bold">Market Depth Summary</Text>
          <TouchableOpacity
            onPress={cycleDepth}
            className="bg-[#18191C] border border-[#2A2B2F] rounded-md px-2.5 py-1 flex-row items-center"
          >
            <Text className="text-[#9CA3AF] text-[11px] mr-1">{depth}</Text>
            <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text className="text-[#9CA3AF] text-[11px] mb-3">
          Spread: {data.spread.value.toFixed(2)} ({data.spread.percent.toFixed(2)}%)
        </Text>

        <View className="flex-row justify-between mb-1.5">
          <Text className="text-[#00C853] text-[11px] font-medium">Buy Pressure {buyPressure}%</Text>
          <Text className="text-[#FF3B30] text-[11px] font-medium">Sell Pressure {sellPressure}%</Text>
        </View>
        <View className="h-2 w-full bg-[#2A2B2F] rounded-full overflow-hidden flex-row">
          <View style={{ width: `${buyPressure}%` }} className="h-full bg-[#00C853]" />
          <View style={{ width: `${sellPressure}%` }} className="h-full bg-[#FF3B30]" />
        </View>
      </View>

      {/* Order Book Table */}
      <View className="mb-4">
        <View className="flex-row mb-2 px-0.5">
          <View className="flex-1 flex-row pr-3">
            <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-1">Bid (PKR)</Text>
            <Text className="text-[#9CA3AF] text-[10px] font-semibold w-[52px] text-right">Bid Qty</Text>
          </View>
          <View className="w-px bg-[#2A2B2F] mx-1" />
          <View className="flex-1 flex-row pl-3">
            <Text className="text-[#9CA3AF] text-[10px] font-semibold flex-1">Ask (PKR)</Text>
            <Text className="text-[#9CA3AF] text-[10px] font-semibold w-[52px] text-right">Ask Qty</Text>
          </View>
        </View>

        <View className="flex-row">
          <View className="flex-1 pr-3 border-r border-[#2A2B2F]">
            <BookSide levels={visibleBids} side="bid" maxQty={maxBidQty} />
          </View>
          <View className="flex-1 pl-3">
            <BookSide levels={visibleAsks} side="ask" maxQty={maxAskQty} />
          </View>
        </View>
      </View>

      {/* Bottom Summary */}
      <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl px-3 py-3 flex-row">
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Best Bid</Text>
          <Text className="text-[#00C853] text-[13px] font-bold">{bestBid.toFixed(2)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Best Ask</Text>
          <Text className="text-[#FF3B30] text-[13px] font-bold">{bestAsk.toFixed(2)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Mid Price</Text>
          <Text className="text-white text-[13px] font-bold">{midPrice.toFixed(2)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Spread</Text>
          <Text className="text-white text-[13px] font-bold">
            {data.spread.value.toFixed(2)} / {data.spread.percent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};
