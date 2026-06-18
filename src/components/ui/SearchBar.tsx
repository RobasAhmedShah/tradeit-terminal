import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MOCK_MARKET_STOCKS, Stock } from '../../data/mockStocks';
import { FuturesContract, formatFuturesPrice } from '../../data/mockFutures';
import { useFutures } from '../../context/FuturesContext';

const POPULAR_STOCKS = ['FANM', 'IDSM', 'AABS', 'SAZEW'];
const POPULAR_FUTURES = ['KSE100-PERP', 'KSE30-PERP'];

type SearchResult =
  | { type: 'stock'; id: string; stock: Stock }
  | { type: 'futures'; id: string; contract: FuturesContract };

export const SearchBar = () => {
  const router = useRouter();
  const { contracts } = useFutures();
  const inputRef = useRef<TextInput>(null);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo((): SearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const stocks = MOCK_MARKET_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    )
      .slice(0, 6)
      .map((stock) => ({ type: 'stock' as const, id: `stock-${stock.id}`, stock }));

    const futures = contracts
      .filter(
        (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((contract) => ({ type: 'futures' as const, id: `fut-${contract.symbol}`, contract }));

    return [...futures, ...stocks];
  }, [query, contracts]);

  const open = () => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const close = () => {
    setVisible(false);
    setQuery('');
  };

  const handleSelectStock = (symbol: string) => {
    close();
    router.push(`/stock/${symbol}`);
  };

  const handleSelectFutures = (symbol: string) => {
    close();
    router.push({ pathname: '/(tabs)/futures', params: { contract: symbol } });
  };

  const renderResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'futures') {
      const { contract } = item;
      return (
        <TouchableOpacity
          onPress={() => handleSelectFutures(contract.symbol)}
          className="flex-row items-center px-4 py-3.5 border-b border-[#141414]"
        >
          <View className="w-9 h-9 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-3 border border-[#FF8A00]/30">
            <Ionicons name="pulse" size={16} color="#FF8A00" />
          </View>
          <View className="flex-1 mr-2">
            <View className="flex-row items-center">
              <Text className="text-white font-bold">{contract.symbol}</Text>
              <View className="ml-2 bg-[#FF8A00]/20 px-1.5 py-0.5 rounded">
                <Text className="text-[#FF8A00] text-[9px] font-bold">FUTURES</Text>
              </View>
            </View>
            <Text className="text-[#555] text-xs" numberOfLines={1}>
              {contract.name} · {contract.expiry}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white text-sm font-semibold">
              {formatFuturesPrice(contract.markPrice)}
            </Text>
            <Text
              className={`text-xs ${contract.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
            >
              {contract.isPositive ? '+' : ''}
              {contract.changePercent.toFixed(2)}%
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#555" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      );
    }

    const { stock } = item;
    return (
      <TouchableOpacity
        onPress={() => handleSelectStock(stock.symbol)}
        className="flex-row items-center px-4 py-3.5 border-b border-[#141414]"
      >
        <View className="w-9 h-9 rounded-full bg-[#18191C] items-center justify-center mr-3 border border-[#2A2B2F]">
          <Text className="text-[#FF8A00] text-xs font-bold">{stock.symbol.charAt(0)}</Text>
        </View>
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold">{stock.symbol}</Text>
          <Text className="text-[#555] text-xs" numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-white text-sm font-semibold">Rs {stock.price.toFixed(2)}</Text>
          <Text className={`text-xs ${stock.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
            {stock.isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={open}
        activeOpacity={0.8}
        className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-2xl px-4 py-2.5 mx-4 my-2"
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <Text className="flex-1 text-[#9CA3AF] ml-2 text-base">Search stocks, futures...</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={close}>
        <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
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

          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={renderResult}
            />
          ) : query.length > 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Ionicons name="search-outline" size={40} color="#2A2B2F" />
              <Text className="text-[#555] mt-3 text-center">No results for "{query}"</Text>
              <Text className="text-[#444] text-xs mt-1 text-center">
                Try KSE100-PERP, OGDC, or a stock symbol
              </Text>
            </View>
          ) : (
            <View className="px-4 mt-1">
              <Text className="text-[#555] text-xs font-semibold mb-3 tracking-widest">
                POPULAR FUTURES
              </Text>
              {POPULAR_FUTURES.map((sym) => {
                const contract = contracts.find((c) => c.symbol === sym);
                if (!contract) return null;
                return (
                  <TouchableOpacity
                    key={sym}
                    onPress={() => handleSelectFutures(sym)}
                    className="flex-row items-center py-3 border-b border-[#141414]"
                  >
                    <View className="w-7 h-7 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-3">
                      <Ionicons name="pulse" size={14} color="#FF8A00" />
                    </View>
                    <Text className="text-white font-semibold mr-2">{sym}</Text>
                    <Text className="text-[#555] text-xs flex-1" numberOfLines={1}>
                      {contract.name}
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${contract.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
                    >
                      {contract.isPositive ? '+' : ''}
                      {contract.changePercent.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <Text className="text-[#555] text-xs font-semibold mb-3 mt-4 tracking-widest">
                POPULAR STOCKS
              </Text>
              {POPULAR_STOCKS.map((sym) => {
                const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === sym);
                if (!stock) return null;
                return (
                  <TouchableOpacity
                    key={sym}
                    onPress={() => handleSelectStock(sym)}
                    className="flex-row items-center py-3 border-b border-[#141414]"
                  >
                    <View className="w-7 h-7 rounded-full bg-[#1A0E00] items-center justify-center mr-3">
                      <Ionicons name="trending-up-outline" size={14} color="#FF8A00" />
                    </View>
                    <Text className="text-white font-semibold mr-2">{sym}</Text>
                    <Text className="text-[#555] text-xs flex-1" numberOfLines={1}>
                      {stock.name}
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${stock.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
                    >
                      {stock.isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
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
