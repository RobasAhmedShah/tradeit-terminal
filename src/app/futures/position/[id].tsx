import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../../context/FuturesContext';
import {
  estimateLiqPrice,
  formatFuturesPrice,
} from '../../../data/mockFutures';

export default function FuturesPositionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPositionById } = useFutures();

  const position = id ? getPositionById(id) : undefined;

  if (!position) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center px-6">
        <Text className="text-white text-lg font-semibold mb-2">Position not found</Text>
        <Text className="text-[#9CA3AF] text-sm text-center mb-6">
          This position may have been closed or no longer exists.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#FF8A00] px-6 py-3 rounded-xl"
        >
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isLong = position.side === 'Long';
  const liqPrice = estimateLiqPrice(position.side, position.entryPrice, position.leverage);

  const handleClose = () => {
    router.push({
      pathname: '/futures/close-review',
      params: { data: JSON.stringify(position) },
    });
  };

  const Row = ({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
      <Text className="text-[#9CA3AF] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Position Detail</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View
              className={`px-2 py-1 rounded border ${
                isLong ? 'bg-[#00C853]/10 border-[#00C853]/30' : 'bg-[#FF3B30]/10 border-[#FF3B30]/30'
              }`}
            >
              <Text className={`text-sm font-bold ${isLong ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                {position.side}
              </Text>
            </View>
            <View className="ml-3">
              <Text className="text-white text-lg font-bold">{position.symbol}</Text>
              <Text className="text-[#9CA3AF] text-xs">
                {position.expiry} · {position.leverage}x
              </Text>
            </View>
          </View>

          <Row label="Size (Lots)" value={String(position.sizeLots)} />
          <Row label="Entry Price" value={formatFuturesPrice(position.entryPrice)} />
          <Row label="Mark Price" value={formatFuturesPrice(position.markPrice)} />
          <Row
            label="Unrealized PnL"
            value={`${position.unrealizedPnl >= 0 ? '+' : ''}${formatFuturesPrice(position.unrealizedPnl)} (${position.unrealizedPnlPct.toFixed(2)}%)`}
            valueClass={position.unrealizedPnl >= 0 ? 'text-[#00C853]' : 'text-[#FF3B30]'}
          />
          <Row label="Est. Liq. Price" value={formatFuturesPrice(liqPrice)} valueClass="text-[#FF3B30]" />
        </View>

        <Text className="text-white text-base font-bold mb-2">Risk Management</Text>
        <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-6">
          <Row label="Take Profit" value="Not set" valueClass="text-[#9CA3AF]" />
          <Row label="Stop Loss" value="Not set" valueClass="text-[#9CA3AF]" />
          <TouchableOpacity className="mt-3 py-2.5 rounded-lg border border-dashed border-[#2A2B2F] items-center">
            <Text className="text-[#FF8A00] text-sm font-semibold">+ Add TP / SL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleClose} className="bg-[#FF3B30] py-3.5 rounded-xl items-center mb-10">
          <Text className="text-white font-bold text-base">Close Position</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
