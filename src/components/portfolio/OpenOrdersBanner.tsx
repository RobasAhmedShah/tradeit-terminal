import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { useFutures } from '../../context/FuturesContext';

export function OpenOrdersBanner() {
  const router = useRouter();
  const { orders } = useOrders();
  const { openOrders } = useFutures();

  const spotPending = useMemo(
    () => orders.filter((o) => o.status === 'Pending' || o.status === 'Partially Filled').length,
    [orders]
  );
  const futuresPending = openOrders.length;
  const total = spotPending + futuresPending;

  const handlePress = () => {
    const tab = futuresPending > 0 && spotPending === 0 ? 'futures' : 'spot';
    router.push({ pathname: '/orders', params: { tab, view: 'open', returnTo: 'portfolio' } });
  };

  if (total === 0) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        className="mx-4 mb-4 bg-[#111214] border border-[#2A2B2F] rounded-xl px-4 py-3 flex-row items-center"
      >
        <View className="w-9 h-9 rounded-full bg-[#18191C] items-center justify-center mr-3">
          <Ionicons name="list-outline" size={18} color="#9CA3AF" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-sm font-semibold">Open orders</Text>
          <Text className="text-[#666] text-[11px] mt-0.5">No pending spot or futures orders</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#666" />
      </TouchableOpacity>
    );
  }

  const subtitle =
    spotPending > 0 && futuresPending > 0
      ? `${spotPending} spot · ${futuresPending} futures`
      : spotPending > 0
        ? `${spotPending} spot order${spotPending === 1 ? '' : 's'} waiting to fill`
        : `${futuresPending} futures order${futuresPending === 1 ? '' : 's'} pending`;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="mx-4 mb-4 bg-[#FF8A00]/10 border border-[#FF8A00]/40 rounded-xl px-4 py-3 flex-row items-center"
    >
      <View className="w-9 h-9 rounded-full bg-[#FF8A00]/20 items-center justify-center mr-3">
        <Ionicons name="time-outline" size={18} color="#FF8A00" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-sm font-semibold">
          {total} open order{total === 1 ? '' : 's'}
        </Text>
        <Text className="text-[#9CA3AF] text-[11px] mt-0.5">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#FF8A00" />
    </TouchableOpacity>
  );
}
