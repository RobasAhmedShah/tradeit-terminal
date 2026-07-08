import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stock } from '../../types';
import { SparklinePlaceholder } from '../ui/SparklinePlaceholder';
import { hapticLight } from '../../utils/haptics';

interface WatchlistSwipeRowProps {
  stock: Stock;
  onRemove: () => void;
  onAlert: () => void;
  pulse?: boolean;
}

export function WatchlistSwipeRow({ stock, onRemove, onAlert, pulse }: WatchlistSwipeRowProps) {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;
  const [showActions, setShowActions] = React.useState(false);

  useEffect(() => {
    if (!pulse) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0.55, duration: 120, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [stock.price, pulse, opacity]);

  const renderRight = () => (
    <View className="flex-row">
      <TouchableOpacity
        onPress={() => {
          hapticLight();
          onAlert();
        }}
        className="bg-[#18191C] w-[72px] items-center justify-center border-l border-[#2A2B2F]"
      >
        <Ionicons name="notifications-outline" size={20} color="#FF8A00" />
        <Text className="text-[#FF8A00] text-[9px] mt-1 font-semibold">Alert</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          hapticLight();
          onRemove();
        }}
        className="bg-[#200006] w-[72px] items-center justify-center"
      >
        <Ionicons name="trash-outline" size={20} color="#F6465D" />
        <Text className="text-[#F6465D] text-[9px] mt-1 font-semibold">Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Swipeable renderRightActions={renderRight} overshootRight={false}>
        <TouchableOpacity
          onPress={() => router.push(`/stock/${stock.symbol}`)}
          onLongPress={() => {
            hapticLight();
            setShowActions(true);
          }}
          delayLongPress={350}
          activeOpacity={0.7}
          className="flex-row items-center px-4 py-3.5 bg-[#050505] border-b border-[#2A2B2F]"
        >
          <View className="w-10 h-10 rounded-full bg-[#18191C] items-center justify-center mr-3 border border-[#2A2B2F]">
            <Text className="text-[#FF8A00] text-sm font-bold">{stock.symbol.charAt(0)}</Text>
          </View>

          <View className="flex-1">
            <Text className="text-white font-semibold text-[13px]">{stock.symbol}</Text>
            <Text className="text-[#5C6068] text-[11px] mt-0.5" numberOfLines={1}>
              {stock.name}
            </Text>
          </View>

          <View className="mx-3">
            <SparklinePlaceholder isPositive={stock.isPositive} width={56} height={26} />
          </View>

          <View className="items-end mr-2">
            <Animated.Text style={{ opacity }} className="text-white font-semibold text-[13px]">
              Rs {stock.price.toFixed(2)}
            </Animated.Text>
            <View className="flex-row items-center mt-0.5">
              <Ionicons
                name={stock.isPositive ? 'caret-up' : 'caret-down'}
                size={10}
                color={stock.isPositive ? '#0ECB81' : '#F6465D'}
              />
              <Text
                className={`text-[11px] font-semibold ml-0.5 ${stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
              >
                {Math.abs(stock.changePercent).toFixed(2)}%
              </Text>
            </View>
          </View>

          <Ionicons name="star" size={16} color="#FF8A00" />
        </TouchableOpacity>
      </Swipeable>

      <Modal visible={showActions} transparent animationType="fade" onRequestClose={() => setShowActions(false)}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setShowActions(false)}>
          <Pressable className="bg-[#111214] rounded-t-3xl border-t border-[#2A2B2F] px-4 pt-3 pb-10" onPress={(e) => e.stopPropagation()}>
            <View className="w-10 h-1 bg-[#2A2B2F] rounded-full self-center mb-4" />
            <Text className="text-white text-lg font-bold mb-1">{stock.symbol}</Text>
            <Text className="text-[#9CA3AF] text-xs mb-5">{stock.name}</Text>

            {[
              { label: 'Buy', icon: 'arrow-up-circle-outline' as const, route: `/spot/${stock.symbol}` },
              { label: 'Sell', icon: 'arrow-down-circle-outline' as const, route: `/spot/${stock.symbol}` },
              { label: 'Add Alert', icon: 'notifications-outline' as const, action: onAlert },
              { label: 'View Details', icon: 'open-outline' as const, route: `/stock/${stock.symbol}` },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  hapticLight();
                  setShowActions(false);
                  if (item.action) item.action();
                  else if (item.route) router.push(item.route as never);
                }}
                className="flex-row items-center py-3.5 border-b border-[#2A2B2F]"
              >
                <Ionicons name={item.icon} size={20} color="#9CA3AF" />
                <Text className="text-white font-semibold ml-3">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
