import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../context/FuturesContext';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { formatFuturesPrice } from '../../data/mockFutures';

export const FuturesPortfolioSummaryCard: React.FC = () => {
  const router = useRouter();
  const { openTransfer } = useTransferSheet();
  const { positions, openOrders, marginAvailable, marginUsed, isMarketLive } = useFutures();

  const totalUnrealizedPnl = useMemo(
    () => positions.reduce((sum, position) => sum + position.unrealizedPnl, 0),
    [positions]
  );

  const isPositive = totalUnrealizedPnl >= 0;
  const isEmpty = marginAvailable === 0 && marginUsed === 0 && positions.length === 0 && openOrders.length === 0;

  if (isEmpty) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openTransfer()}
        className="mx-4 mb-4 bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4"
      >
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-2.5">
            <Ionicons name="trending-up" size={18} color="#FF8A00" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-bold">Futures Margin</Text>
            <Text className="text-[#9CA3AF] text-[11px] mt-0.5">
              No futures balance yet. Transfer from Spot to fund margin.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FF8A00" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push('/(tabs)/futures')}
      className="mx-4 mb-4 bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-2.5">
            <Ionicons name="trending-up" size={18} color="#FF8A00" />
          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-white text-sm font-bold">Futures Margin</Text>
              {isMarketLive && (
                <View className="ml-2 flex-row items-center bg-[#0ECB81]/10 px-1.5 py-0.5 rounded-full">
                  <View className="w-1 h-1 rounded-full bg-[#0ECB81] mr-1" />
                  <Text className="text-[#0ECB81] text-[8px] font-bold">LIVE</Text>
                </View>
              )}
            </View>
            <Text className="text-[#9CA3AF] text-[11px]">
              {positions.length} open position{positions.length === 1 ? '' : 's'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#FF8A00" />
      </View>

      <View className="flex-row">
        <View className="flex-1">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Available</Text>
          <Text className="text-white text-sm font-semibold">
            {formatFuturesPrice(marginAvailable)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Used</Text>
          <Text className="text-white text-sm font-semibold">
            {formatFuturesPrice(marginUsed)}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-[#9CA3AF] text-[10px] mb-1">Unrealized PnL</Text>
          <Text className={`text-sm font-semibold ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {isPositive ? '+' : ''}
            {formatFuturesPrice(totalUnrealizedPnl)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
