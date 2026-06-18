import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/ui/AppHeader';
import { PortfolioHeroCard } from '../../components/portfolio/PortfolioHeroCard';
import { HoldingRow, HoldingsEmptyState } from '../../components/portfolio/HoldingRow';
import { FuturesPortfolioSummaryCard } from '../../components/futures/FuturesPortfolioSummaryCard';
import { useWatchlist } from '../../context/WatchlistContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { sortHoldings } from '../../utils/portfolioUi';
import { PortfolioActivityList } from '../../components/portfolio/PortfolioActivityList';

export default function PortfolioScreen() {
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const { holdings, summary, activities, isRefreshing, lastRefreshedAt, refreshPortfolio } = usePortfolio();

  const previewHoldings = useMemo(() => sortHoldings(holdings, 'value').slice(0, 3), [holdings]);
  const recentActivity = useMemo(() => activities.slice(0, 2), [activities]);
  const isPnlPositive = summary.todayPnl >= 0;

  const refreshedLabel = lastRefreshedAt
    ? `Updated ${new Date(lastRefreshedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : 'Pull down to refresh';

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader />

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
        <Text className="text-[#9CA3AF] text-[10px] text-center mt-1 mb-1">{refreshedLabel}</Text>

        <PortfolioHeroCard />

        <FuturesPortfolioSummaryCard />

        <View className="flex-row mx-4 mb-4 gap-2">
          <TouchableOpacity
            onPress={() => router.push('/deposit')}
            className="flex-1 bg-[#111214] rounded-xl p-3 flex-row items-center border border-[#2A2B2F]"
          >
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-[#18191C]">
              <Ionicons name="arrow-down-outline" size={18} color="#FF8A00" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[13px] mb-0.5">Deposit</Text>
              <Text className="text-[#9CA3AF] text-[9px]">Add funds to your account</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/withdraw')}
            className="flex-1 bg-[#111214] rounded-xl p-3 flex-row items-center border border-[#2A2B2F]"
          >
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-[#18191C]">
              <Ionicons name="arrow-up-outline" size={18} color="#FF8A00" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[13px] mb-0.5">Withdraw</Text>
              <Text className="text-[#9CA3AF] text-[9px]">Withdraw to your bank</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-4 mb-4 gap-2">
          <TouchableOpacity
            onPress={() => router.push('/deposit')}
            className="flex-1 bg-[#111214] rounded-xl p-3 border border-[#2A2B2F]"
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[#9CA3AF] text-[10px] font-semibold">Buying Power</Text>
              <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
            </View>
            <Text className="text-white font-bold text-[13px] mb-0.5">
              Rs {formatPortfolioRs(summary.buyingPower)}
            </Text>
            <Text className="text-[#9CA3AF] text-[9px]">Tap to add funds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/portfolio/holdings')}
            className="flex-1 bg-[#111214] rounded-xl p-3 border border-[#2A2B2F]"
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[#9CA3AF] text-[10px] font-semibold">Today's P/L</Text>
              <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
            </View>
            <Text
              className={`font-bold text-[12px] mb-0.5 ${isPnlPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
            >
              {isPnlPositive ? '+' : ''}Rs {formatPortfolioRs(summary.todayPnl)} ({summary.todayPnlPct}%)
            </Text>
            <Text className="text-[#9CA3AF] text-[9px]">View holdings</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-sm font-semibold">Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/portfolio/activity')}>
              <Text className="text-[#FF8A00] text-xs font-semibold">View all</Text>
            </TouchableOpacity>
          </View>

          <PortfolioActivityList items={recentActivity} compact />
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
            <Text className="text-white text-sm font-semibold">Lists / Watchlists</Text>
            <TouchableOpacity onPress={() => router.push('/watchlist')}>
              <Text className="text-[#FF8A00] text-xs font-semibold">View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/watchlist')}
            className="bg-[#111214] rounded-xl p-3 flex-row items-center border border-[#2A2B2F] mb-2"
          >
            <View className="w-8 h-8 rounded-lg bg-[#2d1f5e] items-center justify-center mr-3">
              <Ionicons name="add" size={16} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-[11px] mb-0.5">Create watchlist or screener</Text>
              <Text className="text-[#9CA3AF] text-[9px]">Track stocks your way</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/watchlist')}
            className="bg-[#111214] rounded-xl p-3 flex-row items-center border border-[#2A2B2F]"
          >
            <View className="w-8 h-8 rounded-lg bg-[#00C853]/10 items-center justify-center mr-3">
              <Ionicons name="trending-up" size={16} color="#00C853" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-[11px] mb-0.5">My Watchlist</Text>
              <Text className="text-[#9CA3AF] text-[9px]">
                {watchlist.length} stock{watchlist.length === 1 ? '' : 's'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
