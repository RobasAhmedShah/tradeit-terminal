import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

// Import newly refactored components
import { StockDetailHeader } from '../../components/stock/StockDetailHeader';
import { StockPriceHeader } from '../../components/stock/StockPriceHeader';
import { StockLineChartPlaceholder } from '../../components/charts/StockLineChartPlaceholder';
import { StockTimeframeTabs } from '../../components/stock/StockTimeframeTabs';
import { StockStatsGrid } from '../../components/stock/StockStatsGrid';
import { StockDetailTabs } from '../../components/stock/StockDetailTabs';
import { StockOverviewCards } from '../../components/stock/StockOverviewCards';
import { StockNewsList } from '../../components/stock/StockNewsList';
import { StockStickyActions } from '../../components/stock/StockStickyActions';

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === symbol);

  if (!stock) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Stock not found.</Text>
      </SafeAreaView>
    );
  }

  const handleTradePress = () => {
    // Navigate to Spot Trading Phase 5 route
    router.push(`/spot/${symbol}`);
  };

  const handleWatchlistPress = () => {
    setIsWatchlisted(!isWatchlisted);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <StockDetailHeader symbol={stock.symbol} name={stock.name} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <StockPriceHeader stock={stock} />
        
        <StockLineChartPlaceholder />
        
        <StockTimeframeTabs />
        
        <StockStatsGrid stock={stock} />
        
        <StockDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'Overview' ? (
          <>
            <StockOverviewCards stock={stock} />
            <StockNewsList stock={stock} />
            {/* Bottom spacer so content is not hidden by sticky action bar */}
            <View className="h-10" />
          </>
        ) : (
          <View className="px-4 py-12 items-center justify-center pb-32">
            <Text className="text-[#9CA3AF]">Content for {activeTab} coming soon.</Text>
          </View>
        )}
      </ScrollView>

      <StockStickyActions 
        onTradePress={handleTradePress}
        onWatchlistPress={handleWatchlistPress}
        isWatchlisted={isWatchlisted}
      />
    </SafeAreaView>
  );
}
