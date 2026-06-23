import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';

export default function OpenOrdersScreen() {
  const router = useRouter();
  const { orders, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('Open');

  const filterOrders = (tab: string) => {
    return orders.filter((o) => {
      if (tab === 'Open') return o.status === 'Pending';
      if (tab === 'Partially Filled') return o.status === 'Partially Filled';
      if (tab === 'Queued') return o.status === 'Queued';
      return false;
    });
  };

  const displayedOrders = filterOrders(activeTab);

  const handleModify = (id: string) => {
    router.push(`/orders/edit/${id}`);
  };

  const handleCancel = (id: string, symbol: string) => {
    Alert.alert('Cancel Order', `Cancel open order for ${symbol}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => cancelOrder(id),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Open Orders</Text>
        <View className="w-10" />
      </View>

      <View className="flex-row px-4 pt-4 pb-2">
        {['Open', 'Partially Filled', 'Queued'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`mr-6 pb-2 border-b-2 ${isActive ? 'border-[#f97316]' : 'border-transparent'}`}
            >
              <Text className={`font-semibold ${isActive ? 'text-white' : 'text-[#666]'}`}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {displayedOrders.length === 0 ? (
          <View className="items-center justify-center pt-20">
            <Ionicons name="document-text-outline" size={48} color="#333" />
            <Text className="text-[#666] mt-4">No {activeTab.toLowerCase()} orders.</Text>
          </View>
        ) : (
          displayedOrders.map((order) => {
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
                  </View>
                  <Text className="text-[#666] text-xs font-semibold">{order.status}</Text>
                </View>

                <Text className="text-[#9CA3AF] text-xs mb-4">
                  {order.type} Order · {order.quantity} Shares
                </Text>

                <View className="flex-row flex-wrap mb-2">
                  <View className="w-1/2 mb-3">
                    <Text className="text-[#666] text-[10px] mb-1">Price</Text>
                    <Text className="text-white text-sm font-semibold">Rs {order.price.toFixed(2)}</Text>
                  </View>
                  <View className="w-1/2 mb-3">
                    <Text className="text-[#666] text-[10px] mb-1">Created</Text>
                    <Text className="text-white text-sm font-semibold">{order.createdTime}</Text>
                  </View>
                  <View className="w-1/2">
                    <Text className="text-[#666] text-[10px] mb-1">Filled</Text>
                    <Text className="text-[#4ade80] text-sm font-semibold">
                      {order.filledQty} / {order.quantity}
                    </Text>
                  </View>
                  <View className="w-1/2">
                    <Text className="text-[#666] text-[10px] mb-1">Remaining</Text>
                    <Text className="text-white text-sm font-semibold">{order.remainingQty}</Text>
                  </View>
                </View>
                </TouchableOpacity>

                <View className="flex-row gap-3 pt-3 border-t border-[#2a2a2a]">
                  <TouchableOpacity
                    onPress={() => handleModify(order.id)}
                    className="flex-1 py-2 rounded-lg border border-[#333] items-center"
                  >
                    <Text className="text-white text-sm font-semibold">Modify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCancel(order.id, order.symbol)}
                    className="flex-1 py-2 rounded-lg border border-[#333] items-center"
                  >
                    <Text className="text-[#ef4444] text-sm font-semibold">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        <TouchableOpacity
          onPress={() => router.push('/alerts')}
          className="mx-4 mb-6 mt-2 py-3 flex-row items-center justify-center border border-[#2a2a2a] rounded-xl"
        >
          <Ionicons name="alarm-outline" size={16} color="#FF8A00" style={{ marginRight: 8 }} />
          <Text className="text-[#FF8A00] text-sm font-semibold">Manage price alerts</Text>
        </TouchableOpacity>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
