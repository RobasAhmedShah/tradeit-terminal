import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export const STOCK_DETAIL_TABS = [
  'Overview',
  'Financials',
  'News',
  'Analysis',
] as const;

export type StockDetailTab = (typeof STOCK_DETAIL_TABS)[number];

interface StockDetailTabsProps {
  activeTab: StockDetailTab;
  onTabChange: (tab: StockDetailTab) => void;
}

export const StockDetailTabs: React.FC<StockDetailTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="border-b border-[#2A2B2F] bg-[#050505]">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {STOCK_DETAIL_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onTabChange(tab)}
              className={`py-3.5 mr-6 border-b-2 ${isActive ? 'border-[#FF8A00]' : 'border-transparent'}`}
            >
              <Text
                className={`text-[13px] font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
