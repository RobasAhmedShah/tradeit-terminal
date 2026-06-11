import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SegmentedControlProps {
  activeTab: 'Market' | 'Screener';
  onTabChange: (tab: 'Market' | 'Screener') => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="flex-row mx-4 my-2 bg-[#111214] rounded-2xl p-1 border border-[#2A2B2F]">
      <TouchableOpacity 
        className={`flex-1 py-2 items-center rounded-xl ${activeTab === 'Market' ? 'border border-[#FF8A00]' : 'border border-transparent'}`}
        onPress={() => onTabChange('Market')}
      >
        <Text className={`font-semibold ${activeTab === 'Market' ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
          Market
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`flex-1 py-2 items-center rounded-xl ${activeTab === 'Screener' ? 'border border-[#FF8A00]' : 'border border-transparent'}`}
        onPress={() => onTabChange('Screener')}
      >
        <Text className={`font-semibold ${activeTab === 'Screener' ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
          Screener
        </Text>
      </TouchableOpacity>
    </View>
  );
};
