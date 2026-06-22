import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useFutures } from '../../context/FuturesContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useOrders } from '../../context/OrdersContext';
import { useNotifications } from '../../context/NotificationsContext';
import { formatFuturesPrice, FuturesOrderPayload } from '../../data/mockFutures';

const SPOT_STEPS = [
  'Order validated',
  'Funds reserved',
  'Submitting to PSX...',
  'Awaiting exchange ack.',
  'Order confirmed',
];

const FUTURES_STEPS = [
  'Order validated',
  'Margin reserved',
  'Submitting to exchange...',
  'Awaiting exchange ack.',
  'Order confirmed',
];

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const { fulfillFuturesOrder } = useFutures();
  const { applySpotTrade } = usePortfolio();
  const { addPendingOrder } = useOrders();
  const { pushNotification } = useNotifications();

  const [isProcessing, setIsProcessing] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [orderFinalData, setOrderFinalData] = useState<Record<string, unknown> | null>(null);
  const tradeAppliedRef = React.useRef(false);

  const parsedOrder = React.useMemo(() => {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, [data]);

  const isFutures = parsedOrder?.productType === 'FUTURES';
  const steps = isFutures ? FUTURES_STEPS : SPOT_STEPS;

  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => isProcessing;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isProcessing])
  );

  // Apply market fills immediately so portfolio updates while the user can switch tabs.
  useEffect(() => {
    if (!parsedOrder || isFutures || tradeAppliedRef.current) return;

    const orderType = String(parsedOrder.orderType ?? 'Market');
    if (orderType === 'Limit') return;

    tradeAppliedRef.current = true;
    applySpotTrade({
      symbol: String(parsedOrder.symbol),
      companyName: String(parsedOrder.companyName ?? parsedOrder.symbol),
      side: String(parsedOrder.side),
      price: Number(parsedOrder.price),
      quantity: Number(parsedOrder.quantity),
      totalCost: Number(parsedOrder.totalCost),
      orderType,
    });
  }, [parsedOrder, isFutures, applySpotTrade]);

  useEffect(() => {
    if (!isProcessing || !data) return;

    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActiveStep(step);

      if (step < steps.length - 1) return;

      clearInterval(interval);

      const orderId = isFutures
        ? `#FUT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
        : `#PSX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT';
      const status = parsedOrder?.orderType === 'Limit' ? 'Pending fill' : 'Executed';

      const finalData = {
        ...parsedOrder,
        orderId,
        timestamp,
        status,
      };

      if (isFutures && parsedOrder) {
        fulfillFuturesOrder(
          {
            symbol: parsedOrder.symbol,
            companyName: parsedOrder.companyName,
            futuresSide: parsedOrder.futuresSide,
            orderType: parsedOrder.orderType,
            price: parsedOrder.price,
            quantity: parsedOrder.quantity,
            leverage: parsedOrder.leverage,
            marginMode: parsedOrder.marginMode,
            totalCost: parsedOrder.totalCost,
            currentMarketPrice: parsedOrder.currentMarketPrice,
            expiry: parsedOrder.expiry,
            productType: 'FUTURES',
          } satisfies FuturesOrderPayload,
          orderId,
          timestamp
        );
      } else if (parsedOrder) {
        const orderType = String(parsedOrder.orderType ?? 'Market');
        if (orderType === 'Limit') {
          const created = addPendingOrder({
            symbol: String(parsedOrder.symbol),
            companyName: String(parsedOrder.companyName ?? parsedOrder.symbol),
            side: parsedOrder.side === 'SELL' || parsedOrder.side === 'Sell' ? 'SELL' : 'BUY',
            type: 'Limit',
            quantity: Number(parsedOrder.quantity),
            price: Number(parsedOrder.price),
            totalCost: Number(parsedOrder.totalCost),
          });
          pushNotification({
            type: 'order',
            title: 'Order Submitted',
            body: `${parsedOrder.side} ${parsedOrder.quantity} ${parsedOrder.symbol} @ Rs ${Number(parsedOrder.price).toFixed(2)} is pending on PSX.`,
            symbol: String(parsedOrder.symbol),
            orderId: created.id,
          });
        }
      }

      setOrderFinalData(finalData);
      setTimeout(() => setIsProcessing(false), 300);
    }, 500);

    return () => clearInterval(interval);
  }, [data, isProcessing, isFutures, parsedOrder, steps.length, fulfillFuturesOrder, addPendingOrder, pushNotification]);

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
      router.navigate(isFutures ? '/(tabs)/futures' : '/(tabs)/trade');
    }
  };

  if (isProcessing) {
    return (
      <SafeAreaView className="flex-1 bg-[#050505]">
        <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
          <View className="w-10" />
          <Text className="flex-1 text-center text-white text-lg font-bold mr-10">
            {isFutures ? 'Placing Futures Order' : 'Placing Order'}
          </Text>
        </View>

        <View className="flex-1 items-center px-8 pt-16">
          <View className="w-16 h-16 rounded-full border-4 border-[#2A2B2F] items-center justify-center mb-8 relative">
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 32,
                  borderTopWidth: 4,
                  borderColor: isFutures ? '#FF8A00' : '#f97316',
                },
                animatedStyles,
              ]}
            />
          </View>

          <Text className="text-white text-xl font-bold mb-2">
            {isFutures ? 'Opening position...' : 'Sending to exchange...'}
          </Text>
          <Text className="text-[#9CA3AF] text-sm mb-12">Please do not close the app</Text>

          <View className="w-full pl-4 space-y-5">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              return (
                <View key={step} className="flex-row items-center mb-4">
                  <View className="w-6 items-center mr-4">
                    {isCompleted ? (
                      <View className="w-4 h-4 rounded-full bg-[#00C853]" />
                    ) : isActive ? (
                      <View className={`w-4 h-4 rounded-full ${isFutures ? 'bg-[#FF8A00]' : 'bg-[#f97316]'}`} />
                    ) : (
                      <View className="w-4 h-4 rounded-full bg-[#333]" />
                    )}
                  </View>
                  <Text
                    className={`font-semibold ${isCompleted ? 'text-[#00C853]' : isActive ? (isFutures ? 'text-[#FF8A00]' : 'text-[#f97316]') : 'text-[#444]'}`}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mx-4 mb-10 bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 flex-row items-center justify-center">
          <Ionicons name="time-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
          <Text className="text-[#9CA3AF] text-xs font-semibold">
            {isFutures ? 'Futures orders typically confirm in 2–5 seconds' : 'PSX processing typically takes 2–5 seconds'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isFutures) {
    return <FuturesSuccessReceipt order={orderFinalData} onDone={handleBack} />;
  }

  return <SpotSuccessReceipt order={orderFinalData} onDone={handleBack} />;
}

function FuturesSuccessReceipt({
  order,
  onDone,
}: {
  order: Record<string, unknown> | null;
  onDone: () => void;
}) {
  const symbol = String(order?.symbol ?? '');
  const futuresSide = String(order?.futuresSide ?? 'Long');
  const orderType = String(order?.orderType ?? 'Limit');
  const price = Number(order?.price ?? 0);
  const quantity = Number(order?.quantity ?? 0);
  const totalCost = Number(order?.totalCost ?? 0);
  const leverage = Number(order?.leverage ?? 10);
  const marginMode = String(order?.marginMode ?? 'Cross');
  const orderId = String(order?.orderId ?? '');
  const status = String(order?.status ?? '');
  const timestamp = String(order?.timestamp ?? '');
  const isLong = futuresSide === 'Long';
  const sideColor = isLong ? 'text-[#00C853]' : 'text-[#FF3B30]';
  const isExecuted = status === 'Executed';

  const Row = ({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) => (
    <View className="flex-row justify-between py-3">
      <Text className="text-[#9CA3AF] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={onDone} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">
          {isExecuted ? 'Position Opened' : 'Order Placed'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isLong ? 'bg-[#00C853]/15' : 'bg-[#FF3B30]/15'}`}>
            <Ionicons name="checkmark" size={32} color={isLong ? '#00C853' : '#FF3B30'} />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">
            {isExecuted ? 'Position Opened!' : 'Order Submitted!'}
          </Text>
          <Text className="text-[#9CA3AF] text-sm mb-4 text-center">
            {isExecuted
              ? `Your ${futuresSide.toLowerCase()} position on ${symbol} is now live`
              : `Your ${futuresSide.toLowerCase()} limit order is queued on the exchange`}
          </Text>
          <View className="bg-[#111214] px-4 py-1.5 rounded-full border border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Order ID {orderId}</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-2xl p-5 mb-8 border border-[#2A2B2F]">
          <Row label="Contract" value={`${symbol} · ${quantity} lots`} />
          <Row label="Side" value={`${futuresSide} · ${orderType}`} valueClass={sideColor} />
          <Row label="Leverage" value={`${leverage}x ${marginMode}`} valueClass="text-[#FF8A00]" />
          <Row
            label="Price"
            value={orderType === 'Market' ? 'Market' : `Rs ${formatFuturesPrice(price)}`}
          />
          <Row label="Margin Used" value={`Rs ${formatFuturesPrice(totalCost)}`} />
          <Row label="Status" value={`● ${status}`} valueClass="text-[#00C853]" />
          <View className="flex-row justify-between pt-3 mt-1">
            <Text className="text-[#9CA3AF] text-sm">Time</Text>
            <Text className="text-[#9CA3AF] text-sm font-semibold">{timestamp}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onDone} className="items-center py-4 rounded-xl bg-[#FF8A00] mb-10">
          <Text className="text-black font-bold text-base">Back to Futures</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SpotSuccessReceipt({
  order,
  onDone,
}: {
  order: Record<string, unknown> | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const { side, orderType, price, quantity, totalCost, orderId, status, timestamp } = order || {};
  const sym = String(order?.symbol ?? '');
  const isBuy = side === 'BUY';
  const typeColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';

  const Row = ({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) => (
    <View className="flex-row justify-between py-3">
      <Text className="text-[#9CA3AF] text-sm">{label}</Text>
      <Text className={`text-sm font-semibold ${valueClass}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={onDone} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Order Placed</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-[#0f2e0f] items-center justify-center mb-4">
            <Ionicons name="checkmark" size={32} color="#4ade80" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Order Placed!</Text>
          <Text className="text-[#9CA3AF] text-sm mb-4">Your {String(side).toLowerCase()} order is live on PSX</Text>
          <View className="bg-[#111214] px-4 py-1.5 rounded-full border border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Order ID {String(orderId)}</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-2xl p-5 mb-8 border border-[#2A2B2F]">
          <Row label="Stock" value={`${sym} · ${Number(quantity).toLocaleString()} shares`} />
          <Row label="Type" value={`${side} · ${orderType}`} valueClass={typeColor} />
          <Row label="Limit Price" value={`Rs ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Row
            label="Total Cost"
            value={`Rs ${Number(totalCost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          />
          <Row label="Status" value={`● ${status}`} valueClass="text-[#4ade80]" />
          <View className="flex-row justify-between pt-3 mt-1">
            <Text className="text-[#9CA3AF] text-sm">Time</Text>
            <Text className="text-[#9CA3AF] text-sm font-semibold">{String(timestamp)}</Text>
          </View>
        </View>

        <View className="gap-3 mb-6">
          {isBuy && sym ? (
            <TouchableOpacity
              onPress={() => router.push(`/portfolio/holding/${sym}`)}
              className="items-center py-4 rounded-xl bg-[#FF8A00]"
            >
              <Text className="text-black font-bold">View Holding</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => router.push('/portfolio/activity')}
            className="items-center py-4 rounded-xl border border-[#2A2B2F] bg-[#111214]"
          >
            <Text className="text-white font-semibold">View Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/portfolio')}
            className="items-center py-4 rounded-xl border border-[#FF8A00]/40 bg-[#111214]"
          >
            <Text className="text-[#FF8A00] font-bold">Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDone} className="py-3 items-center">
            <Text className="text-[#9CA3AF] font-semibold">Back to Trade</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="items-center pb-10"
          onPress={() => router.push({ pathname: '/alerts/create', params: { symbol: sym } })}
        >
          <Text className="text-[#FF8A00] text-sm font-semibold">Set price alert for {sym} →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
