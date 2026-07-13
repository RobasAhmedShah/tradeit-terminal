import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../types';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

interface MarketSelectorSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (stock: Stock) => void;
}

export const MarketSelectorSheet: React.FC<MarketSelectorSheetProps> = ({ visible, onClose, onSelect }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredStocks = MOCK_MARKET_STOCKS.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
        
        <View className="bg-app-card rounded-t-2xl h-[80%] border-t border-app-border">
          
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-app-border">
            <View className="w-6" />
            <Text className="text-app-text text-base font-bold">Market</Text>
            <TouchableOpacity onPress={onClose} className="w-6 items-end">
              <Ionicons name="close" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="px-4 py-3">
            <View className="flex-row items-center bg-app-card-soft border border-app-border rounded-lg px-3 py-2">
              <Ionicons name="search" size={16} color={colors.muted} />
              <TextInput 
                placeholder="Search symbol"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-app-text text-sm ml-2"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row px-4 mb-2">
            {['All', 'Favorites', 'Gainers'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                className="mr-4 pb-2"
              >
                <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-[#FF8A00]' : 'text-app-muted'}`}>
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8A00]" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Table Header */}
          <View className="flex-row justify-between px-4 py-2 border-b border-app-border">
            <View className="flex-row items-center">
              <Text className="text-app-muted text-xs">Symbols</Text>
              <Ionicons name="swap-vertical" size={10} color={colors.muted} style={{ marginLeft: 4 }} />
              <Text className="text-app-muted text-xs ml-1">/ Vol</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-app-muted text-xs">Last Price</Text>
              <Ionicons name="swap-vertical" size={10} color={colors.muted} style={{ marginLeft: 4, marginRight: 8 }} />
              <Text className="text-app-muted text-xs">/ 24h Chg</Text>
            </View>
          </View>

          {/* List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {filteredStocks.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => onSelect(item)}
                className="flex-row justify-between items-center px-4 py-3 border-b border-app-border/50"
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons name="star-outline" size={16} color={colors.muted} style={{ marginRight: 8 }} />
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-app-text font-bold text-sm mr-2">{item.symbol}</Text>
                      <View className="bg-app-card-soft px-1 py-0.5 rounded border border-app-border">
                        <Text className="text-app-muted text-[8px]">Spot</Text>
                      </View>
                    </View>
                    <Text className="text-app-muted text-xs mt-0.5">{item.avgVolume || '1.2M'}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-app-text font-bold text-sm mb-0.5">{item.price.toFixed(2)}</Text>
                  <Text className={`text-xs font-semibold ${item.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {item.isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View className="h-8" />
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};
