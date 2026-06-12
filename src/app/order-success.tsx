import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { MOCK_ORDERS } from '../data/mockOrders';

const STEPS = [
  "Order validated",
  "Funds reserved",
  "Submitting to PSX...",
  "Awaiting exchange ack.",
  "Order confirmed"
];

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [orderFinalData, setOrderFinalData] = useState<any>(null);

  // Spinner animation
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Handle back button behavior
  useFocusEffect(
    React.useCallback(() => {
      // Disable back button while processing, enable after success
      const onBackPress = () => isProcessing;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isProcessing])
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      // Start spinner
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );

      // Advance steps
      interval = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= STEPS.length - 1) {
            clearInterval(interval);
            
            // Generate mock order ID and timestamp
            const orderId = `#PSX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT';
            
            let parsed: any = {};
            try { if (data) parsed = JSON.parse(data); } catch(e) {}
            
            setOrderFinalData({
              ...parsed,
              orderId,
              timestamp,
              status: parsed.orderType === 'Limit' ? 'Pending fill' : 'Executed'
            });

            // Transition to success UI
            setTimeout(() => {
              setIsProcessing(false);
            }, 300);

            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data, isProcessing]);

  if (!data && !isProcessing) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d0d0d] justify-center items-center">
        <Text className="text-white">Something went wrong.</Text>
        <TouchableOpacity onPress={() => router.navigate('/(tabs)/home')} className="mt-4 px-6 py-2 bg-[#f97316] rounded-xl">
          <Text className="text-white font-bold">Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    if (!isProcessing) {
      router.navigate('/(tabs)/trade');
    }
  };

  if (isProcessing) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d0d0d]">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-[#1e1e1e]">
          <View className="w-10" />
          <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Placing Order</Text>
        </View>

        <View className="flex-1 items-center px-8 pt-16">
          {/* Spinner */}
          <View className="w-16 h-16 rounded-full border-4 border-[#1e1e1e] items-center justify-center mb-8 relative">
            <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%', borderRadius: 32, borderTopWidth: 4, borderColor: '#f97316' }, animatedStyles]} />
          </View>

          <Text className="text-white text-xl font-bold mb-2">Sending to exchange...</Text>
          <Text className="text-[#666] text-sm mb-12">Please do not close the app</Text>

          {/* Step Tracker */}
          <View className="w-full pl-4 space-y-5">
            {STEPS.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              
              return (
                <View key={step} className="flex-row items-center">
                  <View className="w-6 items-center mr-4">
                    {isCompleted ? (
                      <View className="w-4 h-4 rounded-full bg-[#4ade80]" />
                    ) : isActive ? (
                      <View className="w-4 h-4 rounded-full bg-[#f97316]" />
                    ) : (
                      <View className="w-4 h-4 rounded-full bg-[#333]" />
                    )}
                  </View>
                  <Text className={`font-semibold ${isCompleted ? 'text-[#4ade80]' : isActive ? 'text-[#f97316]' : 'text-[#444]'}`}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Info Pill */}
        <View className="mx-4 mb-10 bg-[#0f1710] border border-[#1f2e1f] rounded-xl p-4 flex-row items-center justify-center">
          <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 8 }} />
          <Text className="text-[#666] text-xs font-semibold">PSX processing typically takes 2–5 seconds</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Success UI
  const {
    symbol, side, orderType, price, quantity, totalCost, orderId, status, timestamp
  } = orderFinalData || {};

  const isBuy = side === 'BUY';
  const typeColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';

  const Row = ({ label, value, valueClass = "text-white" }: { label: string, value: string, valueClass?: string }) => (
    <View className="flex-row justify-between py-3">
      <Text className="text-[#666] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#1e1e1e]">
        <TouchableOpacity onPress={handleBack} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Order Placed</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        {/* Success Icon & Titles */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-[#0f2e0f] items-center justify-center mb-4">
            <Ionicons name="checkmark" size={32} color="#4ade80" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Order Placed!</Text>
          <Text className="text-[#666] text-sm mb-4">Your {side?.toLowerCase()} order is live on PSX</Text>
          <View className="bg-[#1e1e1e] px-4 py-1.5 rounded-full border border-[#2a2a2a]">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Order ID {orderId}</Text>
          </View>
        </View>

        {/* Receipt Card */}
        <View className="bg-[#111] rounded-2xl p-5 mb-8 border border-[#1e1e1e]">
          <Row label="Stock" value={`${symbol} · ${quantity?.toLocaleString()} shares`} />
          <Row label="Type" value={`${side} · ${orderType}`} valueClass={typeColor} />
          <Row label="Limit Price" value={`Rs ${price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Row label="Total Cost" value={`Rs ${totalCost?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} />
          <Row label="Status" value={`● ${status}`} valueClass="text-[#4ade80]" />
          <View className="flex-row justify-between pt-3 mt-1">
            <Text className="text-[#666] text-sm">Time</Text>
            <Text className="text-[#666] text-sm font-semibold">{timestamp}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity className="flex-[0.8] items-center py-4 rounded-xl border border-[#2a2a2a] bg-[#111]">
            <Text className="text-white font-semibold">Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              if (orderId) {
                // Push to mock orders so the details screen can find it
                MOCK_ORDERS.unshift({
                  id: orderId,
                  symbol: symbol || '',
                  companyName: 'Mock Company',
                  side: side as any,
                  type: orderType as any,
                  quantity: quantity || 0,
                  filledQty: status === 'Executed' ? (quantity || 0) : 0,
                  remainingQty: status === 'Executed' ? 0 : (quantity || 0),
                  price: price || 0,
                  status: status === 'Executed' ? 'Executed' : 'Pending',
                  createdTime: timestamp || '',
                  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                  timeline: [
                    { title: 'Created', time: timestamp, isCompleted: true },
                    { title: 'Submitted', time: timestamp, isCompleted: true },
                    { title: 'Exchange Accepted', time: timestamp, isCompleted: true, isActive: true }
                  ]
                });
                router.navigate(`/orders/${orderId}`);
              }
            }}
            className="flex-[1.2] items-center py-4 rounded-xl border border-[#2a2a2a] bg-[#111]"
          >
            <Text className="text-white font-semibold">View Order</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleBack}
            className="flex-1 items-center py-4 rounded-xl bg-[#f97316]"
          >
            <Text className="text-white font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="items-center pb-10">
          <Text className="text-[#f97316] text-sm font-semibold">Set price alert for {symbol} →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
