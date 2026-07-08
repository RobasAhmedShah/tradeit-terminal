import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { COLORS } from '../../constants/theme';
import { hapticLight } from '../../utils/haptics';

interface EditOrderSheetProps {
  visible: boolean;
  orderId: string | null;
  onClose: () => void;
}

const EDITABLE_STATUSES = ['Pending', 'Partially Filled', 'Queued'];

export const EditOrderSheet: React.FC<EditOrderSheetProps> = ({ visible, orderId, onClose }) => {
  const insets = useSafeAreaInsets();
  const { getOrder, updateOrder } = useOrders();
  const { showAlert } = useAppAlert();

  const order = orderId ? getOrder(orderId) : undefined;
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!visible || !order) return;
    setPrice(String(order.price));
    setQuantity(String(order.quantity));
  }, [visible, order?.id, order?.price, order?.quantity]);

  const canEdit = order ? EDITABLE_STATUSES.includes(order.status) : false;
  const isBuy = order?.side === 'BUY';

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!order || !canEdit) return;
    const nextPrice = parseFloat(price);
    const nextQty = parseInt(quantity, 10);
    if (!nextPrice || nextPrice <= 0 || !nextQty || nextQty <= 0) {
      showAlert('Invalid values', 'Enter a valid price and quantity.', undefined, { tone: 'warning' });
      return;
    }
    hapticLight();
    updateOrder(order.id, { price: nextPrice, quantity: nextQty });
    showAlert('Order updated', 'Your limit order has been modified.', [{ text: 'OK', onPress: handleClose }], {
      tone: 'success',
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable className="flex-1" onPress={handleClose} />

          <View
            className="rounded-t-3xl border-t border-[#25272D] max-h-[88%]"
            style={{ backgroundColor: COLORS.sheet, paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="items-center pt-2.5 pb-1">
              <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
            </View>

            <View className="flex-row items-center justify-between px-5 py-2.5 border-b border-[#25272D]">
              <Text className="text-white text-[16px] font-bold">Modify Order</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={8}>
                <Ionicons name="close" size={22} color="#8A8D93" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            >
              {!order ? (
                <View className="py-8 items-center">
                  <Text className="text-[#8A8D93] text-sm">Order not found</Text>
                </View>
              ) : (
                <>
                  <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-white text-lg font-bold mr-2">{order.symbol}</Text>
                      <View
                        className="px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: isBuy ? `${COLORS.buy}18` : `${COLORS.sell}18`,
                          borderColor: isBuy ? `${COLORS.buy}40` : `${COLORS.sell}40`,
                        }}
                      >
                        <Text
                          className="text-[11px] font-bold"
                          style={{ color: isBuy ? COLORS.buy : COLORS.sell }}
                        >
                          {order.side}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[#8A8D93] text-xs">{order.companyName}</Text>
                    <Text className="text-[#5C6068] text-[11px] mt-2">
                      {order.type} · {order.status} · {order.id}
                    </Text>
                  </View>

                  {!canEdit ? (
                    <Text className="text-[#F6465D] text-sm mb-4 text-center">
                      This order can no longer be modified.
                    </Text>
                  ) : (
                    <>
                      <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">
                        Limit Price (PKR)
                      </Text>
                      <TextInput
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                        placeholderTextColor={COLORS.mutedDarker}
                        className="bg-[#1C1E22] border border-[#25272D] rounded-xl px-4 py-3 text-white text-base mb-4"
                      />

                      <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">
                        Quantity
                      </Text>
                      <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="number-pad"
                        placeholderTextColor={COLORS.mutedDarker}
                        className="bg-[#1C1E22] border border-[#25272D] rounded-xl px-4 py-3 text-white text-base mb-5"
                      />

                      <TouchableOpacity
                        onPress={handleSave}
                        className="py-3.5 rounded-xl items-center mb-2"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <Text className="text-black font-bold text-base">Save Changes</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    onPress={handleClose}
                    className="py-3.5 rounded-xl items-center border border-[#2A2B2F] mb-2"
                  >
                    <Text className="text-[#8A8D93] font-semibold text-sm">Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
