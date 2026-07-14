import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const FAQ = [
  {
    q: 'Where do deposits go?',
    a: 'All deposits land in your Spot wallet and increase buying power. Transfer to Futures after the deposit clears.',
  },
  {
    q: 'How long does verification take?',
    a: 'Bank transfers: 10–30 minutes after receipt upload. EasyPaisa, JazzCash, and Raast are usually faster.',
  },
  {
    q: 'What is the minimum deposit?',
    a: 'PKR 10 minimum for all methods.',
  },
  {
    q: 'Are there fees?',
    a: 'Bank transfer deposits are free. Wallet and Raast fees may apply per your provider.',
  },
  {
    q: 'Why is my deposit still processing?',
    a: 'We verify your payment against the reference and amount. You will get a notification when funds are credited.',
  },
];

interface DepositHelpSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const DepositHelpSheet: React.FC<DepositHelpSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        <View
          className="bg-app-sheet rounded-t-3xl border-t border-app-border px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16), maxHeight: '75%' }}
        >
          <View className="items-center mb-3">
            <View className="w-10 h-1 rounded-full bg-app-border" />
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-app-text text-lg font-bold">Deposit help</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {FAQ.map((item) => (
              <View key={item.q} className="mb-4 pb-4 border-b border-app-border">
                <Text className="text-app-text text-sm font-semibold mb-1.5">{item.q}</Text>
                <Text className="text-app-muted text-xs leading-5">{item.a}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
