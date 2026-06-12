import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ORDERS } from '../../data/mockOrders';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const order = MOCK_ORDERS.find(o => o.id === id);

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d0d0d] justify-center items-center">
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

  const handleModify = () => {
    Alert.alert('Modify Order', `Modify order ${id} is not implemented yet.`);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Order', `Are you sure you want to cancel order ${id}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive' }
    ]);
  };

  const Row = ({ label, value, valueClass = "text-white" }: { label: string, value: string | number, valueClass?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-[#2a2a2a]/50">
      <Text className="text-[#666] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Order Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Stock Card */}
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

        {/* Order Summary */}
        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <Text className="text-white text-base font-bold mb-2">Summary</Text>
          <Row label="Order ID" value={order.id} />
          <Row label="Quantity" value={order.quantity.toLocaleString()} />
          <Row label="Filled" value={order.filledQty.toLocaleString()} valueClass="text-[#4ade80]" />
          <Row label="Remaining" value={order.remainingQty.toLocaleString()} />
          <Row label="Limit Price" value={`Rs ${order.price.toFixed(2)}`} />
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#666] text-sm">Average Price</Text>
            <Text className="text-white text-sm font-semibold">{order.avgPrice ? `Rs ${order.avgPrice.toFixed(2)}` : '-'}</Text>
          </View>
        </View>

        {/* Execution Timeline */}
        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <Text className="text-white text-base font-bold mb-4">Execution Timeline</Text>
          <View className="pl-2">
            {order.timeline.map((event, index) => {
              const isLast = index === order.timeline.length - 1;
              return (
                <View key={index} className="flex-row">
                  <View className="items-center mr-4">
                    <View className={`w-3 h-3 rounded-full mt-1 ${event.isActive ? 'bg-[#f97316]' : event.isCompleted ? 'bg-[#4ade80]' : 'bg-[#333]'}`} />
                    {!isLast && (
                      <View className={`w-0.5 h-10 ${event.isCompleted && !event.isActive ? 'bg-[#4ade80]' : 'bg-[#333]'}`} />
                    )}
                  </View>
                  <View className="flex-1 pb-6">
                    <Text className={`text-sm font-semibold ${event.isActive ? 'text-[#f97316]' : event.isCompleted ? 'text-white' : 'text-[#666]'}`}>
                      {event.title}
                    </Text>
                    {event.time && <Text className="text-[#666] text-xs mt-1">{event.time}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Trade Breakdown */}
        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-6">
          <Text className="text-white text-base font-bold mb-2">Trade Breakdown</Text>
          <Row label="Filled Qty" value={order.filledQty.toLocaleString()} />
          <Row label="Remaining Qty" value={order.remainingQty.toLocaleString()} />
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#666] text-sm">Average Fill Price</Text>
            <Text className="text-white text-sm font-semibold">{order.avgPrice ? `Rs ${order.avgPrice.toFixed(2)}` : '-'}</Text>
          </View>
        </View>

        {/* Actions */}
        {['Pending', 'Partially Filled', 'Queued'].includes(order.status) && (
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity 
              onPress={handleModify}
              className="flex-1 py-4 rounded-xl border border-[#333] items-center bg-[#111]"
            >
              <Text className="text-white font-bold text-base">Modify Order</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCancel}
              className="flex-1 py-4 rounded-xl bg-[#ef4444] items-center"
            >
              <Text className="text-white font-bold text-base">Cancel Order</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
