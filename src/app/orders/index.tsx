import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { useFutures } from '../../context/FuturesContext';
import { FuturesOpenOrderRow } from '../../components/futures/FuturesOpenOrderRow';

type MarketTab = 'spot' | 'futures';

export default function OrdersHubScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { orders, cancelOrder } = useOrders();
  const { openOrders, cancelOpenOrder } = useFutures();
  const [marketTab, setMarketTab] = useState<MarketTab>('spot');

  useEffect(() => {
    if (tab === 'futures') setMarketTab('futures');
    else if (tab === 'spot') setMarketTab('spot');
  }, [tab]);

  const spotPending = useMemo(
    () => orders.filter((o) => o.status === 'Pending' || o.status === 'Partially Filled'),
    [orders]
  );

  const handleSpotCancel = (id: string, symbol: string) => {
    Alert.alert('Cancel Order', `Cancel open order for ${symbol}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelOrder(id) },
    ]);
  };

  const handleFuturesCancel = (order: (typeof openOrders)[0]) => {
    Alert.alert(
      'Cancel Order',
      `Cancel ${order.side} ${order.quantity} lots on ${order.symbol}?`,
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel Order', style: 'destructive', onPress: () => cancelOpenOrder(order) },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Orders</Text>
        <TouchableOpacity onPress={() => router.push('/orders/history')} className="w-10 items-end">
          <Ionicons name="time-outline" size={22} color="#FF8A00" />
        </TouchableOpacity>
      </View>

      <View className="flex-row px-4 pt-3 gap-2">
        {(['spot', 'futures'] as MarketTab[]).map((tab) => {
          const active = marketTab === tab;
          const count = tab === 'spot' ? spotPending.length : openOrders.length;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setMarketTab(tab)}
              className={`flex-1 py-2.5 rounded-xl border items-center flex-row justify-center ${
                active ? 'bg-[#FF8A00]/15 border-[#FF8A00]' : 'bg-[#111214] border-[#2A2B2F]'
              }`}
            >
              <Text className={`font-semibold text-sm capitalize ${active ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                {tab}
              </Text>
              {count > 0 && (
                <View className="ml-2 bg-[#FF8A00] rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center">
                  <Text className="text-black text-[10px] font-bold">{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {marketTab === 'spot' ? (
          spotPending.length === 0 ? (
            <View className="items-center pt-16">
              <Ionicons name="document-text-outline" size={48} color="#333" />
              <Text className="text-[#666] mt-4">No open spot orders</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/trade')} className="mt-4">
                <Text className="text-[#FF8A00] font-semibold">Browse stocks →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            spotPending.map((order) => {
              const isBuy = order.side === 'BUY';
              const sideColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';
              const sideBg = isBuy ? 'bg-[#4ade80]/20 border-[#4ade80]/30' : 'bg-[#ef4444]/20 border-[#ef4444]/30';

              return (
                <View key={order.id} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
                  <TouchableOpacity onPress={() => router.push(`/orders/${order.id}`)}>
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center">
                        <Text className="text-white text-base font-bold mr-2">{order.symbol}</Text>
                        <View className={`px-2 py-0.5 rounded border ${sideBg}`}>
                          <Text className={`${sideColor} text-[10px] font-bold`}>{order.side}</Text>
                        </View>
                        <View className="ml-2 px-1.5 py-0.5 rounded bg-[#FF8A00]/15">
                          <Text className="text-[#FF8A00] text-[9px] font-bold">SPOT</Text>
                        </View>
                      </View>
                      <Text className="text-[#666] text-xs font-semibold">{order.status}</Text>
                    </View>
                    <Text className="text-[#9CA3AF] text-xs mb-3">
                      {order.type}
                      {order.type === 'Stop Limit' && order.stopPrice != null
                        ? ` · stop Rs ${order.stopPrice.toFixed(2)}`
                        : ''}{' '}
                      · {order.quantity} shares @ Rs {order.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                  <View className="flex-row gap-3 pt-3 border-t border-[#2a2a2a]">
                    <TouchableOpacity
                      onPress={() => router.push(`/orders/edit/${order.id}`)}
                      className="flex-1 py-2 rounded-lg border border-[#333] items-center"
                    >
                      <Text className="text-white text-sm font-semibold">Modify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSpotCancel(order.id, order.symbol)}
                      className="flex-1 py-2 rounded-lg border border-[#333] items-center"
                    >
                      <Text className="text-[#ef4444] text-sm font-semibold">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )
        ) : openOrders.length === 0 ? (
          <View className="items-center pt-16">
            <Ionicons name="document-text-outline" size={48} color="#333" />
            <Text className="text-[#666] mt-4">No open futures orders</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/futures')} className="mt-4">
              <Text className="text-[#FF8A00] font-semibold">Trade futures →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          openOrders.map((order) => (
            <FuturesOpenOrderRow key={order.id} order={order} onCancel={handleFuturesCancel} />
          ))
        )}

        <TouchableOpacity
          onPress={() => router.push(marketTab === 'futures' ? '/futures/positions' : '/orders/history')}
          className="py-3 mb-8 items-center border border-[#2A2B2F] rounded-xl"
        >
          <Text className="text-[#FF8A00] text-sm font-semibold">
            {marketTab === 'futures' ? 'Futures positions & history' : 'Spot order history'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
