import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWatchlist } from '../context/WatchlistContext';
import { Stock } from '../data/mockStocks';
import { SparklinePlaceholder } from '../components/ui/SparklinePlaceholder';

export default function WatchlistScreen() {
  const router = useRouter();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const renderItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity
      onPress={() => router.push(`/stock/${item.symbol}`)}
      className="flex-row items-center px-4 py-3.5 border-b border-[#141414]"
    >
      <View className="w-10 h-10 rounded-full bg-[#18191C] items-center justify-center mr-3 border border-[#2A2B2F]">
        <Text className="text-[#FF8A00] text-sm font-bold">{item.symbol.charAt(0)}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text className="text-white font-bold text-[14px]">{item.symbol}</Text>
        <Text className="text-[#555] text-[11px] mt-0.5" numberOfLines={1}>{item.name}</Text>
      </View>

      <View className="mx-3">
        <SparklinePlaceholder isPositive={item.isPositive} width={60} height={28} />
      </View>

      <View className="items-end mr-3">
        <Text className="text-white font-bold text-[14px]">Rs {item.price.toFixed(2)}</Text>
        <View className="flex-row items-center mt-0.5">
          <Ionicons
            name={item.isPositive ? 'caret-up' : 'caret-down'}
            size={10}
            color={item.isPositive ? '#00C853' : '#FF3B30'}
          />
          <Text className={`text-[11px] font-semibold ml-0.5 ${item.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
            {Math.abs(item.changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => toggleWatchlist(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="star" size={18} color="#FF8A00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#141414]">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Watchlist</Text>
        <TouchableOpacity className="p-2 -mr-2">
          <Ionicons name="options-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {watchlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#111214] border border-[#2A2B2F] items-center justify-center mb-5">
            <Ionicons name="star-outline" size={36} color="#2A2B2F" />
          </View>
          <Text className="text-white text-lg font-bold mb-2">No stocks added yet</Text>
          <Text className="text-[#555] text-sm text-center mb-6">
            Tap the star icon on any stock detail page to add it to your watchlist
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/trade')}
            className="bg-[#FF8A00] px-8 py-3.5 rounded-xl"
          >
            <Text className="text-black font-bold text-base">Browse Stocks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="flex-row items-center justify-between px-4 py-2.5">
            <Text className="text-[#555] text-xs">{watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Ionicons name="swap-vertical-outline" size={13} color="#FF8A00" />
              <Text className="text-[#FF8A00] text-xs">Sort</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={watchlist}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View className="h-10" />}
          />
        </>
      )}
    </SafeAreaView>
  );
}
