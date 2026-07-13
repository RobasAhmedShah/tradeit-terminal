import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';
import { MarketSelectorSheet } from './MarketSelectorSheet';
import { StockLogo } from '../ui/StockLogo';

interface SpotStockSummaryProps {
  stock: Stock;
}

export const SpotStockSummary: React.FC<SpotStockSummaryProps> = ({ stock }) => {
  const router = useRouter();
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  
  const changeColor = stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = stock.isPositive ? '+' : '';

  const handleSelectStock = (selectedStock: Stock) => {
    setIsSheetVisible(false);
    // Replace the current spot route with the newly selected stock
    router.replace(`/spot/${selectedStock.symbol}`);
  };

  return (
    <View className="px-3 py-2 bg-app-bg">
      {/* Identity Row */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="mr-3">
            <StockLogo
              symbol={stock.symbol}
              logoUrl={stock.logoUrl}
              logoColor={stock.logoColor}
              website={stock.website}
              size={32}
            />
          </View>
          <TouchableOpacity onPress={() => setIsSheetVisible(true)}>
            <View className="flex-row items-center">
              <Text className="text-app-text font-bold text-base mr-1">{stock.symbol}</Text>
              <Ionicons name="caret-down" size={12} color="#9CA3AF" />
            </View>
            <Text className="text-app-muted text-xs" numberOfLines={1}>
              {stock.name}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          {stock.isShariahCompliant && (
            <View className="bg-[#002211] px-2 py-1 rounded border border-[#0ECB81]/30 mr-2">
              <Text className="text-[#0ECB81] text-[10px] font-semibold">Shariah Compliant</Text>
            </View>
          )}
          <View className="bg-app-card px-2 py-1 rounded border border-app-border flex-row items-center">
            <Text className="text-app-muted text-[10px] mr-1">KSE 100</Text>
            <Text className="text-app-muted text-[8px]">▼</Text>
          </View>
        </View>
      </View>

      {/* Grid Row */}
      <View className="flex-row justify-between">
        {/* Left Side: Price */}
        <View className="flex-[1.2]">
          <View className="flex-row items-baseline mb-1">
            <Text className="text-app-text text-lg font-bold mr-1">Rs</Text>
            <Text className="text-app-text text-3xl font-bold">{stock.price.toFixed(2)}</Text>
          </View>
          <Text className={`${changeColor} text-sm font-semibold`}>
            {sign}{stock.changeValue?.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%) ↗
          </Text>
        </View>

        {/* Right Side: Grid Stats */}
        <View className="flex-1 flex-row flex-wrap justify-end">
          <View className="w-1/2 items-end mb-2">
            <Text className="text-app-muted text-[10px] mb-0.5">Day High</Text>
            <Text className="text-[#0ECB81] text-xs font-semibold">{stock.high?.toFixed(2) || '-'}</Text>
          </View>
          <View className="w-1/2 items-end mb-2 pl-2">
            <Text className="text-app-muted text-[10px] mb-0.5">Day Low</Text>
            <Text className="text-[#F6465D] text-xs font-semibold">{stock.low?.toFixed(2) || '-'}</Text>
          </View>
          <View className="w-1/2 items-end">
            <Text className="text-app-muted text-[10px] mb-0.5">Avg Vol (20D)</Text>
            <Text className="text-app-text text-xs font-semibold">{stock.avgVolume || '-'}</Text>
          </View>
          <View className="w-1/2 items-end pl-2">
            <Text className="text-app-muted text-[10px] mb-0.5">Market Cap</Text>
            <Text className="text-app-text text-xs font-semibold">{stock.marketCap || '-'}</Text>
          </View>
        </View>
      </View>
      
      <MarketSelectorSheet 
        visible={isSheetVisible} 
        onClose={() => setIsSheetVisible(false)} 
        onSelect={handleSelectStock} 
      />
    </View>
  );
};
