import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../../context/PortfolioContext';
import { useTheme } from '../../../context/ThemeContext';
import { formatPortfolioRs } from '../../../data/mockPortfolio';
import { safeBack } from '../../../utils/navigation';

function StatRow({ label, value, valueClass = 'text-app-text' }: { label: string; value: string; valueClass?: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-app-border">
      <Text className="text-app-muted text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );
}

export default function PortfolioHoldingDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { getHolding, getStockBySymbol } = usePortfolio();

  const holding = getHolding(symbol ?? '');
  const stock = getStockBySymbol(symbol ?? '');

  if (!holding) {
    return (
      <SafeAreaView className="flex-1 bg-app-bg justify-center items-center px-6">
        <Text className="text-app-text text-lg font-bold mb-2">No position in {symbol}</Text>
        <Text className="text-app-muted text-sm text-center mb-6">
          You don't hold this stock right now. Buy it from the Trade tab.
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/spot/${symbol}`)}
          className="bg-[#FF8A00] rounded-full px-6 py-3 mb-3"
        >
          <Text className="text-black font-bold">Buy {symbol}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => safeBack(router, '/portfolio/holdings')}>
          <Text className="text-app-muted">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const livePrice = stock?.price ?? holding.avgCost;
  const costBasis = holding.qty * holding.avgCost;
  const unrealizedPnl = holding.currentValue - costBasis;
  const unrealizedPct = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;
  const isUp = unrealizedPnl >= 0;
  const pnlColor = isUp ? 'text-[#0ECB81]' : 'text-[#F6465D]';

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="flex-row items-center px-4 py-3 border-b border-app-border">
        <TouchableOpacity onPress={() => safeBack(router, '/portfolio/holdings')} className="w-10">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-app-text text-lg font-bold mr-10">{holding.symbol}</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="w-14 h-14 rounded-full bg-[#0ECB81]/10 items-center justify-center mb-3">
            <Text className="text-[#0ECB81] font-bold text-xl">{holding.symbol.charAt(0)}</Text>
          </View>
          <Text className="text-app-text text-2xl font-bold">{holding.symbol}</Text>
          <Text className="text-app-muted text-sm mt-1">{holding.name}</Text>
        </View>

        <View className="bg-app-card rounded-2xl p-4 mb-4 border border-app-border">
          <Text className="text-app-muted text-xs mb-1">Current Value</Text>
          <Text className="text-app-text text-2xl font-bold mb-2">
            Rs {formatPortfolioRs(holding.currentValue)}
          </Text>
          <Text className={`text-sm font-bold ${pnlColor}`}>
            {isUp ? '+' : ''}Rs {formatPortfolioRs(unrealizedPnl)} ({unrealizedPct.toFixed(2)}%) unrealized
          </Text>
        </View>

        <View className="bg-app-card rounded-2xl p-4 mb-6 border border-app-border">
          <StatRow label="Shares held" value={holding.qty.toLocaleString()} />
          <StatRow label="Avg cost" value={`Rs ${formatPortfolioRs(holding.avgCost)}`} />
          <StatRow label="Market price" value={`Rs ${formatPortfolioRs(livePrice)}`} />
          <StatRow label="Cost basis" value={`Rs ${formatPortfolioRs(costBasis)}`} />
          <StatRow
            label="Day change"
            value={`${holding.dayChange >= 0 ? '+' : ''}Rs ${formatPortfolioRs(holding.dayChange)} (${holding.dayChangePct.toFixed(2)}%)`}
            valueClass={holding.dayChange >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/spot/${holding.symbol}`)}
          className="bg-[#FF8A00] rounded-xl py-4 items-center mb-3"
        >
          <Text className="text-black font-bold text-base">Trade {holding.symbol}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/stock/${holding.symbol}`)}
          className="bg-app-card border border-app-border rounded-xl py-4 items-center mb-3"
        >
          <Text className="text-app-text font-semibold">View Stock Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/portfolio')}
          className="py-3 items-center mb-8"
        >
          <Text className="text-[#FF8A00] font-semibold">Back to Portfolio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
