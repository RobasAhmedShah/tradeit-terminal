import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const FAQ = [
  {
    q: 'Where do withdrawals come from?',
    a: 'Withdrawals debit your Spot wallet only. Transfer funds from Futures to Spot first if needed.',
  },
  {
    q: 'How long does a bank withdrawal take?',
    a: 'Bank transfers are usually processed within 24 hours on working days after verification.',
  },
  {
    q: 'How fast are EasyPaisa / JazzCash?',
    a: 'Wallet withdrawals are typically processed within a few minutes once confirmed.',
  },
  {
    q: 'What is the minimum withdrawal?',
    a: 'PKR 10 minimum for all methods. Daily limit is PKR 500,000.',
  },
  {
    q: 'Are there fees?',
    a: 'TradeIt does not charge a withdrawal fee. Your bank or wallet provider may apply their own charges.',
  },
];

interface WithdrawHelpSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const WithdrawHelpSheet: React.FC<WithdrawHelpSheetProps> = ({ visible, onClose }) => {
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
            <Text className="text-app-text text-lg font-bold">Withdraw help</Text>
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
