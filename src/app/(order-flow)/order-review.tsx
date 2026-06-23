import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  estimateLiqPrice,
  formatFuturesPrice,
  FuturesSide,
} from '../../data/mockFutures';
import { usePortfolio } from '../../context/PortfolioContext';
import { useOrders } from '../../context/OrdersContext';
import { useNotifications } from '../../context/NotificationsContext';
import { isPendingSpotOrderType } from '../../utils/spotOrderTypes';

type RowProps = { label: string; value: string; valueColor?: string };

const DetailRow = ({ label, value, valueColor = 'text-white' }: RowProps) => (
  <View className="flex-row justify-between py-3 border-b border-[#2A2B2F]">
    <Text className="text-[#9CA3AF] text-sm font-semibold">{label}</Text>
    <Text className={`text-sm font-semibold ${valueColor}`}>{value}</Text>
  </View>
);

export default function OrderReviewScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();

  let orderData: Record<string, unknown> | null = null;
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

  const isFutures = orderData.productType === 'FUTURES';

  if (isFutures) {
    return <FuturesOrderReview data={orderData} rawData={data!} />;
  }

  return <SpotOrderReview data={orderData} rawData={data!} />;
}

function FuturesOrderReview({
  data,
  rawData,
}: {
  data: Record<string, unknown>;
  rawData: string;
}) {
  const router = useRouter();

  const symbol = String(data.symbol ?? '---');
  const companyName = String(data.companyName ?? '---');
  const futuresSide = (data.futuresSide as FuturesSide) ?? 'Long';
  const orderType = String(data.orderType ?? 'Limit');
  const price = Number(data.price ?? 0);
  const quantity = Number(data.quantity ?? 0);
  const leverage = Number(data.leverage ?? 10);
  const marginMode = String(data.marginMode ?? 'Cross');
  const totalCost = Number(data.totalCost ?? 0);
  const availableBalance = Number(data.availableBalance ?? 0);
  const currentMarketPrice = Number(data.currentMarketPrice ?? 0);
  const priceChange = Number(data.priceChange ?? 0);
  const priceChangePct = Number(data.priceChangePct ?? 0);
  const expiry = String(data.expiry ?? 'Perpetual');

  const isLong = futuresSide === 'Long';
  const sideColor = isLong ? 'text-[#00C853]' : 'text-[#FF3B30]';
  const orderValue = price * quantity;
  const liqPrice = estimateLiqPrice(futuresSide, price, leverage);
  const afterOrder = availableBalance - totalCost;

  const handleConfirm = () => {
    router.replace({ pathname: '/order-success', params: { data: rawData } });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">
            Trade<Text className="text-[#FF8A00]">It</Text>
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="w-12 h-12 rounded-full border border-[#FF8A00] items-center justify-center mb-3">
            <Ionicons name="checkmark" size={24} color="#FF8A00" />
          </View>
          <View className="border border-[#2A2B2F] rounded-full px-3 py-1 mb-3">
            <Text className="text-[#FF8A00] text-[10px] font-bold uppercase">Futures Review</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Confirm Your {futuresSide} Order</Text>
          <Text className="text-[#9CA3AF] text-xs">Review margin and contract details before confirming</Text>
        </View>

        <View className="bg-[#111214] rounded-xl p-3 flex-row items-center justify-between mb-4 border border-[#2A2B2F]">
          <View className="flex-1">
            <Text className="text-white font-bold text-base">{symbol}</Text>
            <Text className="text-[#9CA3AF] text-[11px]" numberOfLines={1}>
              {companyName} · {expiry}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white font-bold text-sm">
              {formatFuturesPrice(currentMarketPrice > 0 ? currentMarketPrice : price)}
            </Text>
            <Text className={`text-[10px] font-semibold ${priceChange >= 0 ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
              {priceChange >= 0 ? '+' : ''}
              {priceChange.toFixed(2)} ({priceChangePct >= 0 ? '+' : ''}
              {priceChangePct.toFixed(2)}%)
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 mb-4">
          <View className={`flex-1 rounded-lg py-2 px-3 border ${isLong ? 'bg-[#00C853]/10 border-[#00C853]/30' : 'bg-[#FF3B30]/10 border-[#FF3B30]/30'}`}>
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Side</Text>
            <Text className={`text-sm font-bold ${sideColor}`}>{futuresSide}</Text>
          </View>
          <View className="flex-1 rounded-lg py-2 px-3 border border-[#2A2B2F] bg-[#18191C]">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Leverage</Text>
            <Text className="text-[#FF8A00] text-sm font-bold">{leverage}x</Text>
          </View>
          <View className="flex-1 rounded-lg py-2 px-3 border border-[#2A2B2F] bg-[#18191C]">
            <Text className="text-[#9CA3AF] text-[10px] mb-0.5">Margin</Text>
            <Text className="text-white text-sm font-bold">{marginMode}</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <DetailRow label="Position Side" value={futuresSide} valueColor={sideColor} />
          <DetailRow label="Quantity" value={`${quantity.toLocaleString()} Lots`} />
          <DetailRow label="Order Type" value={orderType} />
          <DetailRow
            label={orderType === 'Market' ? 'Price' : 'Limit Price'}
            value={
              orderType === 'Market'
                ? 'Market'
                : `Rs ${formatFuturesPrice(price)}`
            }
          />
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#9CA3AF] text-sm font-semibold">Validity</Text>
            <Text className="text-white text-sm font-semibold">GTC</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <View className="flex-row justify-between pb-3 border-b border-[#2A2B2F] border-dashed">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Order Value</Text>
            <Text className="text-white text-xs font-semibold">{formatFuturesPrice(orderValue)}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-[#2A2B2F] border-dashed">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Required Margin ({leverage}x)</Text>
            <Text className="text-[#FF8A00] text-xs font-bold">{formatFuturesPrice(totalCost)}</Text>
          </View>
          <View className="flex-row justify-between pt-3 items-center">
            <View className="flex-row items-center">
              <Text className="text-[#9CA3AF] text-xs font-semibold mr-1">Est. Liq. Price</Text>
              <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
            </View>
            <Text className="text-[#FF3B30] text-xs font-semibold">{formatFuturesPrice(liqPrice)}</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <View className="flex-row justify-between pb-3 border-b border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Available Margin</Text>
            <Text className="text-white text-xs font-semibold">
              Rs {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#9CA3AF] text-xs font-semibold">After Order (Est.)</Text>
            <Text className="text-white text-xs font-semibold">
              Rs {afterOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View className="bg-[#1a1200] rounded-xl p-3 flex-row items-start mb-6 border border-[#FF8A00]/20">
          <Ionicons name="warning-outline" size={18} color="#FF8A00" style={{ marginRight: 8, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-white text-xs font-bold mb-1">Leverage Risk Notice</Text>
            <Text className="text-[#FF8A00] text-[10px] leading-4">
              Futures trading with {leverage}x leverage amplifies both gains and losses. You may lose more than your
              initial margin. Ensure you understand liquidation risk before confirming.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          className={`py-3.5 rounded-xl items-center flex-row justify-center mb-3 ${isLong ? 'bg-[#00C853]' : 'bg-[#FF3B30]'}`}
        >
          <Text className="text-white font-bold text-base mr-2">Confirm {futuresSide}</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="py-3.5 rounded-xl items-center border border-[#FF8A00] mb-4"
        >
          <Text className="text-[#FF8A00] font-bold text-sm">Edit Order</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10 pb-4">
          <Ionicons name="lock-closed-outline" size={12} color="#666" style={{ marginRight: 4 }} />
          <Text className="text-[#666] text-[11px]">Your futures order will be placed securely.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SpotOrderReview({
  data,
  rawData,
}: {
  data: Record<string, unknown>;
  rawData: string;
}) {
  const router = useRouter();
  const { summary } = usePortfolio();
  const { addPendingOrder } = useOrders();
  const { pushNotification } = useNotifications();

  const symbol = String(data.symbol ?? '---');
  const companyName = String(data.companyName ?? '---');
  const side = String(data.side ?? 'BUY');
  const orderType = String(data.orderType ?? 'Limit');
  const price = Number(data.price ?? 0);
  const quantity = Number(data.quantity ?? 0);
  const validity = String(data.validity ?? 'Day');
  const brokerage = Number(data.brokerage ?? 0);
  const fed = Number(data.fed ?? 0);
  const secp = Number(data.secp ?? 0);
  const totalCost = Number(data.totalCost ?? 0);
  const availableBalance = summary.buyingPower;
  const currentMarketPrice = Number(data.currentMarketPrice ?? 0);
  const priceChange = Number(data.priceChange ?? 0);
  const priceChangePct = Number(data.priceChangePct ?? 0);

  const isBuy = side === 'BUY' || side === 'Buy';
  const sideColor = isBuy ? 'text-[#4ade80]' : 'text-[#ef4444]';
  const sideDisplay = isBuy ? 'Buy' : 'Sell';
  const totalFees = brokerage + fed + secp;
  const estCost = price * quantity;
  const afterOrder = isBuy ? availableBalance - totalCost : availableBalance + totalCost;

  const handleConfirm = () => {
    if (isPendingSpotOrderType(orderType)) {
      const created = addPendingOrder({
        symbol,
        companyName,
        side: isBuy ? 'BUY' : 'SELL',
        type: orderType === 'Stop Limit' ? 'Stop Limit' : 'Limit',
        quantity,
        price,
        totalCost,
      });

      pushNotification({
        type: 'order',
        title: 'Order Submitted',
        body: `${side} ${quantity} ${symbol} @ Rs ${price.toFixed(2)} is pending on PSX.`,
        symbol,
        orderId: created.id,
      });

      const payload = { ...data, pendingOrderId: created.id };
      router.replace({ pathname: '/order-success', params: { data: JSON.stringify(payload) } });
      return;
    }

    router.replace({ pathname: '/order-success', params: { data: rawData } });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">
            Trade<Text className="text-[#FF8A00]">It</Text>
          </Text>
        </View>
        <View className="w-10 items-end">
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="w-12 h-12 rounded-full border border-[#FF8A00] items-center justify-center mb-3">
            <Ionicons name="checkmark" size={24} color="#FF8A00" />
          </View>
          <View className="border border-[#2A2B2F] rounded-full px-3 py-1 mb-3">
            <Text className="text-[#4ade80] text-[10px] font-bold uppercase">Review Order</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Confirm Your {sideDisplay} Order</Text>
          <Text className="text-[#666] text-xs">Please review the details below before confirming</Text>
        </View>

        <View className="bg-[#111214] rounded-xl p-3 flex-row items-center justify-between mb-4 border border-[#2A2B2F]">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
              <Text className="text-[#FF8A00] font-bold text-lg">{symbol.charAt(0)}</Text>
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-white font-bold text-base">{symbol}</Text>
              <Text className="text-[#666] text-[11px]" numberOfLines={1}>
                {companyName}
              </Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <Ionicons name="trending-up" size={24} color="#4ade80" />
          </View>
          <View className="items-end">
            <Text className="text-white font-bold text-sm">
              Rs {currentMarketPrice > 0 ? currentMarketPrice.toFixed(2) : price.toFixed(2)}
            </Text>
            <Text className="text-[#4ade80] text-[10px] font-semibold">
              {priceChange > 0 ? '+' : ''}
              {priceChange.toFixed(2)} ({priceChangePct > 0 ? '+' : ''}
              {priceChangePct.toFixed(2)}%)
            </Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <DetailRow label="Order Side" value={sideDisplay} valueColor={sideColor} />
          <DetailRow label="Quantity" value={`${quantity.toLocaleString()} Shares`} />
          <DetailRow label="Order Type" value={orderType} />
          <DetailRow label="Limit Price" value={`Rs ${price.toFixed(2)}`} />
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#9CA3AF] text-sm font-semibold">Validity</Text>
            <Text className="text-white text-sm font-semibold">{validity}</Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <View className="flex-row justify-between pb-3 border-b border-[#2A2B2F] border-dashed">
            <Text className="text-[#9CA3AF] text-xs font-semibold">
              Estimated Cost ({quantity} x {price.toFixed(2)})
            </Text>
            <Text className="text-white text-xs font-semibold">Rs {estCost.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-[#2A2B2F] border-dashed items-center">
            <View className="flex-row items-center">
              <Text className="text-[#9CA3AF] text-xs font-semibold mr-1">Estimated Fees & Charges</Text>
              <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
            </View>
            <Text className="text-white text-xs font-semibold">
              Rs {totalFees > 0 ? totalFees.toFixed(2) : '1.35'}
            </Text>
          </View>
          <View className="flex-row justify-between pt-3 items-center">
            <Text className="text-white text-sm font-bold">Total Estimated Amount</Text>
            <Text className="text-[#FF8A00] text-base font-bold">
              Rs{' '}
              {totalCost > 0
                ? totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : (estCost + totalFees).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </Text>
          </View>
        </View>

        <View className="bg-[#111214] rounded-xl p-4 mb-4 border border-[#2A2B2F]">
          <View className="flex-row justify-between pb-3 border-b border-[#2A2B2F]">
            <Text className="text-[#9CA3AF] text-xs font-semibold">Available Buying Power</Text>
            <Text className="text-white text-xs font-semibold">
              Rs {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View className="flex-row justify-between pt-3">
            <Text className="text-[#9CA3AF] text-xs font-semibold">After Order (Est.)</Text>
            <Text className={`${isBuy ? 'text-[#4ade80]' : 'text-white'} text-xs font-semibold`}>
              Rs {afterOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View className="bg-[#1a1200] rounded-xl p-3 flex-row items-start mb-6 border border-[#FF8A00]/20">
          <Ionicons name="shield-checkmark-outline" size={18} color="#FF8A00" style={{ marginRight: 8, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-white text-xs font-bold mb-1">Risk Notice</Text>
            <Text className="text-[#FF8A00] text-[10px] leading-4">
              Investments in securities are subject to market risks. Please ensure you understand the risks before
              placing this order.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          className="bg-[#FF8A00] py-3.5 rounded-xl items-center flex-row justify-center mb-3"
        >
          <Text className="text-white font-bold text-base mr-2">Confirm {sideDisplay}</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="py-3.5 rounded-xl items-center border border-[#FF8A00] mb-4"
        >
          <Text className="text-[#FF8A00] font-bold text-sm">Edit Order</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10 pb-4">
          <Ionicons name="lock-closed-outline" size={12} color="#666" style={{ marginRight: 4 }} />
          <Text className="text-[#666] text-[11px]">Your order will be placed securely.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
