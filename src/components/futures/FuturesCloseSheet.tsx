import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
import { useFutures } from '../../context/FuturesContext';
import { FuturesPosition, formatFuturesPrice } from '../../data/mockFutures';
import { COLORS } from '../../constants/theme';
import { hapticLight } from '../../utils/haptics';

interface CloseResult {
  symbol: string;
  side: string;
  sizeLots: number;
  closePrice: number;
  realizedPnl: number;
}

interface FuturesCloseSheetProps {
  visible: boolean;
  position: FuturesPosition | null;
  onClose: () => void;
}

const Row = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View className="flex-row justify-between py-3 border-b border-app-border">
    <Text className="text-app-muted text-sm font-semibold">{label}</Text>
    <Text
      className={`text-sm font-semibold ${valueColor ? '' : 'text-app-text'}`}
      style={valueColor ? { color: valueColor } : undefined}
    >
      {value}
    </Text>
  </View>
);

export const FuturesCloseSheet: React.FC<FuturesCloseSheetProps> = ({ visible, position, onClose }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { closePosition } = useFutures();
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [result, setResult] = useState<CloseResult | null>(null);

  useEffect(() => {
    if (visible) {
      setStep('review');
      setResult(null);
    }
  }, [visible, position?.id]);

  const handleDismiss = () => {
    setStep('review');
    setResult(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!position) return;
    hapticLight();
    const snapshot: CloseResult = {
      symbol: position.symbol,
      side: position.side,
      sizeLots: position.sizeLots,
      closePrice: position.markPrice,
      realizedPnl: position.unrealizedPnl,
    };
    closePosition(position);
    setResult(snapshot);
    setStep('success');
  };

  if (!position) return null;

  const isLong = position.side === 'Long';
  const closeSide = isLong ? 'Short' : 'Long';
  const estProceeds = position.markPrice * position.sizeLots;
  const isProfit = (result?.realizedPnl ?? 0) >= 0;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={handleDismiss}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="flex-1" onPress={step === 'review' ? handleDismiss : undefined} />

        <View
          className="rounded-t-3xl border-t border-app-border max-h-[88%]"
          style={{ backgroundColor: colors.sheet, paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center pt-2.5 pb-1">
            <View className="w-10 h-1 rounded-full bg-app-border" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-2.5 border-b border-app-border">
            <Text className="text-app-text text-[16px] font-bold">
              {step === 'review' ? 'Close Position' : 'Position Closed'}
            </Text>
            <TouchableOpacity onPress={handleDismiss} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          >
            {step === 'review' ? (
              <>
                <Text className="text-app-muted text-xs text-center mb-4">
                  You are closing your {position.side.toLowerCase()} position at market price
                </Text>

                <View className="bg-app-card rounded-xl p-4 mb-4 border border-app-border">
                  <Row label="Contract" value={position.symbol} />
                  <Row
                    label="Position Side"
                    value={position.side}
                    valueColor={isLong ? COLORS.buy : COLORS.sell}
                  />
                  <Row label="Close Action" value={`Market ${closeSide}`} />
                  <Row label="Size (Lots)" value={String(position.sizeLots)} />
                  <Row label="Entry Price" value={formatFuturesPrice(position.entryPrice)} />
                  <Row label="Close Price (Mark)" value={formatFuturesPrice(position.markPrice)} />
                  <View className="flex-row justify-between pt-3">
                    <Text className="text-app-text text-sm font-bold">Est. Realized PnL</Text>
                    <Text
                      className="text-sm font-bold"
                      style={{ color: position.unrealizedPnl >= 0 ? COLORS.buy : COLORS.sell }}
                    >
                      {position.unrealizedPnl >= 0 ? '+' : ''}
                      {formatFuturesPrice(position.unrealizedPnl)}
                    </Text>
                  </View>
                </View>

                <View className="bg-app-card rounded-xl p-4 mb-5 border border-app-border">
                  <View className="flex-row justify-between">
                    <Text className="text-app-muted text-xs">Est. Close Value</Text>
                    <Text className="text-app-text text-xs font-semibold">{formatFuturesPrice(estProceeds)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleConfirm}
                  className="py-3.5 rounded-xl items-center mb-3"
                  style={{ backgroundColor: COLORS.sell }}
                >
                  <Text className="text-app-text font-bold text-base">Confirm Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDismiss}
                  className="py-3.5 rounded-xl items-center border border-[#FF8A00] mb-2"
                >
                  <Text className="text-[#FF8A00] font-bold text-sm">Keep Position</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="items-center mb-6">
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${COLORS.buy}18` }}
                  >
                    <Ionicons name="checkmark" size={28} color={COLORS.buy} />
                  </View>
                  <Text className="text-app-text text-lg font-bold mb-1">Position Closed</Text>
                  <Text className="text-app-muted text-xs text-center">
                    Your {result?.side.toLowerCase()} {result?.symbol} position has been closed at market
                  </Text>
                </View>

                {result && (
                  <View className="bg-app-card rounded-xl p-4 mb-5 border border-app-border">
                    <Row label="Contract" value={result.symbol} />
                    <Row label="Closed Size" value={`${result.sizeLots} lots`} />
                    <Row label="Close Price" value={formatFuturesPrice(result.closePrice)} />
                    <View className="flex-row justify-between pt-3">
                      <Text className="text-app-text text-sm font-bold">Realized PnL</Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: isProfit ? COLORS.buy : COLORS.sell }}
                      >
                        {isProfit ? '+' : ''}
                        {formatFuturesPrice(result.realizedPnl)}
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleDismiss}
                  className="py-3.5 rounded-xl items-center mb-2"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Text className="text-black font-bold text-base">Done</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
