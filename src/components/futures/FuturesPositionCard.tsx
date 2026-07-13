import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FuturesPosition, formatFuturesPrice } from '../../data/mockFutures';
import { futuresPositionHref } from '../../utils/futuresRoutes';

interface FuturesPositionCardProps {
  position: FuturesPosition;
  onClose: (position: FuturesPosition) => void;
  compact?: boolean;
}

export const FuturesPositionCard: React.FC<FuturesPositionCardProps> = ({
  position,
  onClose,
  compact = false,
}) => {
  const router = useRouter();
  const isLong = position.side === 'Long';

  const openDetail = () => {
    const href = futuresPositionHref(position);
    if (href) router.push(href);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={openDetail}
      className="bg-app-card border border-app-border rounded-xl p-3 mb-2"
    >
      <View className="flex-row items-center">
        <View
          className={`px-1.5 py-0.5 rounded border ${
            isLong ? 'bg-[#0ECB81]/10 border-[#0ECB81]/30' : 'bg-[#F6465D]/10 border-[#F6465D]/30'
          }`}
        >
          <Text className={`text-[11px] font-bold ${isLong ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {position.side}
          </Text>
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-app-text text-sm font-semibold">{position.symbol}</Text>
          <Text className="text-app-muted text-[11px]">
            {position.expiry} · {position.leverage}x
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onClose(position);
          }}
          className="bg-app-card-soft border border-app-border px-2.5 py-1 rounded"
        >
          <Text className="text-app-muted text-[11px] font-semibold">Close</Text>
        </TouchableOpacity>
      </View>

      <View className={`flex-row ${compact ? 'mt-2' : 'mt-2.5'}`}>
        <View className="flex-1">
          <Text className="text-app-muted text-[10px] mb-1">Size (Lots)</Text>
          <Text className="text-app-text text-xs font-medium">{position.sizeLots}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-app-muted text-[10px] mb-1">Entry</Text>
          <Text className="text-app-text text-xs font-medium">{formatFuturesPrice(position.entryPrice)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-app-muted text-[10px] mb-1">Mark</Text>
          <Text className="text-app-text text-xs font-medium">{formatFuturesPrice(position.markPrice)}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-app-muted text-[10px] mb-1">Unrealized PnL</Text>
          <Text
            className={`text-xs font-medium ${position.unrealizedPnl >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
          >
            {position.unrealizedPnl >= 0 ? '+' : ''}
            {formatFuturesPrice(position.unrealizedPnl)}
          </Text>
          <Text
            className={`text-[10px] ${position.unrealizedPnlPct >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
          >
            ({position.unrealizedPnlPct >= 0 ? '+' : ''}
            {position.unrealizedPnlPct.toFixed(2)}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
