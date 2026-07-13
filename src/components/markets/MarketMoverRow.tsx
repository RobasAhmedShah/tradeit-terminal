import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../types';
import { SparklinePlaceholder } from '../ui/SparklinePlaceholder';
import { StockLogo } from '../ui/StockLogo';
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
      ? 'text-[#0ECB81]'
      : variant === 'loser'
        ? 'text-[#F6465D]'
        : 'text-app-muted';
  const sign = stock.isPositive ? '+' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-3 border-b border-app-border"
    >
      <View className="mr-3">
        <StockLogo
          symbol={stock.symbol}
          logoUrl={stock.logoUrl}
          logoColor={stock.logoColor}
          website={stock.website}
          size={40}
        />
      </View>

      <View className="flex-1 mr-2">
        <Text className="text-app-text font-semibold text-[13px]">{stock.symbol}</Text>
        <Text className="text-app-muted text-[11px] mt-0.5" numberOfLines={1}>
          {stock.name}
        </Text>
      </View>

      <View className="mr-3">
        <SparklinePlaceholder isPositive={stock.isPositive} width={52} height={24} />
      </View>

      <View className="items-end mr-3 min-w-[72px]">
        <Animated.Text style={{ opacity }} className="text-app-text font-semibold text-[13px]">
          Rs {stock.price.toFixed(2)}
        </Animated.Text>
        <Text className={`text-[11px] font-semibold mt-0.5 ${changeColor}`}>
          {sign}
          {stock.changePercent.toFixed(2)}%
        </Text>
      </View>

      <View className="items-end min-w-[48px]">
        <Text className="text-app-muted text-[9px] uppercase">Vol</Text>
        <Text className="text-app-muted text-[11px] font-medium">{formatVolume(stock.volume)}</Text>
      </View>
    </TouchableOpacity>
  );
}
