import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { useEditOrderSheet } from '../../context/EditOrderSheetContext';
import { COLORS } from '../../constants/theme';
import { hapticLight, hapticMedium } from '../../utils/haptics';

interface OrderDetailSheetProps {
  visible: boolean;
  orderId: string | null;
  onClose: () => void;
}

const MODIFIABLE_STATUSES = ['Pending', 'Partially Filled', 'Queued'];

const Row = ({
  label,
  value,
  valueColor = COLORS.text,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) => (
  <View className="flex-row justify-between py-3 border-b border-[#25272D]">
    <Text className="text-[#8A8D93] text-sm">{label}</Text>
    <Text className="text-sm font-semibold" style={{ color: valueColor }}>
      {value}
    </Text>
  </View>
);

export const OrderDetailSheet: React.FC<OrderDetailSheetProps> = ({ visible, orderId, onClose }) => {
  const insets = useSafeAreaInsets();
  const { getOrder, cancelOrder } = useOrders();
  const { showAlert } = useAppAlert();
  const { openEditOrder } = useEditOrderSheet();

  const order = orderId ? getOrder(orderId) : undefined;
  const isBuy = order?.side === 'BUY';
  const canModify = order ? MODIFIABLE_STATUSES.includes(order.status) : false;

  const handleClose = () => onClose();

  const handleModify = () => {
    if (!order) return;
    hapticLight();
    onClose();
    setTimeout(() => openEditOrder(order.id), 80);
  };

  const handleCancel = () => {
    if (!order) return;
    showAlert(
      'Cancel Order',
      `Are you sure you want to cancel order ${order.id}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            hapticMedium();
            cancelOrder(order.id);
            onClose();
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="flex-1" onPress={handleClose} />

        <View
          className="rounded-t-3xl border-t border-[#25272D] max-h-[90%]"
          style={{ backgroundColor: COLORS.sheet, paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center pt-2.5 pb-1">
            <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-2.5 border-b border-[#25272D]">
            <Text className="text-white text-[16px] font-bold">Order Details</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#8A8D93" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          >
            {!order ? (
              <View className="py-10 items-center">
                <Text className="text-[#8A8D93] text-sm">Order not found</Text>
              </View>
            ) : (
              <>
                <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white text-xl font-bold">{order.symbol}</Text>
                    <View
                      className="px-3 py-1 rounded-full border"
                      style={{
                        backgroundColor: isBuy ? `${COLORS.buy}18` : `${COLORS.sell}18`,
                        borderColor: isBuy ? `${COLORS.buy}40` : `${COLORS.sell}40`,
                      }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{ color: isBuy ? COLORS.buy : COLORS.sell }}
                      >
                        {order.side}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[#8A8D93] text-sm flex-1 mr-2">{order.companyName}</Text>
                    <Text className="text-[#9CA3AF] text-sm font-semibold">{order.type} Order</Text>
                  </View>
                </View>

                <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
                  <Text className="text-white text-base font-bold mb-1">Summary</Text>
                  <Row label="Order ID" value={order.id} />
                  <Row label="Quantity" value={order.quantity.toLocaleString()} />
                  <Row label="Filled" value={order.filledQty.toLocaleString()} valueColor={COLORS.buy} />
                  <Row label="Remaining" value={order.remainingQty.toLocaleString()} />
                  {order.type === 'Stop Limit' && order.stopPrice != null && (
                    <Row label="Stop Price" value={`Rs ${order.stopPrice.toFixed(2)}`} />
                  )}
                  <Row label="Limit Price" value={`Rs ${order.price.toFixed(2)}`} />
                  {order.avgPrice != null && (
                    <Row label="Avg Price" value={`Rs ${order.avgPrice.toFixed(2)}`} />
                  )}
                  <Row label="Status" value={order.status} />
                  <Row label="Created" value={`${order.date} · ${order.createdTime}`} />
                </View>

                <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
                  <Text className="text-white text-base font-bold mb-3">Timeline</Text>
                  {order.timeline.map((event, index) => (
                    <View key={`${event.title}-${index}`} className="flex-row mb-3">
                      <View className="items-center mr-3">
                        <View
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.isCompleted ? COLORS.buy : '#333' }}
                        />
                        {index < order.timeline.length - 1 && (
                          <View className="w-0.5 flex-1 bg-[#333] mt-1" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: event.isActive ? COLORS.primary : COLORS.text }}
                        >
                          {event.title}
                        </Text>
                        {event.time ? (
                          <Text className="text-[#5C6068] text-xs mt-0.5">{event.time}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </View>

                {canModify && (
                  <View className="flex-row gap-3 mb-2">
                    <TouchableOpacity
                      onPress={handleModify}
                      className="flex-1 py-3.5 rounded-xl border border-[#2A2B2F] items-center bg-[#111214]"
                    >
                      <Text className="text-white font-semibold">Modify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancel}
                      className="flex-1 py-3.5 rounded-xl border items-center"
                      style={{ borderColor: `${COLORS.sell}55`, backgroundColor: `${COLORS.sell}12` }}
                    >
                      <Text className="font-semibold" style={{ color: COLORS.sell }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
