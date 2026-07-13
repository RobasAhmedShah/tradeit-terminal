import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const TABS = ['Overview', 'Financials', 'News', 'Analysis'];

interface DetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="border-b border-app-border mt-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => onTabChange(tab)}
            className={`py-3 mr-6 ${activeTab === tab ? 'border-b-2 border-[#FF8A00]' : 'border-b-2 border-transparent'}`}
          >
            <Text className={`${activeTab === tab ? 'text-app-text font-bold' : 'text-app-muted'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
