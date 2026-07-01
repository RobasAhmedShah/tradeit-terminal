import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { useFutures } from '../../context/FuturesContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { formatFuturesPrice } from '../../data/mockFutures';

type TransferDirection = 'spot-to-futures' | 'futures-to-spot';

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000];

interface TransferSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const TransferSheet: React.FC<TransferSheetProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { summary, transferCashToFutures, receiveTransferFromFutures } = usePortfolio();
  const { marginAvailable, addFuturesMargin, transferMarginToSpot } = useFutures();
  const { showAlert } = useAppAlert();

  const [direction, setDirection] = useState<TransferDirection>('spot-to-futures');
  const [amount, setAmount] = useState('');

  const parsed = parseFloat(amount.replace(/,/g, '')) || 0;
  const fromSpot = direction === 'spot-to-futures';
  const available = fromSpot ? summary.buyingPower : marginAvailable;
  const availableLabel = fromSpot
    ? `Rs ${formatPortfolioRs(available)}`
    : formatFuturesPrice(available);

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  const handleTransfer = () => {
    if (parsed <= 0) {
      showAlert('Invalid amount', 'Enter a valid transfer amount.', undefined, { tone: 'warning' });
      return;
    }
    if (parsed > available) {
      showAlert(
        'Insufficient balance',
        `You only have ${availableLabel} available in your ${fromSpot ? 'Spot' : 'Futures'} wallet.`,
        undefined,
        { tone: 'warning' }
      );
      return;
    }

    if (fromSpot) {
      const ok = transferCashToFutures(parsed);
      if (!ok) {
        showAlert('Transfer failed', 'Could not debit spot buying power.', undefined, { tone: 'error' });
        return;
      }
      addFuturesMargin(parsed);
    } else {
      const ok = transferMarginToSpot(parsed);
      if (!ok) {
        showAlert('Transfer failed', 'Could not debit futures margin.', undefined, { tone: 'error' });
        return;
      }
      receiveTransferFromFutures(parsed);
    }

    showAlert(
      'Transfer complete',
      fromSpot
        ? `Rs ${formatPortfolioRs(parsed)} moved to futures margin.`
        : `Rs ${formatPortfolioRs(parsed)} moved to spot buying power.`,
      [{ text: 'Done', onPress: handleClose }],
      { tone: 'success' }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleClose} />

          <View className="bg-[#161719] rounded-t-3xl border-t border-[#25272D] max-h-[88%]">
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
            </View>

            <View className="flex-row items-center justify-between px-5 py-3">
              <Text className="text-white text-[16px] font-bold">Transfer</Text>
              <TouchableOpacity onPress={handleClose} className="w-8 h-8 items-center justify-center">
                <Ionicons name="close" size={22} color="#8A8D93" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              <View className="flex-row bg-[#1C1E22] border border-[#25272D] rounded-xl p-1 mb-4">
                <TouchableOpacity
                  onPress={() => setDirection('spot-to-futures')}
                  className={`flex-1 py-2.5 rounded-lg items-center ${fromSpot ? 'bg-[#FF8A00]' : ''}`}
                >
                  <Text className={`text-xs font-bold ${fromSpot ? 'text-black' : 'text-[#8A8D93]'}`}>
                    Spot → Futures
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDirection('futures-to-spot')}
                  className={`flex-1 py-2.5 rounded-lg items-center ${!fromSpot ? 'bg-[#FF8A00]' : ''}`}
                >
                  <Text className={`text-xs font-bold ${!fromSpot ? 'text-black' : 'text-[#8A8D93]'}`}>
                    Futures → Spot
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-[#1C1E22] border border-[#25272D] rounded-xl p-4 mb-4">
                <Text className="text-[#8A8D93] text-xs mb-1">From</Text>
                <Text className="text-white font-semibold mb-3">
                  {fromSpot ? 'Spot Wallet' : 'Futures Wallet'}
                </Text>
                <Text className="text-[#8A8D93] text-xs mb-1">To</Text>
                <Text className="text-white font-semibold mb-3">
                  {fromSpot ? 'Futures Wallet' : 'Spot Wallet'}
                </Text>
                <Text className="text-[#5C6068] text-[11px]">Available: {availableLabel}</Text>
              </View>

              <Text className="text-[#8A8D93] text-xs mb-2">Amount (PKR)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#555"
                className="bg-[#1C1E22] border border-[#25272D] rounded-xl px-4 py-3.5 text-white text-lg font-bold mb-3"
              />

              <View className="flex-row flex-wrap gap-2">
                {QUICK_AMOUNTS.map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setAmount(String(v))}
                    className="px-3 py-1.5 rounded-full border border-[#25272D] bg-[#1C1E22]"
                  >
                    <Text className="text-[#8A8D93] text-xs font-semibold">{v.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setAmount(String(Math.floor(available)))}
                  className="px-3 py-1.5 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10"
                >
                  <Text className="text-[#FF8A00] text-xs font-semibold">Max</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View
              className="px-5 pt-3 border-t border-[#25272D]"
              style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            >
              <TouchableOpacity onPress={handleTransfer} className="bg-[#FF8A00] rounded-2xl py-4 items-center">
                <Text className="text-black font-bold text-[15px]">Confirm Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
