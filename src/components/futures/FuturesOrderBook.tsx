import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FuturesBookLevel,
  FuturesContract,
  formatFuturesPrice,
} from '../../data/mockFutures';

interface FuturesOrderBookProps {
  contract: FuturesContract;
  asks: FuturesBookLevel[];
  bids: FuturesBookLevel[];
  compact?: boolean;
  maxRows?: number;
  selectedPrice?: number | null;
  onPricePress?: (price: number, side: 'ask' | 'bid') => void;
}

function BookRow({
  level,
  side,
  compact,
  depthPct,
  isSelected,
  onPress,
}: {
  level: FuturesBookLevel;
  side: 'ask' | 'bid';
  compact: boolean;
  depthPct: number;
  isSelected: boolean;
  onPress?: () => void;
}) {
  const textSize = compact ? 'text-[11px]' : 'text-xs';
  const color = side === 'ask' ? 'text-[#FF3B30]' : 'text-[#00C853]';
  const depthColor = side === 'ask' ? '#FF3B30' : '#00C853';

  const content = (
    <View
      className={`w-full flex-row items-center py-0.5 relative overflow-hidden rounded-sm ${
        isSelected ? 'bg-[#FF8A00]/15 border border-[#FF8A00]/40' : ''
      }`}
    >
      <View
        className="absolute top-0 right-0 bottom-0"
        style={{
          width: `${Math.max(depthPct, 12)}%`,
          backgroundColor: depthColor,
          opacity: compact ? 0.14 : 0.08,
        }}
      />
      <Text className={`${color} font-medium flex-[1.35] ${textSize}`} numberOfLines={1}>
        {formatFuturesPrice(level.price)}
      </Text>
      <Text className={`text-[#E5E7EB] flex-1 text-right ${textSize}`} numberOfLines={1}>
        {level.size}
      </Text>
      {!compact && (
        <Text className={`text-[#E5E7EB] flex-1 text-right ${textSize}`} numberOfLines={1}>
          {level.total}
        </Text>
      )}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

function getDepthPercent(level: FuturesBookLevel, maxTotal: number): number {
  if (maxTotal <= 0) return 12;
  return Math.min(100, Math.round((level.total / maxTotal) * 100));
}

function isPriceMatch(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.01;
}

export const FuturesOrderBook: React.FC<FuturesOrderBookProps> = ({
  contract,
  asks,
  bids,
  compact = false,
  maxRows = 8,
  selectedPrice = null,
  onPricePress,
}) => {
  const rowLimit = compact ? maxRows : asks.length;
  const displayAsks = asks.slice(0, rowLimit);
  const displayBids = bids.slice(0, rowLimit);
  const headerSize = compact ? 'text-[10px]' : 'text-[11px]';

  const maxAskTotal = useMemo(
    () => Math.max(...displayAsks.map((level) => level.total), 1),
    [displayAsks]
  );
  const maxBidTotal = useMemo(
    () => Math.max(...displayBids.map((level) => level.total), 1),
    [displayBids]
  );

  const columnHeader = (
    <View className="w-full flex-row items-center pb-1 mb-1 border-b border-[#2A2B2F]">
      <Text className={`text-[#9CA3AF] ${headerSize} flex-[1.35]`}>Price</Text>
      <Text className={`text-[#9CA3AF] ${headerSize} flex-1 text-right`}>Size</Text>
      {!compact && (
        <Text className={`text-[#9CA3AF] ${headerSize} flex-1 text-right`}>Total</Text>
      )}
    </View>
  );

  const markRow = (
    <View className="w-full bg-[#18191C] rounded-md py-1.5 px-2 my-1 flex-row items-center justify-between">
      <Text className={`text-[#FF8A00] font-bold ${compact ? 'text-xs' : 'text-sm'}`}>
        {formatFuturesPrice(contract.markPrice)}
      </Text>
      {!compact ? (
        <Text className="text-[#9CA3AF] text-[11px]">
          Mark {formatFuturesPrice(contract.indexPrice)}
        </Text>
      ) : (
        <Text className="text-[#9CA3AF] text-[10px]">
          M {formatFuturesPrice(contract.indexPrice)}
        </Text>
      )}
    </View>
  );

  const renderRow = (level: FuturesBookLevel, side: 'ask' | 'bid', index: number) => (
    <BookRow
      key={`${side}-${index}`}
      level={level}
      side={side}
      compact={compact}
      depthPct={getDepthPercent(level, side === 'ask' ? maxAskTotal : maxBidTotal)}
      isSelected={selectedPrice != null && isPriceMatch(selectedPrice, level.price)}
      onPress={onPricePress ? () => onPricePress(level.price, side) : undefined}
    />
  );

  return (
    <View
      className={`bg-[#111214] border border-[#2A2B2F] rounded-xl w-full ${
        compact ? 'p-2 flex-1 self-stretch' : 'mx-4 p-3 mb-3'
      }`}
    >
      <View className="w-full flex-row items-center justify-between mb-1">
        <Text className={`text-white font-bold ${compact ? 'text-xs' : 'text-sm'}`}>
          Order Book
        </Text>
        <View className="flex-row items-center bg-[#18191C] border border-[#2A2B2F] rounded px-1.5 py-0.5">
          <Text className="text-[#9CA3AF] text-[10px] mr-0.5">0.25</Text>
          <Ionicons name="chevron-down" size={9} color="#9CA3AF" />
        </View>
      </View>

      {onPricePress && (
        <Text className="text-[#9CA3AF] text-[10px] mb-1.5">Tap a price to fill limit order</Text>
      )}

      {columnHeader}

      {compact ? (
        <View className="flex-1 w-full justify-between">
          <View className="flex-1 w-full justify-end">
            {displayAsks.map((ask, index) => renderRow(ask, 'ask', index))}
          </View>
          {markRow}
          <View className="flex-1 w-full justify-start">
            {displayBids.map((bid, index) => renderRow(bid, 'bid', index))}
          </View>
        </View>
      ) : (
        <>
          {displayAsks.map((ask, index) => renderRow(ask, 'ask', index))}
          {markRow}
          {displayBids.map((bid, index) => renderRow(bid, 'bid', index))}
          <View className="w-full mt-2.5">
            <View className="flex-row items-center gap-1">
              <Text className="text-[#00C853] text-xs">B</Text>
              <View className="flex-[0.56] h-[5px] bg-[#00C853] opacity-30 rounded-full" />
              <View className="flex-[0.44] h-[5px] bg-[#FF3B30] opacity-30 rounded-full" />
              <Text className="text-[#FF3B30] text-xs">S</Text>
            </View>
            <View className="flex-row justify-between mt-1 px-1">
              <Text className="text-[#00C853] text-[11px]">56%</Text>
              <Text className="text-[#FF3B30] text-[11px]">44%</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
