import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

export function DiscoverBalanceStrip() {
  const router = useRouter();
  const { summary } = usePortfolio();
  const [hidden, setHidden] = useState(false);

  const isPositive = summary.todayPnl >= 0;
  const pnlColor = isPositive ? '#0ECB81' : '#F6465D';

  return (
    <View className="mx-4 mt-1 mb-3">
      <View className="flex-row items-center mb-1">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/portfolio')}
          activeOpacity={0.85}
          className="flex-row items-center"
        >
          <Text className="text-[#8A8D93] text-[12px]">Total Balance (PKR)</Text>
          <Ionicons name="chevron-down" size={12} color="#8A8D93" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHidden((h) => !h)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="ml-2"
        >
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={14} color="#8A8D93" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/portfolio')}
          activeOpacity={0.85}
          className="flex-1 mr-3"
        >
          <Text className="text-white text-5xl font-bold tracking-tight" numberOfLines={1} adjustsFontSizeToFit>
            {hidden ? 'Rs ••••••' : `Rs ${formatPortfolioRs(summary.totalValue)}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/deposit')}
          activeOpacity={0.9}
          className="bg-[#FF8A00] rounded-lg px-4 py-2.5"
        >
          <Text className="text-black text-[13px] font-bold">Add Funds</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/(tabs)/portfolio')}
        activeOpacity={0.85}
        className="flex-row items-center mt-1"
      >
        <Text className="text-[#8A8D93] text-[12px]">Today's PNL </Text>
        {hidden ? (
          <Text className="text-[#8A8D93] text-[12px] font-medium">••••</Text>
        ) : (
          <Text className="text-[12px] font-semibold" style={{ color: pnlColor }}>
            {isPositive ? '+' : ''}Rs {formatPortfolioRs(summary.todayPnl)} ({isPositive ? '+' : ''}
            {summary.todayPnlPct}%)
          </Text>
        )}
        <Ionicons name="chevron-down" size={12} color="#8A8D93" style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    </View>
  );
}
