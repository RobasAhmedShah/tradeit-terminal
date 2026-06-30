import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { useWatchlist } from '../../context/WatchlistContext';
import { useMarketStock } from '../../context/MarketPricesContext';
import { useAlertSheet } from '../../context/AlertSheetContext';
import { StockDetailHeader } from '../../components/stock/StockDetailHeader';
import { StockPriceHeader } from '../../components/stock/StockPriceHeader';
import { StockLineChartPlaceholder } from '../../components/charts/StockLineChartPlaceholder';
import { StockTimeframeTabs } from '../../components/stock/StockTimeframeTabs';
import { StockStatsGrid } from '../../components/stock/StockStatsGrid';
import { StockDetailTabs, StockDetailTab } from '../../components/stock/StockDetailTabs';
import { StockOverviewCards } from '../../components/stock/StockOverviewCards';
import { StockNewsList } from '../../components/stock/StockNewsList';
import { StockStickyActions } from '../../components/stock/StockStickyActions';
import { StockFinancialsTab } from '../../components/stock/StockFinancialsTab';
import { StockAnalysisTab } from '../../components/stock/StockAnalysisTab';

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const { openAlert } = useAlertSheet();

  const [activeTab, setActiveTab] = useState<StockDetailTab>('Overview');

  const staticStock = MOCK_MARKET_STOCKS.find((s) => s.symbol === symbol);
  const liveStock = useMarketStock(symbol);
  const stock = liveStock ?? staticStock;

  if (!stock) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Stock not found.</Text>
      </SafeAreaView>
    );
  }

  const handleTradePress = () => {
    router.push(`/spot/${symbol}`);
  };

  const handleWatchlistPress = () => {
    toggleWatchlist(stock);
  };

  const handleAlertPress = () => {
    openAlert(stock.symbol);
  };

  const showChartSection = activeTab === 'Overview';

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <StockDetailHeader
        symbol={stock.symbol}
        name={stock.name}
        isWatchlisted={isWatchlisted(stock.symbol)}
        onWatchlistPress={handleWatchlistPress}
        onAlertPress={handleAlertPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <StockPriceHeader stock={stock} />

        {showChartSection && (
          <>
            <StockLineChartPlaceholder stock={stock} />
            <StockTimeframeTabs />
            <StockStatsGrid stock={stock} />
          </>
        )}

        <StockDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'Overview' && (
          <>
            <StockOverviewCards stock={stock} />
            <StockNewsList stock={stock} />
          </>
        )}

        {activeTab === 'Financials' && <StockFinancialsTab stock={stock} />}

        {activeTab === 'News' && (
          <View className="mt-4">
            <StockNewsList stock={stock} />
          </View>
        )}

        {activeTab === 'Analysis' && <StockAnalysisTab stock={stock} />}
      </ScrollView>

      <StockStickyActions
        onTradePress={handleTradePress}
        onWatchlistPress={handleWatchlistPress}
        onAlertPress={handleAlertPress}
        isWatchlisted={isWatchlisted(stock.symbol)}
      />
    </SafeAreaView>
  );
}
