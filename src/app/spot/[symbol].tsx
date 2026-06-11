import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

// Mock Data
import { MOCK_MARKET_STOCKS, MOCK_WATCHLIST } from '../../data/mockStocks';

// Components
import { SpotTradingHeader } from '../../components/trading/SpotTradingHeader';
import { SpotStockSummary } from '../../components/trading/SpotStockSummary';
import { TradingTabs } from '../../components/trading/TradingTabs';
import { CandlestickChartPlaceholder } from '../../components/charts/CandlestickChartPlaceholder';
import { OrderBookCard } from '../../components/trading/OrderBookCard';
import { RecentTradesCard } from '../../components/trading/RecentTradesCard';
import { BuySellPanel } from '../../components/trading/BuySellPanel';
import { MarketRangeStrip } from '../../components/trading/MarketRangeStrip';

export default function SpotTradingScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState('Chart');

  // Find stock in mock data
  const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === symbol) 
             || MOCK_WATCHLIST.find((s) => s.symbol === symbol);

  if (!stock) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Stock not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top', 'bottom']}>
      <SpotTradingHeader />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3">
          <SpotStockSummary stock={stock} />
        </View>
        
        <View className="mb-2">
          <TradingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
        
        {activeTab === 'Chart' ? (
          <>
            <View className="mb-3 px-3">
              <CandlestickChartPlaceholder />
            </View>
            
            <View className="flex-row px-3 gap-2">
              {/* Left Column: Order Book & Recent Trades (52%) */}
              <View style={{ flex: 0.52 }} className="gap-2">
                <OrderBookCard symbol={stock.symbol} />
                <RecentTradesCard symbol={stock.symbol} />
              </View>

              {/* Right Column: Buy/Sell Panel (48%) */}
              <View style={{ flex: 0.48 }}>
                <BuySellPanel symbol={stock.symbol} currentPrice={stock.price} />
              </View>
            </View>
          </>
        ) : (
          <View className="px-3 py-12 items-center justify-center">
            <Text className="text-[#9CA3AF]">Content for {activeTab} coming soon.</Text>
          </View>
        )}

        {/* Bottom Strip moved inside ScrollView as a compact block */}
        <View className="mt-4 px-3">
          <MarketRangeStrip stock={stock} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
