import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrderReviewScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();

  let orderData = null;
  if (data) {
    try {
      orderData = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse order data', e);
    }
  }

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d0d0d] justify-center items-center">
        <Text className="text-white text-lg">Invalid order data</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-2 bg-[#f97316] rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const {
    symbol = '---',
    companyName = '---',
    side = 'BUY',
    orderType = 'Limit',
    price = 0,
    quantity = 0,
    validity = 'Day',
    brokerage = 0,
    fed = 0,
    secp = 0,
    totalCost = 0,
    availableBalance = 0,
    currentMarketPrice = 0,
    priceChange = 0,
    priceChangePct = 0,
  } = orderData;

  const isBuy = side === 'BUY' || side === 'Buy';
  const sideColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';
  const sideDisplay = isBuy ? 'Buy' : 'Sell';
  const totalFees = brokerage + fed + secp;
  const estCost = price * quantity;
  const afterOrder = isBuy ? availableBalance - totalCost : availableBalance + totalCost;

  const handleConfirm = () => {
    router.replace({ pathname: '/order-success', params: { data } });
  };

  const Row = ({ label, value, valueColor = 'text-white' }: { label: string; value: string; valueColor?: string }) => (
    <View className="flex-row justify-between py-3 border-b border-[#1e1e1e]">
      <Text className="text-[#666] text-sm font-semibold">{label}</Text>
      <Text className={`text-sm font-semibold ${valueColor}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">Trade<Text className="text-[#f97316]">It</Text></Text>
        </View>
        <View className="w-10 items-end">
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Centered Block */}
        <View className="items-center mb-6">
          <View className="w-12 h-12 rounded-full border border-[#f97316] items-center justify-center mb-3">
            <Ionicons name="checkmark" size={24} color="#f97316" />
          </View>
          <View className="border border-[#1e1e1e] rounded-full px-3 py-1 mb-3">
            <Text className="text-[#4ade80] text-[10px] font-bold uppercase">Review Order</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Confirm Your {sideDisplay} Order</Text>
          <Text className="text-[#666] text-xs">Please review the details below before confirming</Text>
        </View>

        {/* Stock Card */}
        <View className="bg-[#161616] rounded-xl p-3 flex-row items-center justify-between mb-4 border border-[#1e1e1e]">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
              <Text className="text-[#f97316] font-bold text-lg">{symbol.charAt(0)}</Text>
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-white font-bold text-base">{symbol}</Text>
              <Text className="text-[#666] text-[11px]" numberOfLines={1}>{companyName}</Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <Ionicons name="trending-up" size={24} color="#4ade80" />
          </View>
          <View className="items-end">
            <Text className="text-white font-bold text-sm">Rs {currentMarketPrice > 0 ? currentMarketPrice.toFixed(2) : price.toFixed(2)}</Text>
            <Text className="text-[#4ade80] text-[10px] font-semibold">
              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePct > 0 ? '+' : ''}{priceChangePct.toFixed(2)}%)
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View className="bg-[#161616] rounded-xl p-4 mb-4 border border-[#1e1e1e]">
          <Row label="Order Side" value={sideDisplay} valueColor={sideColor} />
          <Row label="Quantity" value={`${quantity.toLocaleString()} Shares`} />
          <Row label="Order Type" value={orderType} />
          <Row label="Limit Price" value={`Rs ${price.toFixed(2)}`} />
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#666] text-sm font-semibold">Validity</Text>
            <Text className="text-white text-sm font-semibold">{validity}</Text>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View className="bg-[#161616] rounded-xl p-4 mb-4 border border-[#1e1e1e]">
          <View className="flex-row justify-between pb-3 border-b border-[#1e1e1e] border-dashed">
            <Text className="text-[#666] text-xs font-semibold">Estimated Cost ({quantity} x {price.toFixed(2)})</Text>
            <Text className="text-[#ccc] text-xs font-semibold">Rs {estCost.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-[#2a2a2a] border-dashed items-center">
            <View className="flex-row items-center">
              <Text className="text-[#666] text-xs font-semibold mr-1">Estimated Fees & Charges</Text>
              <Ionicons name="information-circle-outline" size={14} color="#666" />
            </View>
            <Text className="text-[#ccc] text-xs font-semibold">Rs {totalFees > 0 ? totalFees.toFixed(2) : '1.35'}</Text>
          </View>
          <View className="flex-row justify-between pt-3 items-center">
            <Text className="text-white text-sm font-bold">Total Estimated Amount</Text>
            <Text className="text-[#f97316] text-base font-bold">
              Rs {totalCost > 0
                ? totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : (estCost + totalFees).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Buying Power */}
        <View className="bg-[#161616] rounded-xl p-4 mb-4 border border-[#1e1e1e]">
          <View className="flex-row justify-between pb-3 border-b border-[#1e1e1e]">
            <Text className="text-[#666] text-xs font-semibold">Available Buying Power</Text>
            <Text className="text-[#ccc] text-xs font-semibold">
              Rs {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#666] text-xs font-semibold">After Order (Est.)</Text>
            <Text className={`${isBuy ? 'text-[#4ade80]' : 'text-white'} text-xs font-semibold`}>
              Rs {afterOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Risk Notice */}
        <View className="bg-[#1a1500] rounded-xl p-3 flex-row items-start mb-6 border border-[#f59e0b]/20">
          <Ionicons name="shield-checkmark-outline" size={18} color="#f97316" style={{ marginRight: 8, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-white text-xs font-bold mb-1">Risk Notice</Text>
            <Text className="text-[#f59e0b] text-[10px] leading-4">
              Investments in securities are subject to market risks. Please ensure you understand the risks before placing this order.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleConfirm}
          className="bg-[#f97316] py-3.5 rounded-xl items-center flex-row justify-center mb-3"
        >
          <Text className="text-white font-bold text-base mr-2">Confirm {sideDisplay}</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="py-3.5 rounded-xl items-center border border-[#f97316] mb-4"
        >
          <Text className="text-[#f97316] font-bold text-sm">Edit Order</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10 pb-4">
          <Ionicons name="lock-closed-outline" size={12} color="#666" style={{ marginRight: 4 }} />
          <Text className="text-[#666] text-[11px]">Your order will be placed securely.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
