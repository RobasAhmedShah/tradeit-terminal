import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MOCK_MARKET_STOCKS, Stock } from '../../data/mockStocks';

const POPULAR = ['FANM', 'IDSM', 'AABS', 'SAZEW'];

export const SearchBar = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const results: Stock[] = query.trim().length > 0
    ? MOCK_MARKET_STOCKS.filter(
        s =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  const open = () => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const close = () => {
    setVisible(false);
    setQuery('');
  };

  const handleSelect = (symbol: string) => {
    close();
    router.push(`/stock/${symbol}`);
  };

  return (
    <>
      {/* Tappable trigger bar */}
      <TouchableOpacity
        onPress={open}
        activeOpacity={0.8}
        className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-2xl px-4 py-2.5 mx-4 my-2"
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <Text className="flex-1 text-[#9CA3AF] ml-2 text-base">Search stocks, futures...</Text>
      </TouchableOpacity>

      {/* Full-screen search modal */}
      <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={close}>
        <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
          {/* Search input row */}
          <View className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-2xl px-4 py-2.5 mx-4 mt-2 mb-3">
            <Ionicons name="search" size={20} color="#FF8A00" />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search stocks, futures..."
              placeholderTextColor="#555"
              className="flex-1 text-white ml-2 text-base"
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="characters"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} className="mr-2">
                <Ionicons name="close-circle" size={18} color="#555" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={close}>
              <Text className="text-[#FF8A00] font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search results */}
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.symbol)}
                  className="flex-row items-center px-4 py-3 border-b border-[#141414]"
                >
                  <View className="w-9 h-9 rounded-full bg-[#18191C] items-center justify-center mr-3 border border-[#2A2B2F]">
                    <Text className="text-[#FF8A00] text-xs font-bold">{item.symbol.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="text-white font-bold">{item.symbol}</Text>
                    <Text className="text-[#555] text-xs" numberOfLines={1}>{item.name}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white text-sm font-semibold">Rs {item.price.toFixed(2)}</Text>
                    <Text className={`text-xs ${item.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                      {item.isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : query.length > 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="search-outline" size={40} color="#2A2B2F" />
              <Text className="text-[#555] mt-3">No results for "{query}"</Text>
            </View>
          ) : (
            /* Popular searches shown when query is empty */
            <View className="px-4 mt-1">
              <Text className="text-[#555] text-xs font-semibold mb-3 tracking-widest">POPULAR</Text>
              {POPULAR.map(sym => {
                const stock = MOCK_MARKET_STOCKS.find(s => s.symbol === sym);
                if (!stock) return null;
                return (
                  <TouchableOpacity
                    key={sym}
                    onPress={() => handleSelect(sym)}
                    className="flex-row items-center py-3 border-b border-[#141414]"
                  >
                    <View className="w-7 h-7 rounded-full bg-[#1A0E00] items-center justify-center mr-3">
                      <Ionicons name="trending-up-outline" size={14} color="#FF8A00" />
                    </View>
                    <Text className="text-white font-semibold mr-2">{sym}</Text>
                    <Text className="text-[#555] text-xs flex-1" numberOfLines={1}>{stock.name}</Text>
                    <Text className={`text-xs font-semibold ${stock.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                      {stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};
