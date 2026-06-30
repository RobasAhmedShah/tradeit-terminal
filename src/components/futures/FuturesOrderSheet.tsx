import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFutures } from '../../context/FuturesContext';
import { useNotifications } from '../../context/NotificationsContext';
import {
  estimateLiqPrice,
  formatFuturesPrice,
  FuturesMarginMode,
  FuturesOrderPayload,
  FuturesOrderType,
  FuturesSide,
} from '../../data/mockFutures';

export interface FuturesOrderInput {
  symbol: string;
  companyName: string;
  futuresSide: FuturesSide;
  orderType: FuturesOrderType;
  price: number;
  quantity: number;
  leverage: number;
  marginMode: FuturesMarginMode;
  totalCost: number;
  availableBalance: number;
  currentMarketPrice: number;
  priceChange?: number;
  priceChangePct?: number;
  expiry?: string;
}

interface FuturesOrderSheetProps {
  visible: boolean;
  order: FuturesOrderInput | null;
  onClose: () => void;
}

type Phase = 'review' | 'processing' | 'success';

const STEPS = [
  'Order validated',
  'Margin reserved',
  'Submitting to exchange...',
  'Awaiting exchange ack.',
  'Order confirmed',
];

const ACCENT = '#FF8A00';
const LONG = '#0ECB81';
const SHORT = '#F6465D';

function DetailRow({
  label,
  value,
  valueColor = '#FFFFFF',
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-row justify-between py-2.5 border-b border-[#25272D]">
      <Text className="text-[#8A8D93] text-[13px] font-semibold">{label}</Text>
      <Text className="text-[13px] font-semibold" style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}

export const FuturesOrderSheet: React.FC<FuturesOrderSheetProps> = ({ visible, order, onClose }) => {
  const router = useRouter();
  const { fulfillFuturesOrder } = useFutures();
  const { pushNotification } = useNotifications();

  const [phase, setPhase] = useState<Phase>('review');
  const [activeStep, setActiveStep] = useState(0);
  const [finalData, setFinalData] = useState<{ orderId: string; timestamp: string; status: string } | null>(null);

  const fulfilledRef = useRef(false);

  const rotation = useSharedValue(0);
  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    if (visible) {
      setPhase('review');
      setActiveStep(0);
      setFinalData(null);
      fulfilledRef.current = false;
    }
  }, [visible]);

  const isLong = order?.futuresSide === 'Long';
  const sideColor = isLong ? LONG : SHORT;
  const orderType = order?.orderType ?? 'Market';
  const isPending = orderType === 'Limit';

  const handleConfirm = () => setPhase('processing');

  useEffect(() => {
    if (phase !== 'processing' || !order) return;

    rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActiveStep(step);
      if (step < STEPS.length - 1) return;
      clearInterval(interval);

      const orderId = `#FUT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT';
      const status = isPending ? 'Pending fill' : 'Executed';

      if (!fulfilledRef.current) {
        fulfilledRef.current = true;
        fulfillFuturesOrder(
          {
            symbol: order.symbol,
            companyName: order.companyName,
            futuresSide: order.futuresSide,
            orderType: order.orderType,
            price: order.price,
            quantity: order.quantity,
            leverage: order.leverage,
            marginMode: order.marginMode,
            totalCost: order.totalCost,
            currentMarketPrice: order.currentMarketPrice,
            expiry: order.expiry,
            productType: 'FUTURES',
          } satisfies FuturesOrderPayload,
          orderId,
          timestamp
        );
        if (isPending) {
          pushNotification({
            type: 'order',
            title: 'Futures Order Pending',
            body: `${order.futuresSide} ${order.quantity} ${order.symbol} limit is queued. Expect fill in ~5 seconds.`,
            symbol: order.symbol,
            orderId,
          });
        }
      }

      setFinalData({ orderId, timestamp, status });
      setTimeout(() => setPhase('success'), 250);
    }, 450);

    return () => clearInterval(interval);
  }, [phase, order, isPending, fulfillFuturesOrder, pushNotification]);

  const closeAndGo = (path?: string) => {
    onClose();
    if (path) setTimeout(() => router.push(path as any), 60);
  };

  if (!order) return null;

  const orderValue = order.price * order.quantity;
  const liqPrice = estimateLiqPrice(order.futuresSide, order.price, order.leverage);
  const afterOrder = order.availableBalance - order.totalCost;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-end">
        {phase === 'review' && <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />}

        <View className="bg-[#161719] rounded-t-3xl border-t border-[#25272D] max-h-[90%]">
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
          </View>

          {/* ── REVIEW ── */}
          {phase === 'review' && (
            <>
              <View className="flex-row items-center justify-between px-5 py-3">
                <Text className="text-white text-[16px] font-bold">Confirm {order.futuresSide} Order</Text>
                <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center">
                  <Ionicons name="close" size={22} color="#8A8D93" />
                </TouchableOpacity>
              </View>

              <ScrollView className="px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="flex-row items-center bg-[#1C1E22] rounded-2xl p-3.5 mb-4 border border-[#25272D]">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${sideColor}1A`, borderWidth: 1, borderColor: `${sideColor}33` }}
                  >
                    <Text className="text-[13px] font-bold" style={{ color: sideColor }}>
                      {order.symbol.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-[15px]">{order.symbol}</Text>
                    <Text className="text-[#8A8D93] text-[11px]" numberOfLines={1}>
                      {order.companyName} · {order.expiry ?? 'Perpetual'}
                    </Text>
                  </View>
                  <View className="px-2.5 py-1 rounded-md" style={{ backgroundColor: `${sideColor}1A` }}>
                    <Text className="text-[12px] font-bold" style={{ color: sideColor }}>
                      {order.futuresSide}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mb-4">
                  <View className="flex-1 rounded-xl py-2 px-3 border border-[#25272D] bg-[#1C1E22]">
                    <Text className="text-[#8A8D93] text-[10px] mb-0.5">Leverage</Text>
                    <Text className="text-[13px] font-bold" style={{ color: ACCENT }}>{order.leverage}x</Text>
                  </View>
                  <View className="flex-1 rounded-xl py-2 px-3 border border-[#25272D] bg-[#1C1E22]">
                    <Text className="text-[#8A8D93] text-[10px] mb-0.5">Margin</Text>
                    <Text className="text-white text-[13px] font-bold">{order.marginMode}</Text>
                  </View>
                  <View className="flex-1 rounded-xl py-2 px-3 border border-[#25272D] bg-[#1C1E22]">
                    <Text className="text-[#8A8D93] text-[10px] mb-0.5">Type</Text>
                    <Text className="text-white text-[13px] font-bold">{orderType}</Text>
                  </View>
                </View>

                <View className="bg-[#1C1E22] rounded-2xl px-4 py-1 mb-4 border border-[#25272D]">
                  <DetailRow label="Quantity" value={`${order.quantity.toLocaleString()} Lots`} />
                  <DetailRow
                    label={orderType === 'Market' ? 'Price' : 'Limit Price'}
                    value={orderType === 'Market' ? 'Market' : `Rs ${formatFuturesPrice(order.price)}`}
                  />
                  <DetailRow label="Order Value" value={`Rs ${formatFuturesPrice(orderValue)}`} />
                  <DetailRow
                    label={`Required Margin (${order.leverage}x)`}
                    value={`Rs ${formatFuturesPrice(order.totalCost)}`}
                    valueColor={ACCENT}
                  />
                  <View className="flex-row justify-between py-2.5">
                    <Text className="text-[#8A8D93] text-[13px] font-semibold">Est. Liq. Price</Text>
                    <Text className="text-[13px] font-semibold" style={{ color: SHORT }}>
                      Rs {formatFuturesPrice(liqPrice)}
                    </Text>
                  </View>
                </View>

                <Text className="text-[#5C6068] text-[11px] text-center mb-4 leading-4">
                  {order.leverage}x leverage amplifies gains and losses. Available margin after order ≈ Rs{' '}
                  {afterOrder.toLocaleString(undefined, { maximumFractionDigits: 2 })}.
                </Text>

                <TouchableOpacity
                  onPress={handleConfirm}
                  activeOpacity={0.85}
                  className="py-4 rounded-2xl items-center mb-3"
                  style={{ backgroundColor: sideColor }}
                >
                  <Text className="text-black font-bold text-[15px]">Confirm {order.futuresSide}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="py-2 items-center">
                  <Text className="text-[#8A8D93] font-semibold text-[13px]">Edit Order</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}

          {/* ── PROCESSING ── */}
          {phase === 'processing' && (
            <View className="px-6 pt-4 pb-10 items-center">
              <View className="w-16 h-16 rounded-full border-4 border-[#25272D] items-center justify-center mb-6 mt-2">
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: 32,
                      borderTopWidth: 4,
                      borderColor: ACCENT,
                    },
                    spinnerStyle,
                  ]}
                />
              </View>
              <Text className="text-white text-[17px] font-bold mb-1">Opening position...</Text>
              <Text className="text-[#8A8D93] text-[12px] mb-6">Please do not close the app</Text>

              <View className="w-full">
                {STEPS.map((step, index) => {
                  const done = index < activeStep;
                  const active = index === activeStep;
                  return (
                    <View key={step} className="flex-row items-center mb-3.5">
                      <View
                        className="w-3.5 h-3.5 rounded-full mr-3"
                        style={{ backgroundColor: done ? LONG : active ? ACCENT : '#333' }}
                      />
                      <Text className="text-[13px] font-semibold" style={{ color: done ? LONG : active ? ACCENT : '#444' }}>
                        {step}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── SUCCESS ── */}
          {phase === 'success' && (
            <ScrollView className="px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
              <View className="items-center mb-6 mt-2">
                <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${sideColor}1A` }}>
                  <Ionicons name="checkmark" size={34} color={sideColor} />
                </View>
                <Text className="text-white text-[20px] font-bold mb-1">
                  {isPending ? 'Order Submitted!' : 'Position Opened!'}
                </Text>
                <Text className="text-[#8A8D93] text-[13px] mb-3 text-center">
                  {isPending
                    ? `Your ${order.futuresSide.toLowerCase()} limit order is queued on the exchange`
                    : `Your ${order.futuresSide.toLowerCase()} position on ${order.symbol} is now live`}
                </Text>
                <View className="bg-[#1C1E22] px-3.5 py-1.5 rounded-full border border-[#25272D]">
                  <Text className="text-[#8A8D93] text-[11px] font-semibold">Order ID {finalData?.orderId ?? ''}</Text>
                </View>
              </View>

              <View className="bg-[#1C1E22] rounded-2xl px-4 py-1 mb-6 border border-[#25272D]">
                <DetailRow label="Contract" value={`${order.symbol} · ${order.quantity} lots`} />
                <DetailRow label="Side" value={`${order.futuresSide} · ${orderType}`} valueColor={sideColor} />
                <DetailRow label="Leverage" value={`${order.leverage}x ${order.marginMode}`} valueColor={ACCENT} />
                <DetailRow
                  label="Price"
                  value={orderType === 'Market' ? 'Market' : `Rs ${formatFuturesPrice(order.price)}`}
                />
                <DetailRow label="Margin Used" value={`Rs ${formatFuturesPrice(order.totalCost)}`} />
                <View className="flex-row justify-between py-2.5">
                  <Text className="text-[#8A8D93] text-[13px] font-semibold">Status</Text>
                  <Text className="text-[13px] font-semibold" style={{ color: LONG }}>
                    ● {finalData?.status ?? ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => closeAndGo('/orders?tab=futures&view=positions')}
                className="py-4 rounded-2xl items-center mb-3"
                style={{ backgroundColor: ACCENT }}
              >
                <Text className="text-black font-bold text-[15px]">
                  {isPending ? 'View Open Orders' : 'View Positions'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onClose()} activeOpacity={0.7} className="py-2.5 items-center">
                <Text className="text-[#8A8D93] font-semibold text-[13px]">Done</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
