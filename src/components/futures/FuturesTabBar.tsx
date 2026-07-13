import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FuturesTab } from '../../data/mockFutures';

const TABS: { id: FuturesTab; label: string }[] = [
  { id: 'chart', label: 'Chart' },
  { id: 'orderbook', label: 'Order Book' },
  { id: 'trades', label: 'Trades' },
  { id: 'info', label: 'Info' },
];

interface FuturesTabBarProps {
  activeTab: FuturesTab;
  onTabChange: (tab: FuturesTab) => void;
}

export const FuturesTabBar: React.FC<FuturesTabBarProps> = ({ activeTab, onTabChange }) => (
  <View className="mx-4 flex-row border-b border-app-border mb-2">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className={`flex-1 py-2.5 ${isActive ? 'border-b-2 border-[#FF8A00]' : ''}`}
        >
          <Text
            className={`text-center text-sm font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-app-muted'}`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
