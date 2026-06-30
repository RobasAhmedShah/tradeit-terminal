import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePriceAlerts } from '../../context/PriceAlertsContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { PriceAlertCondition } from '../../utils/priceAlertPrefs';
import { hapticLight, hapticSelection } from '../../utils/haptics';

export default function CreatePriceAlertScreen() {
  const router = useRouter();
  const { symbol: symbolParam, id: editId } = useLocalSearchParams<{ symbol?: string; id?: string }>();
  const { alerts, addAlert, updateAlert, removeAlert } = usePriceAlerts();
  const { showAlert } = useAppAlert();

  const existing = editId ? alerts.find((a) => a.id === editId) : undefined;
  const prefilledStock = useMemo(() => {
    const sym = existing?.symbol ?? symbolParam;
    return sym ? MOCK_MARKET_STOCKS.find((s) => s.symbol === sym) : undefined;
  }, [existing, symbolParam]);

  const [symbol, setSymbol] = useState(existing?.symbol ?? symbolParam ?? '');
  const [condition, setCondition] = useState<PriceAlertCondition>(existing?.condition ?? 'above');
  const [priceInput, setPriceInput] = useState(
    existing ? String(existing.targetPrice) : prefilledStock ? String(prefilledStock.price) : ''
  );

  const stock = MOCK_MARKET_STOCKS.find(
    (s) => s.symbol.toUpperCase() === symbol.trim().toUpperCase()
  );

  useEffect(() => {
    if (existing) return;
    if (prefilledStock && !priceInput) {
      setPriceInput(String(prefilledStock.price));
    }
  }, [prefilledStock, existing, priceInput]);

  const targetPrice = parseFloat(priceInput.replace(/,/g, '')) || 0;
  const isValid = symbol.trim().length > 0 && targetPrice > 0 && !!stock;

  const handleSave = () => {
    if (!stock || targetPrice <= 0) {
      showAlert('Invalid alert', 'Enter a valid symbol and target price.', undefined, { tone: 'warning' });
      return;
    }

    hapticLight();

    if (existing) {
      updateAlert(existing.id, { condition, targetPrice });
      router.back();
      return;
    }

    addAlert({
      symbol: stock.symbol,
      name: stock.name,
      condition,
      targetPrice,
    });
    router.replace('/alerts');
  };

  const handleDelete = () => {
    if (!existing) return;
    showAlert(
      'Delete Alert',
      `Remove alert for ${existing.symbol}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAlert(existing.id);
            router.back();
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#141414]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[17px] font-bold">
          {existing ? 'Edit Alert' : 'New Alert'}
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Symbol */}
          <Text className="text-[#555] text-[10px] font-semibold uppercase tracking-wider mb-2">
            Symbol
          </Text>
          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl px-3 py-3 mb-4 flex-row items-center">
            <TextInput
              value={symbol}
              onChangeText={(t) => setSymbol(t.toUpperCase())}
              placeholder="e.g. SAZEW"
              placeholderTextColor="#444"
              autoCapitalize="characters"
              editable={!existing && !symbolParam}
              className="flex-1 text-white text-[15px] font-bold py-0"
            />
            {stock && (
              <Text className="text-[#666] text-[11px] ml-2" numberOfLines={1}>
                Rs {stock.price.toFixed(2)}
              </Text>
            )}
          </View>
          {symbol.trim() && !stock && (
            <Text className="text-[#FF3B30] text-[11px] mb-4 -mt-2">Symbol not found in market list.</Text>
          )}
          {stock && (
            <Text className="text-[#555] text-[12px] mb-4 -mt-1" numberOfLines={1}>
              {stock.name}
            </Text>
          )}

          {/* Condition */}
          <Text className="text-[#555] text-[10px] font-semibold uppercase tracking-wider mb-2">
            Condition
          </Text>
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
                    active ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#111214]'
                  }`}
                >
                  <Text className={`text-[13px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                    {c === 'above' ? 'Price rises above' : 'Price falls below'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Target price */}
          <Text className="text-[#555] text-[10px] font-semibold uppercase tracking-wider mb-2">
            Target Price (PKR)
          </Text>
          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl px-3 py-3 mb-6 flex-row items-center">
            <Text className="text-[#666] text-[15px] mr-2">Rs</Text>
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
            <View className="bg-[#18191C] border border-[#2A2B2F] rounded-xl p-3 mb-6">
              <Text className="text-[#9CA3AF] text-[12px] leading-5">
                Notify when{' '}
                <Text className="text-white font-semibold">{stock.symbol}</Text>{' '}
                {condition === 'above' ? 'rises above' : 'falls below'}{' '}
                <Text className="text-[#FF8A00] font-semibold">Rs {targetPrice.toFixed(2)}</Text>
                . Current price: Rs {stock.price.toFixed(2)}.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            className={`rounded-xl py-4 items-center mb-3 ${isValid ? 'bg-[#FF8A00]' : 'bg-[#2A2B2F]'}`}
          >
            <Text className={`font-bold text-[15px] ${isValid ? 'text-black' : 'text-[#666]'}`}>
              {existing ? 'Save Changes' : 'Create Alert'}
            </Text>
          </TouchableOpacity>

          {existing && (
            <TouchableOpacity onPress={handleDelete} className="py-3 items-center">
              <Text className="text-[#FF3B30] text-[14px] font-semibold">Delete Alert</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
