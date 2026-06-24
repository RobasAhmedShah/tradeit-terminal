import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../types';
import { buildOrderBookForStock } from '../../utils/tradeMarketDepth';

interface OrderBookCardProps {
  symbol: string;
  stock?: Stock;
  compact?: boolean;
  maxRows?: number;
  selectedPrice?: number | null;
  onPricePress?: (price: number, side: 'bid' | 'ask') => void;
}

function depthWidth(seed: number, index: number): number {
  return 20 + ((seed + index * 17) % 80);
}

export const OrderBookCard: React.FC<OrderBookCardProps> = ({
  symbol,
  stock,
  compact,
  maxRows,
  selectedPrice,
  onPricePress,
}) => {
  const data = useMemo(() => (stock ? buildOrderBookForStock(stock) : null), [stock, symbol]);
  if (!data) return null;

  const displayBids = compact ? data.bids.slice(0, maxRows || 6) : data.bids;
  const displayAsks = compact ? data.asks.slice(0, maxRows || 6) : data.asks;
  const seed = symbol.split('').reduce((h, c) => h + c.charCodeAt(0), 0);

  const renderRow = (
    price: number,
    qty: number,
    side: 'bid' | 'ask',
    index: number
  ) => {
    const isBid = side === 'bid';
    const selected = selectedPrice != null && Math.abs(selectedPrice - price) < 0.001;
    const color = isBid ? 'text-[#00C853]' : 'text-[#FF3B30]';
    const barColor = isBid ? 'bg-[#00C853]/10' : 'bg-[#FF3B30]/10';
    const width = depthWidth(seed, index);

    const content = (
      <View className={`flex-row mb-1 relative items-center ${selected ? 'bg-[#FF8A00]/10 rounded' : ''}`}>
        <View
          className={`absolute top-0 bottom-0 ${barColor} ${isBid ? 'right-0' : 'left-0'}`}
          style={{ width: `${width}%` }}
        />
        <Text className={`${color} text-[10px] font-semibold w-[55%]`}>{price.toFixed(2)}</Text>
        <Text className="text-white text-[10px] w-[45%] text-right">{qty.toLocaleString()}</Text>
      </View>
    );

    if (!onPricePress) return <View key={`${side}-${index}`}>{content}</View>;

    return (
      <TouchableOpacity
        key={`${side}-${index}`}
        activeOpacity={0.7}
        onPress={() => onPricePress(price, side)}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] p-2 flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-sm">Order Book</Text>
        <View className="flex-row items-center">
          {onPricePress ? (
            <Text className="text-[#FF8A00] text-[9px] mr-2">Tap price → limit</Text>
          ) : null}
          <View className="bg-[#18191C] border border-[#2A2B2F] rounded px-2 py-1 flex-row items-center mr-2">
            <Text className="text-[#9CA3AF] text-[10px] mr-1">10</Text>
            <Ionicons name="caret-down" size={10} color="#9CA3AF" />
          </View>
          <Ionicons name="options-outline" size={14} color="#9CA3AF" />
        </View>
      </View>

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

      <View className="flex-row justify-between">
        <View className="flex-1 pr-2 border-r border-[#2A2B2F]">
          {displayBids.map((bid, i) => renderRow(bid.price, bid.qty, 'bid', i))}
        </View>
        <View className="flex-1 pl-2">
          {displayAsks.map((ask, i) => renderRow(ask.price, ask.qty, 'ask', i))}
        </View>
      </View>

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
