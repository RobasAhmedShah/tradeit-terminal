import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const TABS = ['Overview', 'Financials', 'News', 'Analysis'];

interface StockDetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const StockDetailTabs: React.FC<StockDetailTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="border-b border-[#2A2B2F] bg-[#050505]">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              onPress={() => onTabChange(tab)}
              className={`py-4 mr-8 border-b-2 ${isActive ? 'border-[#FF8A00]' : 'border-transparent'}`}
            >
              <Text className={`font-semibold ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
