import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../data/mockStocks';
import { SparklinePlaceholder } from './SparklinePlaceholder';

interface StockRowProps {
  stock: Stock;
  onPress: () => void;
  isWatchlisted?: boolean;
  onWatchlistPress?: () => void;
}

export const StockRow: React.FC<StockRowProps> = ({
  stock,
  onPress,
  isWatchlisted = false,
  onWatchlistPress,
}) => {
  const isPositive = stock.isPositive;
  const changeColor = isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = isPositive ? '+' : '';

  return (
    <View
      className="flex-row items-center mx-4 mb-1 px-2 py-3 bg-[#111214] border border-[#2A2B2F] rounded-xl"
    >
      <TouchableOpacity onPress={onPress} className="flex-1 flex-row items-center justify-between">
        <View className="flex-[1.5] flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-[#18191C] items-center justify-center mr-2 border border-[#2A2B2F]">
            <Text className="text-white text-xs font-bold">{stock.symbol.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm" numberOfLines={1}>{stock.symbol}</Text>
            <Text className="text-[#9CA3AF] text-[10px]" numberOfLines={1}>{stock.name}</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <SparklinePlaceholder isPositive={isPositive} width={40} height={20} />
        </View>

        <View className="flex-[0.8] items-end justify-center pr-2">
          <Text className="text-white font-bold text-sm">{stock.price.toFixed(2)}</Text>
        </View>

        <View className="flex-[0.8] items-end justify-center pr-2">
          <Text className="text-[#0ECB81] text-[11px] font-semibold">{stock.buyPrice?.toFixed(2)}</Text>
          <Text className="text-[#F6465D] text-[11px] font-semibold mt-0.5">{stock.sellPrice?.toFixed(2)}</Text>
        </View>

        <View className="flex-[0.8] items-end justify-center">
          <Text className={`${changeColor} text-[11px] font-semibold`}>
            {sign}{stock.changePercent.toFixed(2)}%
          </Text>
          <Text className={`${changeColor} text-[11px] mt-0.5`}>
            {sign}{stock.changeValue?.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      {onWatchlistPress && (
        <TouchableOpacity
          onPress={onWatchlistPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="ml-1 p-1"
        >
          <Ionicons
            name={isWatchlisted ? 'star' : 'star-outline'}
            size={18}
            color={isWatchlisted ? '#FF8A00' : '#555'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
