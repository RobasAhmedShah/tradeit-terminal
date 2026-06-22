import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { Order } from '../../data/mockOrders';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('All');

  const filterOrders = (orders: Order[], tab: string) => {
    return orders.filter(o => {
      // Historical statuses
      const isHistorical = ['Executed', 'Cancelled', 'Rejected'].includes(o.status);
      if (!isHistorical) return false;

      if (tab === 'All') return true;
      if (tab === 'Executed') return o.status === 'Executed';
      if (tab === 'Cancelled') return o.status === 'Cancelled';
      if (tab === 'Rejected') return o.status === 'Rejected';
      return false;
    });
  };

  const displayedOrders = filterOrders(orders, activeTab);

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Order History</Text>
        <TouchableOpacity className="w-10 items-end">
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 pt-4 pb-2">
        {['All', 'Executed', 'Cancelled', 'Rejected'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`mr-5 pb-2 border-b-2 ${isActive ? 'border-[#f97316]' : 'border-transparent'}`}
            >
              <Text className={`font-semibold ${isActive ? 'text-white' : 'text-[#666]'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* History List */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {displayedOrders.length === 0 ? (
          <View className="items-center justify-center pt-20">
            <Ionicons name="document-text-outline" size={48} color="#333" />
            <Text className="text-[#666] mt-4">No {activeTab.toLowerCase()} orders.</Text>
          </View>
        ) : (
          displayedOrders.map(order => {
            const isBuy = order.side === 'BUY';
            const sideColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';
            
            let statusColor = 'text-[#666]';
            if (order.status === 'Executed') statusColor = 'text-[#4ade80]';
            if (order.status === 'Cancelled') statusColor = 'text-[#f97316]';
            if (order.status === 'Rejected') statusColor = 'text-[#ef4444]';

            return (
              <TouchableOpacity 
                key={order.id} 
                onPress={() => router.push(`/orders/${order.id}`)}
                className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-white text-base font-bold mb-1">{order.symbol}</Text>
                    <View className="flex-row items-center">
                      <Text className={`${sideColor} text-xs font-bold mr-2`}>{order.side}</Text>
                      <Text className="text-[#666] text-xs font-semibold">{order.quantity} Shares</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`text-xs font-semibold mb-1 ${statusColor}`}>{order.status}</Text>
                    <Text className="text-[#666] text-[10px]">{order.date}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t border-[#2a2a2a]/50">
                  <View>
                    <Text className="text-[#666] text-[10px] mb-0.5">{order.type} Price</Text>
                    <Text className="text-white text-sm font-semibold">Rs {order.price.toFixed(2)}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[#666] text-[10px] mb-0.5">Time</Text>
                    <Text className="text-white text-sm font-semibold">{order.createdTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
