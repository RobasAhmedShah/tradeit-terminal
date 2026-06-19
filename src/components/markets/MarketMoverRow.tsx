import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../types';
import { SparklinePlaceholder } from '../ui/SparklinePlaceholder';
import { formatVolume } from '../../utils/marketsHub';

interface MarketMoverRowProps {
  stock: Stock;
  variant: 'gainer' | 'loser' | 'active';
  onPress: () => void;
  pulse?: boolean;
}

export function MarketMoverRow({ stock, variant, onPress, pulse }: MarketMoverRowProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0.55, duration: 120, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [stock.price, pulse, opacity]);

  const changeColor =
    variant === 'gainer'
      ? 'text-[#00C853]'
      : variant === 'loser'
        ? 'text-[#FF3B30]'
        : 'text-[#9CA3AF]';
  const sign = stock.isPositive ? '+' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-3 border-b border-[#141414]"
    >
      <View className="w-10 h-10 rounded-full bg-[#18191C] items-center justify-center mr-3 border border-[#2A2B2F]">
        <Text className="text-white text-xs font-bold">{stock.symbol.charAt(0)}</Text>
      </View>

      <View className="flex-1 mr-2">
        <Text className="text-white font-semibold text-[13px]">{stock.symbol}</Text>
        <Text className="text-[#555] text-[11px] mt-0.5" numberOfLines={1}>
          {stock.name}
        </Text>
      </View>

      <View className="mr-3">
        <SparklinePlaceholder isPositive={stock.isPositive} width={52} height={24} />
      </View>

      <View className="items-end mr-3 min-w-[72px]">
        <Animated.Text style={{ opacity }} className="text-white font-semibold text-[13px]">
          Rs {stock.price.toFixed(2)}
        </Animated.Text>
        <Text className={`text-[11px] font-semibold mt-0.5 ${changeColor}`}>
          {sign}
          {stock.changePercent.toFixed(2)}%
        </Text>
      </View>

      <View className="items-end min-w-[48px]">
        <Text className="text-[#555] text-[9px] uppercase">Vol</Text>
        <Text className="text-[#9CA3AF] text-[11px] font-medium">{formatVolume(stock.volume)}</Text>
      </View>
    </TouchableOpacity>
  );
}
