import { useTheme } from './ThemeContext';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MOCK_MARKET_STOCKS, Stock } from '../data/mockStocks';
import { FuturesContract, formatFuturesPrice } from '../data/mockFutures';
import { useFutures } from './FuturesContext';
import { StockLogo } from '../components/ui/StockLogo';

const POPULAR_STOCKS = ['FANM', 'IDSM', 'AABS', 'SAZEW'];
const POPULAR_FUTURES = ['KSE100-PERP', 'KSE30-PERP'];

type SearchResult =
  | { type: 'stock'; id: string; stock: Stock }
  | { type: 'futures'; id: string; contract: FuturesContract };

interface SearchContextType {
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType>({
  openSearch: () => {},
  closeSearch: () => {},
});

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
      .filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((contract) => ({ type: 'futures' as const, id: `fut-${contract.symbol}`, contract }));

    return [...futures, ...stocks];
  }, [query, contracts]);

  const openSearch = useCallback(() => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const closeSearch = useCallback(() => {
    setVisible(false);
    setQuery('');
  }, []);

  const handleSelectStock = (symbol: string) => {
    closeSearch();
    router.push(`/stock/${symbol}`);
  };

  const handleSelectFutures = (symbol: string) => {
    closeSearch();
    router.push({ pathname: '/(tabs)/futures', params: { contract: symbol } });
  };

  const renderResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'futures') {
      const { contract } = item;
      return (
        <TouchableOpacity
          onPress={() => handleSelectFutures(contract.symbol)}
          className="flex-row items-center px-4 py-3.5 border-b border-app-border"
        >
          <View className="w-9 h-9 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-3 border border-[#FF8A00]/30">
            <Ionicons name="pulse" size={16} color="#FF8A00" />
          </View>
          <View className="flex-1 mr-2">
            <View className="flex-row items-center">
              <Text className="text-app-text font-bold">{contract.symbol}</Text>
              <View className="ml-2 bg-[#FF8A00]/20 px-1.5 py-0.5 rounded">
                <Text className="text-[#FF8A00] text-[9px] font-bold">FUTURES</Text>
              </View>
            </View>
            <Text className="text-app-muted text-xs" numberOfLines={1}>
              {contract.name} · {contract.expiry}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-app-text text-sm font-semibold">{formatFuturesPrice(contract.markPrice)}</Text>
            <Text className={`text-xs ${contract.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              {contract.isPositive ? '+' : ''}
              {contract.changePercent.toFixed(2)}%
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.muted} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      );
    }

    const { stock } = item;
    return (
      <TouchableOpacity
        onPress={() => handleSelectStock(stock.symbol)}
        className="flex-row items-center px-4 py-3.5 border-b border-app-border"
      >
        <View className="mr-3">
          <StockLogo
            symbol={stock.symbol}
            logoUrl={stock.logoUrl}
            logoColor={stock.logoColor}
            website={stock.website}
            size={36}
          />
        </View>
        <View className="flex-1 mr-2">
          <Text className="text-app-text font-bold">{stock.symbol}</Text>
          <Text className="text-app-muted text-xs" numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-app-text text-sm font-semibold">Rs {stock.price.toFixed(2)}</Text>
          <Text className={`text-xs ${stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {stock.isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={closeSearch}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/* Full-width search header */}
            <View
              className="flex-row items-center px-4 border-b border-app-border"
              style={{
                backgroundColor: colors.card,
                paddingTop: 8,
                paddingBottom: 12,
              }}
            >
              <View
                className="flex-1 flex-row items-center rounded-xl px-3 py-2.5 mr-3"
                style={{ backgroundColor: colors.inputMuted, borderWidth: 1, borderColor: colors.border }}
              >
                <Ionicons name="search" size={20} color={colors.primary} />
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search stocks, futures..."
                  placeholderTextColor={colors.mutedDarker}
                  style={{ flex: 1, color: colors.text, fontSize: 16, marginLeft: 8, paddingVertical: 0 }}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="characters"
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors.muted} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={closeSearch} hitSlop={8}>
                <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}
                renderItem={renderResult}
              />
            ) : query.length > 0 ? (
              <View className="flex-1 items-center justify-center px-8">
                <Ionicons name="search-outline" size={40} color={colors.border} />
                <Text className="text-app-muted mt-3 text-center">No results for "{query}"</Text>
                <Text className="text-app-muted text-xs mt-1 text-center">
                  Try KSE100-PERP, OGDC, or a stock symbol
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: 16,
                  paddingBottom: Math.max(insets.bottom, 24),
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text className="text-app-muted text-xs font-semibold mb-3 tracking-widest">POPULAR FUTURES</Text>
                {POPULAR_FUTURES.map((sym) => {
                  const contract = contracts.find((c) => c.symbol === sym);
                  if (!contract) return null;
                  return (
                    <TouchableOpacity
                      key={sym}
                      onPress={() => handleSelectFutures(sym)}
                      className="flex-row items-center py-3 border-b border-app-border"
                    >
                      <View className="w-7 h-7 rounded-full bg-[#FF8A00]/15 items-center justify-center mr-3">
                        <Ionicons name="pulse" size={14} color="#FF8A00" />
                      </View>
                      <Text className="text-app-text font-semibold mr-2">{sym}</Text>
                      <Text className="text-app-muted text-xs flex-1" numberOfLines={1}>
                        {contract.name}
                      </Text>
                      <Text
                        className={`text-xs font-semibold ${contract.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
                      >
                        {contract.isPositive ? '+' : ''}
                        {contract.changePercent.toFixed(2)}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <Text className="text-app-muted text-xs font-semibold mb-3 mt-4 tracking-widest">POPULAR STOCKS</Text>
                {POPULAR_STOCKS.map((sym) => {
                  const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === sym);
                  if (!stock) return null;
                  return (
                    <TouchableOpacity
                      key={sym}
                      onPress={() => handleSelectStock(sym)}
                      className="flex-row items-center py-3 border-b border-app-border"
                    >
                      <View
                        className="w-7 h-7 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryTint }}
                      >
                        <Ionicons name="trending-up-outline" size={14} color="#FF8A00" />
                      </View>
                      <Text className="text-app-text font-semibold mr-2">{sym}</Text>
                      <Text className="text-app-muted text-xs flex-1" numberOfLines={1}>
                        {stock.name}
                      </Text>
                      <Text
                        className={`text-xs font-semibold ${stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
                      >
                        {stock.isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
