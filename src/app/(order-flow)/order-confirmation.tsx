import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderConfirmationScreen() {
  const { symbol, side } = useLocalSearchParams<{ symbol: string; side: string }>();
  const router = useRouter();

  const isBuy = side === 'buy';

  const handleConfirm = () => {
    router.replace({
      pathname: '/order-success',
      params: {
        data: JSON.stringify({
          symbol: symbol ?? '---',
          companyName: symbol ?? '---',
          side: isBuy ? 'BUY' : 'SELL',
          orderType: 'Market',
          price: 0,
          quantity: 0,
          validity: 'Day',
          brokerage: 0,
          fed: 0,
          secp: 0,
          totalCost: 0,
          availableBalance: 0,
          currentMarketPrice: 0,
          priceChange: 0,
          priceChangePct: 0,
        }),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-base font-bold ml-4">Order Confirmation</Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isBuy ? 'bg-[#00C853]/10' : 'bg-[#FF3B30]/10'}`}>
          <Ionicons name="document-text-outline" size={40} color={isBuy ? '#00C853' : '#FF3B30'} />
        </View>

        <Text className="text-white text-2xl font-bold mb-2 text-center">
          Confirm Your {isBuy ? 'Buy' : 'Sell'} Order
        </Text>
        <Text className="text-[#9CA3AF] text-base text-center leading-6 mb-8">
          You are about to place a{' '}
          <Text className={isBuy ? 'text-[#00C853] font-bold' : 'text-[#FF3B30] font-bold'}>
            {side ? side.toUpperCase() : 'TRADE'}
          </Text>{' '}
          order for <Text className="text-white font-bold">{symbol}</Text>.
        </Text>

        <TouchableOpacity
          onPress={handleConfirm}
          className={`w-full py-3.5 rounded-xl items-center mb-3 ${isBuy ? 'bg-[#00C853]' : 'bg-[#FF3B30]'}`}
        >
          <Text className="text-white font-bold text-base">Confirm {isBuy ? 'Buy' : 'Sell'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full border border-[#2A2B2F] bg-[#111214] py-3.5 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
