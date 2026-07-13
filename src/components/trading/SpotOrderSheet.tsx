import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
import { usePortfolio } from '../../context/PortfolioContext';
import { useOrders } from '../../context/OrdersContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isPendingSpotOrderType } from '../../utils/spotOrderTypes';

export interface SpotOrderInput {
  symbol: string;
  companyName: string;
  side: 'BUY' | 'SELL';
  orderType: string;
  price: number;
  stopPrice?: number;
  quantity: number;
  brokerage: number;
  fed: number;
  secp: number;
  totalCost: number;
  availableBalance: number;
  currentMarketPrice?: number;
  priceChange?: number;
  priceChangePct?: number;
}

interface SpotOrderSheetProps {
  visible: boolean;
  order: SpotOrderInput | null;
  onClose: () => void;
}

type Phase = 'review' | 'processing' | 'success';

const STEPS = [
  'Order validated',
  'Funds reserved',
  'Submitting to PSX...',
  'Awaiting exchange ack.',
  'Order confirmed',
];

const ACCENT = '#FF8A00';
const BUY = '#0ECB81';
const SELL = '#F6465D';

function DetailRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-row justify-between py-2.5 border-b border-app-border">
      <Text className="text-app-muted text-[13px] font-semibold">{label}</Text>
      <Text
        className={`text-[13px] font-semibold ${valueColor ? '' : 'text-app-text'}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}

export const SpotOrderSheet: React.FC<SpotOrderSheetProps> = ({ visible, order, onClose }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { applySpotTrade } = usePortfolio();
  const { addPendingOrder: addOrderToHub } = useOrders();
  const { pushNotification } = useNotifications();

  const [phase, setPhase] = useState<Phase>('review');
  const [activeStep, setActiveStep] = useState(0);
  const [finalData, setFinalData] = useState<Record<string, unknown> | null>(null);

  const appliedRef = useRef(false);
  const pendingIdRef = useRef<string | null>(null);

  const rotation = useSharedValue(0);
  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Reset whenever the sheet is opened with a new order.
  useEffect(() => {
    if (visible) {
      setPhase('review');
      setActiveStep(0);
      setFinalData(null);
      appliedRef.current = false;
      pendingIdRef.current = null;
    }
  }, [visible]);

  const isBuy = order?.side === 'BUY';
  const sideColor = isBuy ? BUY : SELL;
  const sideDisplay = isBuy ? 'Buy' : 'Sell';
  const orderType = order?.orderType ?? 'Market';
  const isPending = isPendingSpotOrderType(orderType);

  const handleConfirm = () => {
    if (!order) return;

    if (isPending) {
      const created = addOrderToHub({
        symbol: order.symbol,
        companyName: order.companyName,
        side: order.side,
        type: orderType === 'Stop Limit' ? 'Stop Limit' : 'Limit',
        quantity: order.quantity,
        price: order.price,
        stopPrice: orderType === 'Stop Limit' ? order.stopPrice : undefined,
        totalCost: order.totalCost,
      });
      pendingIdRef.current = created.id;
      pushNotification({
        type: 'order',
        title: 'Order Submitted',
        body: `${order.side} ${order.quantity} ${order.symbol} @ Rs ${order.price.toFixed(2)} is pending on PSX.`,
        symbol: order.symbol,
        orderId: created.id,
      });
    }

    setPhase('processing');
  };

  // Drive the processing animation + finalize the trade.
  useEffect(() => {
    if (phase !== 'processing' || !order) return;

    rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActiveStep(step);
      if (step < STEPS.length - 1) return;
      clearInterval(interval);

      const orderId = `#PSX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' PKT';
      const status = isPending ? 'Pending fill' : 'Executed';

      if (!isPending && !appliedRef.current) {
        appliedRef.current = true;
        applySpotTrade({
          symbol: order.symbol,
          companyName: order.companyName,
          side: order.side,
          price: order.price,
          quantity: order.quantity,
          totalCost: order.totalCost,
          orderType,
        });
      }

      setFinalData({ orderId, timestamp, status });
      setTimeout(() => setPhase('success'), 250);
    }, 450);

    return () => clearInterval(interval);
  }, [phase, order, isPending, orderType, applySpotTrade]);

  const closeAndGo = (href: string | { pathname: string; params?: Record<string, string> }) => {
    onClose();
    setTimeout(() => {
      if (typeof href === 'string') {
        router.replace(href as any);
        return;
      }
      router.replace({
        pathname: href.pathname,
        params: { ...href.params, returnTo: 'portfolio' },
      } as any);
    }, 60);
  };

  if (!order) return null;

  const totalFees = order.brokerage + order.fed + order.secp;
  const estCost = order.price * order.quantity;
  const afterOrder = isBuy
    ? order.availableBalance - order.totalCost
    : order.availableBalance + order.totalCost;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-end">
        {phase === 'review' && (
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        )}

        <View
          className="bg-app-sheet rounded-t-3xl border-t border-app-border max-h-[90%]"
          style={{ paddingBottom: Math.max(insets.bottom, 0) }}
        >
          {/* Grabber */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-app-border" />
          </View>

          {/* ── REVIEW ── */}
          {phase === 'review' && (
            <>
              <View className="flex-row items-center justify-between px-5 py-3">
                <Text className="text-app-text text-[16px] font-bold">Confirm Order</Text>
                <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center">
                  <Ionicons name="close" size={22} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView
                className="px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <View className="flex-row items-center bg-app-input rounded-2xl p-3.5 mb-4 border border-app-border">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${sideColor}1A`, borderWidth: 1, borderColor: `${sideColor}33` }}
                  >
                    <Text className="text-[13px] font-bold" style={{ color: sideColor }}>
                      {order.symbol.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-app-text font-bold text-[15px]">{order.symbol}</Text>
                    <Text className="text-app-muted text-[11px]" numberOfLines={1}>
                      {order.companyName}
                    </Text>
                  </View>
                  <View className="px-2.5 py-1 rounded-md" style={{ backgroundColor: `${sideColor}1A` }}>
                    <Text className="text-[12px] font-bold" style={{ color: sideColor }}>
                      {sideDisplay}
                    </Text>
                  </View>
                </View>

                <View className="bg-app-input rounded-2xl px-4 py-1 mb-4 border border-app-border">
                  <DetailRow label="Order Type" value={orderType} />
                  <DetailRow label="Quantity" value={`${order.quantity.toLocaleString()} Shares`} />
                  {orderType === 'Stop Limit' && (
                    <DetailRow label="Stop Price" value={`Rs ${(order.stopPrice ?? 0).toFixed(2)}`} />
                  )}
                  <DetailRow
                    label={orderType === 'Market' ? 'Market Price' : 'Limit Price'}
                    value={`Rs ${order.price.toFixed(2)}`}
                  />
                  <View className="flex-row justify-between py-2.5">
                    <Text className="text-app-muted text-[13px] font-semibold">Est. Fees</Text>
                    <Text className="text-app-text text-[13px] font-semibold">
                      Rs {totalFees > 0 ? totalFees.toFixed(2) : '1.35'}
                    </Text>
                  </View>
                </View>

                <View className="bg-app-input rounded-2xl px-4 py-1 mb-4 border border-app-border">
                  <DetailRow label="Estimated Cost" value={`Rs ${estCost.toFixed(2)}`} />
                  <DetailRow label="Buying Power" value={`Rs ${order.availableBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                  <View className="flex-row justify-between py-2.5">
                    <Text className="text-app-text text-[14px] font-bold">Total</Text>
                    <Text className="text-[15px] font-bold" style={{ color: ACCENT }}>
                      Rs {order.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>

                <Text className="text-app-muted text-[11px] text-center mb-4 leading-4">
                  After order, buying power ≈ Rs{' '}
                  {afterOrder.toLocaleString(undefined, { maximumFractionDigits: 2 })}. Investments are subject to
                  market risk.
                </Text>

                <TouchableOpacity
                  onPress={handleConfirm}
                  activeOpacity={0.85}
                  className="py-4 rounded-2xl items-center mb-3"
                  style={{ backgroundColor: sideColor }}
                >
                  <Text className="text-black font-bold text-[15px]">Confirm {sideDisplay}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="py-2 items-center">
                  <Text className="text-app-muted font-semibold text-[13px]">Edit Order</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}

          {/* ── PROCESSING ── */}
          {phase === 'processing' && (
            <View className="px-6 pt-4 pb-10 items-center">
              <View className="w-16 h-16 rounded-full border-4 border-app-border items-center justify-center mb-6 mt-2">
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
              <Text className="text-app-text text-[17px] font-bold mb-1">Sending to exchange...</Text>
              <Text className="text-app-muted text-[12px] mb-6">Please do not close the app</Text>

              <View className="w-full">
                {STEPS.map((step, index) => {
                  const done = index < activeStep;
                  const active = index === activeStep;
                  return (
                    <View key={step} className="flex-row items-center mb-3.5">
                      <View
                        className="w-3.5 h-3.5 rounded-full mr-3"
                        style={{
                          backgroundColor: done ? BUY : active ? ACCENT : colors.border,
                        }}
                      />
                      <Text
                        className="text-[13px] font-semibold"
                        style={{
                          color: done ? BUY : active ? ACCENT : colors.muted,
                        }}
                      >
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
            <ScrollView
              className="px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 28 }}
            >
              <View className="items-center mb-6 mt-2">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${sideColor}1A` }}
                >
                  <Ionicons name="checkmark" size={34} color={sideColor} />
                </View>
                <Text className="text-app-text text-[20px] font-bold mb-1">
                  {isPending ? 'Order Submitted!' : 'Order Placed!'}
                </Text>
                <Text className="text-app-muted text-[13px] mb-3 text-center">
                  {isPending
                    ? `Your ${sideDisplay.toLowerCase()} order is pending on PSX`
                    : `Your ${sideDisplay.toLowerCase()} order is live on PSX`}
                </Text>
                <View className="bg-app-input px-3.5 py-1.5 rounded-full border border-app-border">
                  <Text className="text-app-muted text-[11px] font-semibold">
                    Order ID {String(finalData?.orderId ?? '')}
                  </Text>
                </View>
              </View>

              <View className="bg-app-input rounded-2xl px-4 py-1 mb-6 border border-app-border">
                <DetailRow label="Stock" value={`${order.symbol} · ${order.quantity.toLocaleString()} sh`} />
                <DetailRow label="Type" value={`${sideDisplay} · ${orderType}`} valueColor={sideColor} />
                <DetailRow label="Price" value={`Rs ${order.price.toFixed(2)}`} />
                <DetailRow
                  label="Total"
                  value={`Rs ${order.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
                <View className="flex-row justify-between py-2.5">
                  <Text className="text-app-muted text-[13px] font-semibold">Status</Text>
                  <Text className="text-[13px] font-semibold" style={{ color: BUY }}>
                    ● {String(finalData?.status ?? '')}
                  </Text>
                </View>
              </View>

              {isPending ? (
                <TouchableOpacity
                  onPress={() => closeAndGo({ pathname: '/orders', params: { tab: 'spot', view: 'open' } })}
                  className="py-4 rounded-2xl items-center mb-3"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Text className="text-black font-bold text-[15px]">View Open Orders</Text>
                </TouchableOpacity>
              ) : isBuy ? (
                <TouchableOpacity
                  onPress={() => closeAndGo('/(tabs)/portfolio')}
                  className="py-4 rounded-2xl items-center mb-3"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Text className="text-black font-bold text-[15px]">View Holding</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => closeAndGo('/(tabs)/portfolio')}
                  className="py-4 rounded-2xl items-center mb-3"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Text className="text-black font-bold text-[15px]">View Portfolio</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => onClose()} activeOpacity={0.7} className="py-2.5 items-center">
                <Text className="text-app-muted font-semibold text-[13px]">Done</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
