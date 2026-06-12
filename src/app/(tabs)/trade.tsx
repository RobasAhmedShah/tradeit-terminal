import React, { useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/ui/AppHeader';
import { TradeSearchBar } from '../../components/ui/TradeSearchBar';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { FilterChip } from '../../components/ui/FilterChip';
import { AdvancedFilterChip } from '../../components/ui/AdvancedFilterChip';
import { MarketTableHeader } from '../../components/ui/MarketTableHeader';
import { StockRow } from '../../components/ui/StockRow';
import { FloatingActionBtn } from '../../components/ui/FloatingActionBtn';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

export default function TradeScreen() {
  const [activeTab, setActiveTab] = useState<'Market' | 'Screener'>('Market');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterChips = [
    { label: 'All', isShariah: false },
    { label: 'Shariah', isShariah: true },
    { label: 'KSE 100', isShariah: false },
    { label: 'KSE 30', isShariah: false },
    { label: 'Top Volume', isShariah: false },
    { label: 'Top Gainers', isShariah: false },
    { label: 'Top Losers', isShariah: false },
  ];

  const advancedFilters = [
    { label: 'Ranking', icon: 'bar-chart' },
    { label: 'Price' },
    { label: 'Change %' },
    { label: 'Dividend' },
    { label: 'Volume' }
  ];

  const router = useRouter();

  const handleRowPress = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  const handleTradePress = (symbol: string) => {
    router.push({ pathname: '/order-confirmation', params: { symbol, side: 'buy' } });
  };

  const renderHeader = () => (
    <View className="bg-[#050505]">
      <TradeSearchBar />
      
      <SegmentedControl 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {filterChips.map((chip) => (
            <FilterChip 
              key={chip.label}
              label={chip.label}
              isShariah={chip.isShariah}
              isActive={activeFilter === chip.label}
              onPress={() => setActiveFilter(chip.label)}
            />
          ))}
          <View className="w-4" />
        </ScrollView>
      </View>

      <View className="py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {advancedFilters.map((filter) => (
            <AdvancedFilterChip key={filter.label} label={filter.label} icon={filter.icon as any} />
          ))}
          <View className="w-4" />
        </ScrollView>
      </View>

      <MarketTableHeader />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <AppHeader />
      
      <FlatList
        data={MOCK_MARKET_STOCKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockRow 
            stock={item} 
            onPress={() => handleRowPress(item.symbol)}
            onTradePress={() => handleTradePress(item.symbol)}
          />
        )}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <FloatingActionBtn />
    </SafeAreaView>
  );
}
