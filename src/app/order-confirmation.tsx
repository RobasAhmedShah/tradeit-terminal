import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderConfirmationPlaceholderScreen() {
  const { symbol, side } = useLocalSearchParams<{ symbol: string; side: string }>();
  const router = useRouter();

  const isBuy = side === 'buy';

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
        <Text className="text-white text-2xl font-bold mb-4 text-center">
          Order Confirmation coming in Phase 6
        </Text>
        <Text className="text-[#9CA3AF] text-base text-center leading-6">
          You requested to <Text className={isBuy ? 'text-[#00C853] font-bold' : 'text-[#FF3B30] font-bold'}>{side ? side.toUpperCase() : 'TRADE'}</Text> the stock <Text className="text-white font-bold">{symbol}</Text>. The fully functional order confirmation and execution flow will be built in the next phase.
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-10 border border-[#2A2B2F] bg-[#111214] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
