import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { useFutures } from '../../context/FuturesContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { formatFuturesPrice } from '../../data/mockFutures';
import { NumericKeypad } from '../ui/NumericKeypad';

type TransferDirection = 'spot-to-futures' | 'futures-to-spot';

const MAX_AMOUNT_DIGITS = 10;
const PRIMARY = '#FF8A00';

interface TransferSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const TransferSheet: React.FC<TransferSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { summary, transferCashToFutures, receiveTransferFromFutures } = usePortfolio();
  const { marginAvailable, addFuturesMargin, transferMarginToSpot } = useFutures();
  const { showAlert } = useAppAlert();

  const [direction, setDirection] = useState<TransferDirection>('spot-to-futures');
  const [amount, setAmount] = useState('');

  const parsed = parseFloat(amount) || 0;
  const fromSpot = direction === 'spot-to-futures';
  const available = fromSpot ? summary.buyingPower : marginAvailable;
  const availableLabel = fromSpot
    ? `Rs ${formatPortfolioRs(available)}`
    : formatFuturesPrice(available);
  const exceeds = parsed > available;

  const appendAmountDigit = (key: string) => {
    if (key === '.') {
      if (amount.includes('.')) return;
      setAmount((prev) => (prev === '' ? '0.' : `${prev}.`));
      return;
    }

    if (amount.includes('.')) {
      const [, decimals = ''] = amount.split('.');
      if (decimals.length >= 2) return;
    } else if (amount.length >= MAX_AMOUNT_DIGITS) {
      return;
    }

    setAmount((prev) => {
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const backspaceAmount = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const setMaxAmount = () => {
    if (available <= 0) {
      setAmount('');
      return;
    }
    setAmount(String(Math.floor(available * 100) / 100));
  };

  const formattedAmountInput = (() => {
    if (!amount) return '0';
    if (amount.endsWith('.')) {
      const intPart = parseInt(amount.slice(0, -1) || '0', 10).toLocaleString();
      return `${intPart}.`;
    }
    const [whole, fraction] = amount.split('.');
    const intPart = parseInt(whole || '0', 10).toLocaleString();
    return fraction != null ? `${intPart}.${fraction}` : intPart;
  })();

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
      <View className="flex-1 bg-black/70 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleClose} />

        <View className="bg-app-sheet rounded-t-3xl border-t border-app-border max-h-[92%]">
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-app-border" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-3">
            <Text className="text-app-text text-[16px] font-bold">Transfer</Text>
            <TouchableOpacity onPress={handleClose} className="w-8 h-8 items-center justify-center">
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
          >
            <View className="flex-row bg-app-input border border-app-border rounded-xl p-1 mb-4">
              <TouchableOpacity
                onPress={() => { setDirection('spot-to-futures'); setAmount(''); }}
                className={`flex-1 py-2.5 rounded-lg items-center ${fromSpot ? 'bg-[#FF8A00]' : ''}`}
              >
                <Text className={`text-xs font-bold ${fromSpot ? 'text-black' : 'text-app-muted'}`}>
                  Spot → Futures
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setDirection('futures-to-spot'); setAmount(''); }}
                className={`flex-1 py-2.5 rounded-lg items-center ${!fromSpot ? 'bg-[#FF8A00]' : ''}`}
              >
                <Text className={`text-xs font-bold ${!fromSpot ? 'text-black' : 'text-app-muted'}`}>
                  Futures → Spot
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-app-input border border-app-border rounded-xl p-4 mb-4">
              <Text className="text-app-muted text-xs mb-1">From</Text>
              <Text className="text-app-text font-semibold mb-3">
                {fromSpot ? 'Spot Wallet' : 'Futures Wallet'}
              </Text>
              <Text className="text-app-muted text-xs mb-1">To</Text>
              <Text className="text-app-text font-semibold mb-3">
                {fromSpot ? 'Futures Wallet' : 'Spot Wallet'}
              </Text>
              <TouchableOpacity onPress={setMaxAmount} hitSlop={8}>
                <Text style={{ color: PRIMARY, fontSize: 11, fontWeight: '700' }}>
                  Max · Available: {availableLabel}
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-app-muted text-xs mb-2">Amount (PKR)</Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingVertical: 18,
                paddingHorizontal: 14,
                borderWidth: 1.5,
                borderColor: amount ? PRIMARY : colors.border,
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: '700', color: amount ? colors.text : colors.mutedDarker }}>
                {formattedAmountInput}
              </Text>
            </View>

            {exceeds && parsed > 0 ? (
              <Text style={{ color: '#ef4444', fontSize: 11, marginBottom: 8 }}>
                Amount exceeds available balance ({availableLabel}).
              </Text>
            ) : null}

            <NumericKeypad onDigit={appendAmountDigit} onBackspace={backspaceAmount} />
          </ScrollView>

          <View
            className="px-5 pt-3 border-t border-app-border"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          >
            <TouchableOpacity
              onPress={handleTransfer}
              disabled={parsed <= 0 || exceeds}
              style={{ opacity: parsed <= 0 || exceeds ? 0.4 : 1 }}
              className="bg-[#FF8A00] rounded-2xl py-4 items-center"
            >
              <Text className="text-black font-bold text-[15px]">Confirm Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
