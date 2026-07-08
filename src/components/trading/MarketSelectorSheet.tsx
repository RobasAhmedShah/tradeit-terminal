import React, { useState } from 'react';
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
        
        <View className="bg-[#111214] rounded-t-2xl h-[80%] border-t border-[#2A2B2F]">
          
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-[#2A2B2F]">
            <View className="w-6" />
            <Text className="text-white text-base font-bold">Market</Text>
            <TouchableOpacity onPress={onClose} className="w-6 items-end">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="px-4 py-3">
            <View className="flex-row items-center bg-[#18191C] border border-[#2A2B2F] rounded-lg px-3 py-2">
              <Ionicons name="search" size={16} color="#9CA3AF" />
              <TextInput 
                placeholder="Search symbol"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-white text-sm ml-2"
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
                <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8A00]" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Table Header */}
          <View className="flex-row justify-between px-4 py-2 border-b border-[#2A2B2F]">
            <View className="flex-row items-center">
              <Text className="text-[#9CA3AF] text-xs">Symbols</Text>
              <Ionicons name="swap-vertical" size={10} color="#9CA3AF" style={{ marginLeft: 4 }} />
              <Text className="text-[#9CA3AF] text-xs ml-1">/ Vol</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-[#9CA3AF] text-xs">Last Price</Text>
              <Ionicons name="swap-vertical" size={10} color="#9CA3AF" style={{ marginLeft: 4, marginRight: 8 }} />
              <Text className="text-[#9CA3AF] text-xs">/ 24h Chg</Text>
            </View>
          </View>

          {/* List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {filteredStocks.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => onSelect(item)}
                className="flex-row justify-between items-center px-4 py-3 border-b border-[#2A2B2F]/50"
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons name="star-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-white font-bold text-sm mr-2">{item.symbol}</Text>
                      <View className="bg-[#18191C] px-1 py-0.5 rounded border border-[#2A2B2F]">
                        <Text className="text-[#9CA3AF] text-[8px]">Spot</Text>
                      </View>
                    </View>
                    <Text className="text-[#9CA3AF] text-xs mt-0.5">{item.avgVolume || '1.2M'}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-white font-bold text-sm mb-0.5">{item.price.toFixed(2)}</Text>
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
