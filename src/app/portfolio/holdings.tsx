import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { HoldingRow, HoldingsEmptyState } from '../../components/portfolio/HoldingRow';
import { HoldingSortKey, sortHoldings } from '../../utils/portfolioUi';

const SORT_OPTIONS: { key: HoldingSortKey; label: string }[] = [
  { key: 'value', label: 'Value' },
  { key: 'change', label: 'Day %' },
  { key: 'name', label: 'Name' },
  { key: 'qty', label: 'Qty' },
];

export default function PortfolioHoldingsScreen() {
  const router = useRouter();
  const { holdings, summary, isRefreshing, refreshPortfolio } = usePortfolio();
  const [sortKey, setSortKey] = useState<HoldingSortKey>('value');

  const sorted = useMemo(() => sortHoldings(holdings, sortKey), [holdings, sortKey]);

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Holdings</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshPortfolio}
            tintColor="#FF8A00"
            colors={['#FF8A00']}
          />
        }
      >
        <View className="bg-[#111214] rounded-xl p-3 mb-4 border border-[#2A2B2F] flex-row justify-between">
          <View>
            <Text className="text-[#9CA3AF] text-[10px]">Total Value</Text>
            <Text className="text-white font-bold text-base">Rs {formatPortfolioRs(summary.totalValue)}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[#9CA3AF] text-[10px]">Stocks</Text>
            <Text className="text-white font-bold text-base">{holdings.length}</Text>
          </View>
        </View>

        {holdings.length > 0 && (
          <View className="flex-row gap-2 mb-4">
            {SORT_OPTIONS.map((opt) => {
              const active = sortKey === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setSortKey(opt.key)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? 'bg-[#FF8A00] border-[#FF8A00]' : 'bg-[#18191C] border-[#2A2B2F]'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-semibold ${active ? 'text-black' : 'text-[#9CA3AF]'}`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {holdings.length === 0 ? (
          <HoldingsEmptyState onBrowse={() => router.push('/(tabs)/trade')} />
        ) : (
          <>
            <View className="flex-row items-center mb-3 px-1">
              <View className="flex-[1.2] ml-10">
                <Text className="text-[#9CA3AF] text-[10px] font-semibold">Stock</Text>
              </View>
              <View className="flex-[0.8] items-end">
                <Text className="text-[#9CA3AF] text-[10px] font-semibold">Qty</Text>
              </View>
              <View className="flex-[1.2] items-end">
                <Text className="text-[#9CA3AF] text-[10px] font-semibold">Value</Text>
              </View>
              <View className="flex-[1.1] items-end">
                <Text className="text-[#9CA3AF] text-[10px] font-semibold">Day Change</Text>
              </View>
            </View>

            {sorted.map((holding) => (
              <HoldingRow
                key={holding.symbol}
                holding={holding}
                onPress={() => router.push(`/portfolio/holding/${holding.symbol}`)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
