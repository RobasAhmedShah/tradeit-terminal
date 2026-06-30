import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { OrderType } from '../../data/mockOrders';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, cancelOrder } = useOrders();
  const { showAlert } = useAppAlert();

  const order = id ? getOrder(id) : undefined;

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505] justify-center items-center">
        <Text className="text-white text-lg">Order not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-2 bg-[#f97316] rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isBuy = order.side === 'BUY';
  const sideColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';
  const sideBg = isBuy ? 'bg-[#4ade80]/20 border border-[#4ade80]/30' : 'bg-[#ef4444]/20 border border-[#ef4444]/30';
  const canModify = ['Pending', 'Partially Filled', 'Queued'].includes(order.status);

  const handleModify = () => {
    router.push(`/orders/edit/${order.id}`);
  };

  const handleCancel = () => {
    showAlert(
      'Cancel Order',
      `Are you sure you want to cancel order ${order.id}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelOrder(order.id);
            router.back();
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  const Row = ({ label, value, valueClass = 'text-white' }: { label: string; value: string | number; valueClass?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-[#2a2a2a]/50">
      <Text className="text-[#666] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Order Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-xl font-bold">{order.symbol}</Text>
            <View className={`px-3 py-1 rounded-full ${sideBg}`}>
              <Text className={`${sideColor} text-xs font-bold`}>{order.side}</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[#666] text-sm flex-1 mr-2">{order.companyName}</Text>
            <Text className="text-[#9CA3AF] text-sm font-semibold">{order.type} Order</Text>
          </View>
        </View>

        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <Text className="text-white text-base font-bold mb-2">Summary</Text>
          <Row label="Order ID" value={order.id} />
          <Row label="Quantity" value={order.quantity.toLocaleString()} />
          <Row label="Filled" value={order.filledQty.toLocaleString()} valueClass="text-[#4ade80]" />
          <Row label="Remaining" value={order.remainingQty.toLocaleString()} />
          {order.type === 'Stop Limit' && order.stopPrice != null && (
            <Row label="Stop Price" value={`Rs ${order.stopPrice.toFixed(2)}`} />
          )}
          <Row
            label={order.type === 'Stop Limit' ? 'Limit Price' : 'Limit Price'}
            value={`Rs ${order.price.toFixed(2)}`}
          />
          {order.avgPrice != null && <Row label="Avg Price" value={`Rs ${order.avgPrice.toFixed(2)}`} />}
          <Row label="Status" value={order.status} />
          <Row label="Created" value={`${order.date} · ${order.createdTime}`} />
        </View>

        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <Text className="text-white text-base font-bold mb-4">Timeline</Text>
          {order.timeline.map((event, index) => (
            <View key={`${event.title}-${index}`} className="flex-row mb-4">
              <View className="items-center mr-3">
                <View className={`w-3 h-3 rounded-full ${event.isCompleted ? 'bg-[#4ade80]' : 'bg-[#333]'}`} />
                {index < order.timeline.length - 1 && <View className="w-0.5 flex-1 bg-[#333] mt-1" />}
              </View>
              <View className="flex-1">
                <Text className={`text-sm font-semibold ${event.isActive ? 'text-[#f97316]' : 'text-white'}`}>{event.title}</Text>
                {event.time ? <Text className="text-[#666] text-xs mt-0.5">{event.time}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        {canModify && (
          <View className="flex-row gap-3 mb-8">
            <TouchableOpacity onPress={handleModify} className="flex-1 py-3 rounded-xl border border-[#333] items-center">
              <Text className="text-white font-semibold">Modify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} className="flex-1 py-3 rounded-xl border border-[#333] items-center">
              <Text className="text-[#ef4444] font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
