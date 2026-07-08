import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/ui/AppHeader';
import { PortfolioHeroCard } from '../../components/portfolio/PortfolioHeroCard';
import { HoldingRow, HoldingsEmptyState } from '../../components/portfolio/HoldingRow';
import { FuturesPortfolioSummaryCard } from '../../components/futures/FuturesPortfolioSummaryCard';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { sortHoldings } from '../../utils/portfolioUi';
import { OpenOrdersBanner } from '../../components/portfolio/OpenOrdersBanner';
import { PortfolioActivityList } from '../../components/portfolio/PortfolioActivityList';
import { PortfolioSkeleton } from '../../components/ui/ScreenSkeletons';

export default function PortfolioScreen() {
  const router = useRouter();
  const { openTransfer } = useTransferSheet();
  const { holdings, recentTradeSymbols, activities, isRefreshing, lastRefreshedAt, refreshPortfolio, ready } = usePortfolio();

  const previewHoldings = useMemo(() => {
    const byValue = sortHoldings(holdings, 'value');
    const pinned = recentTradeSymbols
      .map((sym) => holdings.find((h) => h.symbol === sym))
      .filter((h): h is NonNullable<typeof h> => !!h);
    const rest = byValue.filter((h) => !recentTradeSymbols.includes(h.symbol));
    return [...pinned, ...rest].slice(0, 5);
  }, [holdings, recentTradeSymbols]);

  const recentActivity = useMemo(() => activities.slice(0, 3), [activities]);

  const refreshedLabel = lastRefreshedAt
    ? `Updated ${new Date(lastRefreshedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : 'Pull down to refresh';

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader title="Portfolio" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshPortfolio}
            tintColor="#FF8A00"
            colors={['#FF8A00']}
          />
        }
      >
        {!ready ? (
          <PortfolioSkeleton />
        ) : (
        <>
        <Text className="text-[#9CA3AF] text-[10px] text-center mt-1 mb-1">{refreshedLabel}</Text>

        <PortfolioHeroCard />

        <OpenOrdersBanner />

        <FuturesPortfolioSummaryCard />

        <View className="mx-4 mb-3">
          <View className="flex-row gap-2 mb-2">
            <TouchableOpacity
              onPress={() => router.push('/deposit')}
              className="flex-1 bg-[#111214] rounded-xl p-3.5 flex-row items-center border border-[#2A2B2F]"
            >
              <View className="w-9 h-9 rounded-lg items-center justify-center mr-3 bg-[#18191C]">
                <Ionicons name="arrow-down-outline" size={18} color="#FF8A00" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-[13px]">Deposit</Text>
                <Text className="text-[#9CA3AF] text-[10px]">Add to Spot wallet</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/withdraw')}
              className="flex-1 bg-[#111214] rounded-xl p-3.5 flex-row items-center border border-[#2A2B2F]"
            >
              <View className="w-9 h-9 rounded-lg items-center justify-center mr-3 bg-[#18191C]">
                <Ionicons name="arrow-up-outline" size={18} color="#FF8A00" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-[13px]">Withdraw</Text>
                <Text className="text-[#9CA3AF] text-[10px]">To your bank</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => openTransfer()}
            className="bg-[#111214] rounded-xl p-3.5 flex-row items-center border border-[#2A2B2F]"
          >
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3 bg-[#18191C]">
              <Ionicons name="swap-horizontal-outline" size={18} color="#FF8A00" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[13px]">Transfer</Text>
              <Text className="text-[#9CA3AF] text-[10px]">Move funds Spot ↔ Futures</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8A8D93" />
          </TouchableOpacity>
        </View>

        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-sm font-semibold">Holdings</Text>
            {holdings.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/portfolio/holdings')}>
                <Text className="text-[#FF8A00] text-xs font-semibold">View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {holdings.length === 0 ? (
            <HoldingsEmptyState onBrowse={() => router.push('/(tabs)/trade')} />
          ) : (
            <>
              <View className="flex-row items-center mb-2 px-1">
                <View className="flex-[1.2] ml-10">
                  <Text className="text-[#9CA3AF] text-[9px] font-semibold">Stock</Text>
                </View>
                <View className="flex-[0.8] items-end">
                  <Text className="text-[#9CA3AF] text-[9px] font-semibold">Qty</Text>
                </View>
                <View className="flex-[1.2] items-end">
                  <Text className="text-[#9CA3AF] text-[9px] font-semibold">Current Value</Text>
                </View>
                <View className="flex-[1.1] items-end">
                  <Text className="text-[#9CA3AF] text-[9px] font-semibold">Day Change</Text>
                </View>
                <View className="w-10 items-center ml-2">
                  <Text className="text-[#9CA3AF] text-[9px] font-semibold">Chart</Text>
                </View>
              </View>

              {previewHoldings.map((holding) => (
                <HoldingRow
                  key={holding.symbol}
                  holding={holding}
                  compact
                  onPress={() => router.push(`/portfolio/holding/${holding.symbol}`)}
                />
              ))}
            </>
          )}
        </View>

        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-sm font-semibold">Recent Activity</Text>
            {activities.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/portfolio/activity')}>
                <Text className="text-[#FF8A00] text-xs font-semibold">View all</Text>
              </TouchableOpacity>
            )}
          </View>
          <PortfolioActivityList items={recentActivity} compact />
        </View>
        </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
