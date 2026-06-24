import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { useMarketStock } from '../../context/MarketPricesContext';

import { SpotTradingHeader } from '../../components/trading/SpotTradingHeader';
import { SpotStockSummary } from '../../components/trading/SpotStockSummary';
import { TradingTabs } from '../../components/trading/TradingTabs';
import { CandlestickChartPlaceholder } from '../../components/charts/CandlestickChartPlaceholder';
import { OrderBookCard } from '../../components/trading/OrderBookCard';
import { RecentTradesCard } from '../../components/trading/RecentTradesCard';
import { BuySellPanel } from '../../components/trading/BuySellPanel';
import { MarketRangeStrip } from '../../components/trading/MarketRangeStrip';
import { OrderBookTabContent } from '../../components/trading/OrderBookTabContent';
import { TradesTabContent } from '../../components/trading/TradesTabContent';
import { InfoTabContent } from '../../components/trading/InfoTabContent';
import { SpotTradeSkeleton } from '../../components/ui/ScreenSkeletons';

export default function SpotTradingScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState('Chart');
  const [bookPriceFill, setBookPriceFill] = useState<number | null>(null);
  const [selectedBookPrice, setSelectedBookPrice] = useState<number | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 350);
    return () => clearTimeout(t);
  }, [symbol]);

  const staticStock = MOCK_MARKET_STOCKS.find((s) => s.symbol === symbol);
  const liveStock = useMarketStock(symbol);
  const stock = liveStock ?? staticStock;

  const handleBookPricePress = useCallback((price: number) => {
    setSelectedBookPrice(price);
    setBookPriceFill(price);
  }, []);

  const handleBookPriceFillConsumed = useCallback(() => {
    setBookPriceFill(null);
  }, []);

  if (!stock) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Stock not found.</Text>
      </SafeAreaView>
    );
  }

  if (booting) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505]" edges={['top', 'bottom']}>
        <SpotTradingHeader />
        <SpotTradeSkeleton />
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

        {activeTab === 'Chart' && (
          <>
            <View className="mb-3 px-3">
              <CandlestickChartPlaceholder stock={stock} />
            </View>

            <View className="flex-row px-3 gap-2">
              <View style={{ flex: 0.52 }} className="gap-2">
                <OrderBookCard
                  symbol={stock.symbol}
                  stock={stock}
                  compact
                  maxRows={6}
                  selectedPrice={selectedBookPrice}
                  onPricePress={handleBookPricePress}
                />
                <RecentTradesCard symbol={stock.symbol} stock={stock} compact maxRows={6} />
              </View>

              <View style={{ flex: 0.48 }}>
                <BuySellPanel
                  symbol={stock.symbol}
                  currentPrice={stock.price}
                  bookPriceFill={bookPriceFill}
                  onBookPriceFillConsumed={handleBookPriceFillConsumed}
                />
              </View>
            </View>
          </>
        )}

        {activeTab === 'Order Book' && (
          <OrderBookTabContent
            stock={stock}
            selectedPrice={selectedBookPrice}
            onPricePress={handleBookPricePress}
          />
        )}

        {activeTab === 'Trades' && <TradesTabContent stock={stock} />}

        {activeTab === 'Info' && <InfoTabContent stock={stock} />}

        {activeTab === 'Chart' && (
          <View className="mt-4 px-3">
            <MarketRangeStrip stock={stock} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
