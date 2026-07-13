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
  const color = side === 'ask' ? 'text-[#F6465D]' : 'text-[#0ECB81]';
  const depthColor = side === 'ask' ? '#F6465D' : '#0ECB81';

  const content = (
    <View
      className={`flex-row items-center py-0.5 rounded-sm ${
        isSelected ? 'bg-[#FF8A00]/15' : ''
      }`}
    >
      <View className="flex-1 min-w-0 flex-row items-center relative overflow-hidden mr-1">
        <View
          className="absolute top-0 bottom-0 right-0"
          style={{
            width: `${Math.max(depthPct, 8)}%`,
            backgroundColor: depthColor,
            opacity: compact ? 0.14 : 0.1,
          }}
        />
        <Text
          className={`${color} font-medium flex-1 min-w-0 ${textSize}`}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {formatFuturesPrice(level.price)}
        </Text>
      </View>
      <Text className={`text-[#E5E7EB] w-[42px] text-right ${textSize}`} numberOfLines={1}>
        {level.size}
      </Text>
      {!compact && (
        <Text className={`text-[#E5E7EB] w-[42px] text-right pr-0.5 ${textSize}`} numberOfLines={1}>
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
    <View className="flex-row items-center pb-1 mb-1 border-b border-app-border">
      <Text className={`text-app-muted ${headerSize} flex-1`}>Price</Text>
      <Text className={`text-app-muted ${headerSize} w-[42px] text-right`}>Size</Text>
      {!compact && (
        <Text className={`text-app-muted ${headerSize} w-[42px] text-right pr-0.5`}>Total</Text>
      )}
    </View>
  );

  const markRow = (
    <View className="bg-app-card-soft rounded-md py-1.5 px-2 my-1 flex-row items-center justify-between overflow-hidden">
      <Text
        className={`text-[#FF8A00] font-bold flex-1 min-w-0 ${compact ? 'text-xs' : 'text-sm'}`}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {formatFuturesPrice(contract.markPrice)}
      </Text>
      {!compact ? (
        <Text className="text-app-muted text-[11px] ml-2 shrink-0" numberOfLines={1}>
          Mark {formatFuturesPrice(contract.indexPrice)}
        </Text>
      ) : (
        <Text className="text-app-muted text-[10px] ml-2 shrink-0" numberOfLines={1}>
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
      className={`bg-app-card border border-app-border rounded-xl overflow-hidden ${
        compact ? 'p-2 flex-1 self-stretch' : 'mx-4 p-3 mb-3'
      }`}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className={`text-app-text font-bold ${compact ? 'text-xs' : 'text-sm'}`}>
          Order Book
        </Text>
        <View className="flex-row items-center bg-app-card-soft border border-app-border rounded px-1.5 py-0.5">
          <Text className="text-app-muted text-[10px] mr-0.5">0.25</Text>
          <Ionicons name="chevron-down" size={9} color="#9CA3AF" />
        </View>
      </View>

      {onPricePress && (
        <Text className="text-app-muted text-[10px] mb-1.5">Tap a price to fill limit order</Text>
      )}

      <View className="overflow-hidden">
        {columnHeader}

        {compact ? (
          <View className="flex-1 justify-between">
            <View className="flex-1 justify-end">
              {displayAsks.map((ask, index) => renderRow(ask, 'ask', index))}
            </View>
            {markRow}
            <View className="flex-1 justify-start">
              {displayBids.map((bid, index) => renderRow(bid, 'bid', index))}
            </View>
          </View>
        ) : (
          <>
            {displayAsks.map((ask, index) => renderRow(ask, 'ask', index))}
            {markRow}
            {displayBids.map((bid, index) => renderRow(bid, 'bid', index))}
            <View className="mt-2.5">
              <View className="flex-row items-center gap-1">
                <Text className="text-[#0ECB81] text-xs">B</Text>
                <View className="flex-[0.56] h-[5px] bg-[#0ECB81] opacity-30 rounded-full" />
                <View className="flex-[0.44] h-[5px] bg-[#F6465D] opacity-30 rounded-full" />
                <Text className="text-[#F6465D] text-xs">S</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-[#0ECB81] text-[11px]">56%</Text>
                <Text className="text-[#F6465D] text-[11px]">44%</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
