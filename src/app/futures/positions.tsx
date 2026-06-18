import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../context/FuturesContext';
import { FuturesHistoryItem, FuturesPortfolioTab, formatFuturesPrice } from '../../data/mockFutures';
import { FuturesPositionCard } from '../../components/futures/FuturesPositionCard';
import { FuturesOpenOrderRow } from '../../components/futures/FuturesOpenOrderRow';

const TABS: { id: FuturesPortfolioTab; label: string }[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'open_orders', label: 'Open Orders' },
  { id: 'history', label: 'History' },
];

function HistoryRow({ item }: { item: FuturesHistoryItem }) {
  const labels = {
    position_closed: 'Position Closed',
    order_filled: 'Order Filled',
    order_cancelled: 'Order Cancelled',
  };
  return (
    <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-white text-sm font-semibold">
          {item.side} {item.symbol}
        </Text>
        <Text className="text-[#9CA3AF] text-[10px]">{item.timestamp}</Text>
      </View>
      <Text className="text-[#9CA3AF] text-xs">
        {labels[item.type]} · {item.quantity} lots @ {formatFuturesPrice(item.price)}
      </Text>
      {item.realizedPnl !== undefined && (
        <Text
          className={`text-xs font-semibold mt-1 ${item.realizedPnl >= 0 ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
        >
          PnL: {item.realizedPnl >= 0 ? '+' : ''}
          {formatFuturesPrice(item.realizedPnl)}
        </Text>
      )}
    </View>
  );
}

export default function FuturesPositionsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { positions, openOrders, orderHistory, cancelOpenOrder } = useFutures();

  const initialTab: FuturesPortfolioTab =
    tab === 'open_orders' || tab === 'history' ? tab : 'positions';
  const [activeTab, setActiveTab] = useState<FuturesPortfolioTab>(initialTab);

  const handleClose = (position: (typeof positions)[0]) => {
    router.push({
      pathname: '/futures/close-review',
      params: { data: JSON.stringify(position) },
    });
  };

  const handleCancel = (order: (typeof openOrders)[0]) => {
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
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Futures Portfolio</Text>
      </View>

      <View className="flex-row px-4 pt-3 border-b border-[#2A2B2F]">
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              className={`mr-5 pb-2.5 ${isActive ? 'border-b-2 border-[#FF8A00]' : ''}`}
            >
              <Text className={`text-sm font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        {activeTab === 'positions' &&
          (positions.length === 0 ? (
            <Text className="text-[#9CA3AF] text-center mt-8">No open positions</Text>
          ) : (
            positions.map((p) => (
              <FuturesPositionCard key={p.id} position={p} onClose={handleClose} />
            ))
          ))}

        {activeTab === 'open_orders' &&
          (openOrders.length === 0 ? (
            <Text className="text-[#9CA3AF] text-center mt-8">No open orders</Text>
          ) : (
            openOrders.map((o) => <FuturesOpenOrderRow key={o.id} order={o} onCancel={handleCancel} />)
          ))}

        {activeTab === 'history' &&
          (orderHistory.length === 0 ? (
            <Text className="text-[#9CA3AF] text-center mt-8">No history yet</Text>
          ) : (
            orderHistory.map((h) => <HistoryRow key={h.id} item={h} />)
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
