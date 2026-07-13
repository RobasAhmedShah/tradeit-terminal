import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
  const { colors } = useTheme();
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
            className="rounded-t-3xl border-t border-app-border max-h-[88%]"
            style={{ backgroundColor: colors.sheet, paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="items-center pt-2.5 pb-1">
              <View className="w-10 h-1 rounded-full bg-app-border" />
            </View>

            <View className="flex-row items-center justify-between px-5 py-2.5 border-b border-app-border">
              <Text className="text-app-text text-[16px] font-bold">Modify Order</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.muted} />
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
                  <Text className="text-app-muted text-sm">Order not found</Text>
                </View>
              ) : (
                <>
                  <View className="bg-app-card border border-app-border rounded-xl p-4 mb-4">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-app-text text-lg font-bold mr-2">{order.symbol}</Text>
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
                    <Text className="text-app-muted text-xs">{order.companyName}</Text>
                    <Text className="text-app-muted text-[11px] mt-2">
                      {order.type} · {order.status} · {order.id}
                    </Text>
                  </View>

                  {!canEdit ? (
                    <Text className="text-[#F6465D] text-sm mb-4 text-center">
                      This order can no longer be modified.
                    </Text>
                  ) : (
                    <>
                      <Text className="text-app-muted text-[10px] font-semibold uppercase tracking-wider mb-2">
                        Limit Price (PKR)
                      </Text>
                      <TextInput
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                        placeholderTextColor={colors.mutedDarker}
                        className="bg-app-input border border-app-border rounded-xl px-4 py-3 text-app-text text-base mb-4"
                      />

                      <Text className="text-app-muted text-[10px] font-semibold uppercase tracking-wider mb-2">
                        Quantity
                      </Text>
                      <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="number-pad"
                        placeholderTextColor={colors.mutedDarker}
                        className="bg-app-input border border-app-border rounded-xl px-4 py-3 text-app-text text-base mb-5"
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
                    className="py-3.5 rounded-xl items-center border border-app-border mb-2"
                  >
                    <Text className="text-app-muted font-semibold text-sm">Cancel</Text>
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
