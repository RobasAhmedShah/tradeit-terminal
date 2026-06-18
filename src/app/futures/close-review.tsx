import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../context/FuturesContext';
import { FuturesPosition, formatFuturesPrice } from '../../data/mockFutures';

export default function FuturesCloseReviewScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const { closePosition } = useFutures();

  let position: FuturesPosition | null = null;
  if (data) {
    try {
      position = JSON.parse(data);
    } catch {
      position = null;
    }
  }

  if (!position) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white">Invalid position data</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-2 bg-[#FF8A00] rounded-xl">
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isLong = position.side === 'Long';
  const closeSide = isLong ? 'Short' : 'Long';
  const estProceeds = position.markPrice * position.sizeLots;

  const handleConfirm = () => {
    closePosition(position!);
    router.replace({
      pathname: '/futures/close-success',
      params: {
        data: JSON.stringify({
          symbol: position!.symbol,
          side: position!.side,
          sizeLots: position!.sizeLots,
          closePrice: position!.markPrice,
          realizedPnl: position!.unrealizedPnl,
        }),
      },
    });
  };

  const Row = ({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
      <Text className="text-[#9CA3AF] text-sm font-semibold">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">
            Trade<Text className="text-[#FF8A00]">It</Text>
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="border border-[#2A2B2F] rounded-full px-3 py-1 mb-3">
            <Text className="text-[#FF8A00] text-[10px] font-bold uppercase">Close Position</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Confirm Close</Text>
          <Text className="text-[#9CA3AF] text-xs text-center">
            You are closing your {position.side.toLowerCase()} position at market price
          </Text>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <Row label="Contract" value={position.symbol} />
          <Row label="Position Side" value={position.side} valueClass={isLong ? 'text-[#00C853]' : 'text-[#FF3B30]'} />
          <Row label="Close Action" value={`Market ${closeSide}`} />
          <Row label="Size (Lots)" value={String(position.sizeLots)} />
          <Row label="Entry Price" value={formatFuturesPrice(position.entryPrice)} />
          <Row label="Close Price (Mark)" value={formatFuturesPrice(position.markPrice)} />
          <View className="flex-row justify-between pt-3">
            <Text className="text-white text-sm font-bold">Est. Realized PnL</Text>
            <Text
              className={`text-sm font-bold ${position.unrealizedPnl >= 0 ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
            >
              {position.unrealizedPnl >= 0 ? '+' : ''}
              {formatFuturesPrice(position.unrealizedPnl)}
            </Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-6 border border-[#2A2B2F]">
          <View className="flex-row justify-between">
            <Text className="text-[#9CA3AF] text-xs">Est. Close Value</Text>
            <Text className="text-white text-xs font-semibold">{formatFuturesPrice(estProceeds)}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleConfirm} className="bg-[#FF3B30] py-3.5 rounded-xl items-center mb-3">
          <Text className="text-white font-bold text-base">Confirm Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="py-3.5 rounded-xl items-center border border-[#FF8A00] mb-10"
        >
          <Text className="text-[#FF8A00] font-bold text-sm">Keep Position</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
