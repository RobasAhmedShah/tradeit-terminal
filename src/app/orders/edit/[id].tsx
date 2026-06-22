import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../../context/OrdersContext';

export default function EditOrderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, updateOrder } = useOrders();
  const order = id ? getOrder(id) : undefined;

  const [price, setPrice] = useState(order ? String(order.price) : '');
  const [quantity, setQuantity] = useState(order ? String(order.quantity) : '');

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

  const canEdit = ['Pending', 'Partially Filled', 'Queued'].includes(order.status);

  const handleSave = () => {
    const nextPrice = parseFloat(price);
    const nextQty = parseInt(quantity, 10);
    if (!nextPrice || nextPrice <= 0 || !nextQty || nextQty <= 0) {
      Alert.alert('Invalid values', 'Enter a valid price and quantity.');
      return;
    }
    updateOrder(order.id, { price: nextPrice, quantity: nextQty });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Modify Order</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <Text className="text-white text-xl font-bold mb-1">{order.symbol}</Text>
          <Text className="text-[#666] text-sm">{order.companyName}</Text>
          <Text className="text-[#9CA3AF] text-xs mt-2">{order.side} · {order.type} · {order.status}</Text>
        </View>

        {!canEdit ? (
          <Text className="text-[#FF3B30] text-sm mb-4">This order can no longer be modified.</Text>
        ) : (
          <>
            <Text className="text-[#666] text-xs mb-2 uppercase">Limit Price (PKR)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              className="bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-base mb-4"
            />

            <Text className="text-[#666] text-xs mb-2 uppercase">Quantity</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              className="bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-base mb-6"
            />

            <TouchableOpacity onPress={handleSave} className="bg-[#f97316] rounded-xl py-4 items-center">
              <Text className="text-white font-bold text-base">Save Changes</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
