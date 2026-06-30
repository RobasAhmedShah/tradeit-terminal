import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePriceAlerts } from '../../context/PriceAlertsContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { PriceAlertCondition } from '../../utils/priceAlertPrefs';
import { hapticLight, hapticSelection } from '../../utils/haptics';

const ACCENT = '#FF8A00';

interface PriceAlertSheetProps {
  visible: boolean;
  presetSymbol?: string | null;
  onClose: () => void;
}

export const PriceAlertSheet: React.FC<PriceAlertSheetProps> = ({ visible, presetSymbol, onClose }) => {
  const { addAlert } = usePriceAlerts();
  const { showAlert } = useAppAlert();

  const [symbol, setSymbol] = useState(presetSymbol ?? '');
  const [condition, setCondition] = useState<PriceAlertCondition>('above');
  const [priceInput, setPriceInput] = useState('');

  const stock = useMemo(
    () => MOCK_MARKET_STOCKS.find((s) => s.symbol.toUpperCase() === symbol.trim().toUpperCase()),
    [symbol]
  );

  useEffect(() => {
    if (!visible) return;
    const preset = presetSymbol ?? '';
    setSymbol(preset);
    setCondition('above');
    const presetStock = MOCK_MARKET_STOCKS.find((s) => s.symbol === preset);
    setPriceInput(presetStock ? String(presetStock.price) : '');
  }, [visible, presetSymbol]);

  const targetPrice = parseFloat(priceInput.replace(/,/g, '')) || 0;
  const isValid = symbol.trim().length > 0 && targetPrice > 0 && !!stock;

  const handleSave = () => {
    if (!stock || targetPrice <= 0) {
      showAlert('Invalid alert', 'Enter a valid symbol and target price.', undefined, { tone: 'warning' });
      return;
    }
    hapticLight();
    addAlert({ symbol: stock.symbol, name: stock.name, condition, targetPrice });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 bg-black/70 justify-end">
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />

          <View className="bg-[#161719] rounded-t-3xl border-t border-[#25272D] max-h-[90%]">
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
            </View>

            <View className="flex-row items-center justify-between px-5 py-3">
              <Text className="text-white text-[16px] font-bold">New Price Alert</Text>
              <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center">
                <Ionicons name="close" size={22} color="#8A8D93" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 28 }}
            >
              {/* Symbol */}
              <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">Symbol</Text>
              <View className="bg-[#1C1E22] border border-[#25272D] rounded-xl px-3 py-3 mb-1 flex-row items-center">
                <TextInput
                  value={symbol}
                  onChangeText={(t) => setSymbol(t.toUpperCase())}
                  placeholder="e.g. SAZEW"
                  placeholderTextColor="#444"
                  autoCapitalize="characters"
                  editable={!presetSymbol}
                  className="flex-1 text-white text-[15px] font-bold py-0"
                />
                {stock && (
                  <Text className="text-[#8A8D93] text-[11px] ml-2" numberOfLines={1}>
                    Rs {stock.price.toFixed(2)}
                  </Text>
                )}
              </View>
              {symbol.trim() && !stock ? (
                <Text className="text-[#F6465D] text-[11px] mb-3 mt-1">Symbol not found in market list.</Text>
              ) : stock ? (
                <Text className="text-[#5C6068] text-[12px] mb-3 mt-1" numberOfLines={1}>
                  {stock.name}
                </Text>
              ) : (
                <View className="mb-3" />
              )}

              {/* Condition */}
              <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">Condition</Text>
              <View className="flex-row gap-2 mb-4">
                {(['above', 'below'] as const).map((c) => {
                  const active = condition === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => {
                        hapticSelection();
                        setCondition(c);
                      }}
                      className={`flex-1 py-3 rounded-xl border items-center ${
                        active ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#25272D] bg-[#1C1E22]'
                      }`}
                    >
                      <Text className={`text-[13px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-[#8A8D93]'}`}>
                        {c === 'above' ? 'Rises above' : 'Falls below'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Target price */}
              <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">
                Target Price (PKR)
              </Text>
              <View className="bg-[#1C1E22] border border-[#25272D] rounded-xl px-3 py-3 mb-4 flex-row items-center">
                <Text className="text-[#8A8D93] text-[15px] mr-2">Rs</Text>
                <TextInput
                  value={priceInput}
                  onChangeText={setPriceInput}
                  placeholder="0.00"
                  placeholderTextColor="#444"
                  keyboardType="decimal-pad"
                  className="flex-1 text-white text-[15px] font-bold py-0"
                />
              </View>

              {stock && targetPrice > 0 && (
                <View className="bg-[#1C1E22] border border-[#25272D] rounded-xl p-3 mb-5">
                  <Text className="text-[#8A8D93] text-[12px] leading-5">
                    Notify when <Text className="text-white font-semibold">{stock.symbol}</Text>{' '}
                    {condition === 'above' ? 'rises above' : 'falls below'}{' '}
                    <Text className="font-semibold" style={{ color: ACCENT }}>
                      Rs {targetPrice.toFixed(2)}
                    </Text>
                    . Current: Rs {stock.price.toFixed(2)}.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSave}
                disabled={!isValid}
                className="rounded-2xl py-4 items-center"
                style={{ backgroundColor: isValid ? ACCENT : '#25272D' }}
              >
                <Text className={`font-bold text-[15px] ${isValid ? 'text-black' : 'text-[#5C6068]'}`}>
                  Create Alert
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
