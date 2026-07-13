import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TABS = ['Chart', 'Order Book', 'Trades', 'Info'];

interface TradingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TradingTabs: React.FC<TradingTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="border-b border-app-border bg-app-bg mt-2 px-3 flex-row justify-between">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity 
            key={tab} 
            onPress={() => onTabChange(tab)}
            className={`py-3 px-2 border-b-2 ${isActive ? 'border-[#FF8A00]' : 'border-transparent'}`}
          >
            <Text className={`text-[13px] font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-app-muted'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
