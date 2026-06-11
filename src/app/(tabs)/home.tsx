import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/ui/AppHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { PortfolioValueCard } from '../../components/ui/PortfolioValueCard';
import { QuickActionGrid } from '../../components/ui/QuickActionGrid';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StockMiniCard } from '../../components/ui/StockMiniCard';
import { MarketMoverChip } from '../../components/ui/MarketMoverChip';
import { NewsCard } from '../../components/ui/NewsCard';
import { MOCK_WATCHLIST, MOCK_TOP_GAINERS, MOCK_TOP_LOSERS } from '../../data/mockStocks';
import { MOCK_NEWS } from '../../data/mockNews';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SearchBar />
        <PortfolioValueCard />
        <QuickActionGrid />

        <SectionHeader title="Watchlist" subtitle="People Also Own" />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="pl-4 pb-2"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {MOCK_WATCHLIST.map((stock) => (
            <StockMiniCard key={stock.id} stock={stock} />
          ))}
        </ScrollView>

        <View className="flex-row mx-4 mt-6 mb-3">
          <View className="flex-1 mr-2">
            <Text className="text-white text-base font-bold mb-3">Top Gainers</Text>
            <View>
              {MOCK_TOP_GAINERS.map((stock) => (
                <MarketMoverChip key={stock.id} stock={stock} />
              ))}
            </View>
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-white text-base font-bold mb-3">Top Losers</Text>
            <View>
              {MOCK_TOP_LOSERS.map((stock) => (
                <MarketMoverChip key={stock.id} stock={stock} />
              ))}
            </View>
          </View>
        </View>

        <SectionHeader title="Latest News" />
        {MOCK_NEWS.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
        
        <View className="h-20" /> {/* Bottom padding for tab bar */}
      </ScrollView>
    </SafeAreaView>
  );
}
