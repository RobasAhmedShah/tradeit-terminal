import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatFuturesPrice } from '../../data/mockFutures';

export default function FuturesCloseSuccessScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();

  let closeData: {
    symbol: string;
    side: string;
    sizeLots: number;
    closePrice: number;
    realizedPnl: number;
  } | null = null;

  if (data) {
    try {
      closeData = JSON.parse(data);
    } catch {
      closeData = null;
    }
  }

  const handleDone = () => {
    router.navigate('/(tabs)/futures');
  };

  if (!closeData) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <TouchableOpacity onPress={handleDone} className="px-6 py-2 bg-[#FF8A00] rounded-xl">
          <Text className="text-black font-bold">Back to Futures</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isProfit = closeData.realizedPnl >= 0;

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <View className="w-10" />
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Position Closed</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-[#00C853]/15 items-center justify-center mb-4">
            <Ionicons name="checkmark" size={32} color="#00C853" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Position Closed</Text>
          <Text className="text-[#9CA3AF] text-sm text-center">
            Your {closeData.side.toLowerCase()} {closeData.symbol} position has been closed at market
          </Text>
        </View>

        <View className="bg-[#111214] rounded-2xl p-5 mb-8 border border-[#2A2B2F]">
          <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-sm">Contract</Text>
            <Text className="text-white text-sm font-semibold">{closeData.symbol}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-sm">Closed Size</Text>
            <Text className="text-white text-sm font-semibold">{closeData.sizeLots} lots</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-sm">Close Price</Text>
            <Text className="text-white text-sm font-semibold">{formatFuturesPrice(closeData.closePrice)}</Text>
          </View>
          <View className="flex-row justify-between pt-3">
            <Text className="text-white text-sm font-bold">Realized PnL</Text>
            <Text className={`text-sm font-bold ${isProfit ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
              {isProfit ? '+' : ''}
              {formatFuturesPrice(closeData.realizedPnl)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleDone} className="items-center py-4 rounded-xl bg-[#FF8A00] mb-10">
          <Text className="text-black font-bold text-base">Back to Futures</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
