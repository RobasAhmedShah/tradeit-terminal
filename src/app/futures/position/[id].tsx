import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../../context/FuturesContext';
import { useTheme } from '../../../context/ThemeContext';
import { useFuturesCloseSheet } from '../../../context/FuturesCloseSheetContext';
import {
  estimateLiqPrice,
  formatFuturesPrice,
} from '../../../data/mockFutures';
import { safeBack } from '../../../utils/navigation';

export default function FuturesPositionDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPositionById } = useFutures();
  const { openCloseSheet } = useFuturesCloseSheet();

  const position = id ? getPositionById(id) : undefined;

  if (!position) {
    return (
      <SafeAreaView className="flex-1 bg-app-bg justify-center items-center px-6">
        <Text className="text-app-text text-lg font-semibold mb-2">Position not found</Text>
        <Text className="text-app-muted text-sm text-center mb-6">
          This position may have been closed or no longer exists.
        </Text>
        <TouchableOpacity
          onPress={() => safeBack(router, '/orders?tab=futures&view=positions')}
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
    openCloseSheet(position, () => safeBack(router, '/orders?tab=futures&view=positions'));
  };

  const Row = ({ label, value, valueClass = 'text-app-text' }: { label: string; value: string; valueClass?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-app-border">
      <Text className="text-app-muted text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="flex-row items-center px-4 py-3 border-b border-app-border">
        <TouchableOpacity onPress={() => safeBack(router, '/orders?tab=futures&view=positions')} className="w-10">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-app-text text-lg font-bold mr-10">Position Detail</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-app-card border border-app-border rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View
              className={`px-2 py-1 rounded border ${
                isLong ? 'bg-[#0ECB81]/10 border-[#0ECB81]/30' : 'bg-[#F6465D]/10 border-[#F6465D]/30'
              }`}
            >
              <Text className={`text-sm font-bold ${isLong ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {position.side}
              </Text>
            </View>
            <View className="ml-3">
              <Text className="text-app-text text-lg font-bold">{position.symbol}</Text>
              <Text className="text-app-muted text-xs">
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
            valueClass={position.unrealizedPnl >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}
          />
          <Row label="Est. Liq. Price" value={formatFuturesPrice(liqPrice)} valueClass="text-[#F6465D]" />
        </View>

        <Text className="text-app-text text-base font-bold mb-2">Risk Management</Text>
        <View className="bg-app-card border border-app-border rounded-xl p-4 mb-6">
          <Row label="Take Profit" value="Not set" valueClass="text-app-muted" />
          <Row label="Stop Loss" value="Not set" valueClass="text-app-muted" />
          <TouchableOpacity className="mt-3 py-2.5 rounded-lg border border-dashed border-app-border items-center">
            <Text className="text-[#FF8A00] text-sm font-semibold">+ Add TP / SL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleClose} className="bg-[#F6465D] py-3.5 rounded-xl items-center mb-10">
          <Text className="text-app-text font-bold text-base">Close Position</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
