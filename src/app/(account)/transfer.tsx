import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { useFutures } from '../../context/FuturesContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { formatFuturesPrice } from '../../data/mockFutures';

type TransferDirection = 'spot-to-futures' | 'futures-to-spot';

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000];

export default function TransferScreen() {
  const router = useRouter();
  const { summary, transferCashToFutures, receiveTransferFromFutures } = usePortfolio();
  const { marginAvailable, addFuturesMargin, transferMarginToSpot } = useFutures();

  const [direction, setDirection] = useState<TransferDirection>('spot-to-futures');
  const [amount, setAmount] = useState('');

  const parsed = parseFloat(amount.replace(/,/g, '')) || 0;
  const fromSpot = direction === 'spot-to-futures';
  const available = fromSpot ? summary.buyingPower : marginAvailable;
  const availableLabel = fromSpot
    ? `Rs ${formatPortfolioRs(available)}`
    : formatFuturesPrice(available);

  const handleTransfer = () => {
    if (parsed <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid transfer amount.');
      return;
    }
    if (parsed > available) {
      Alert.alert('Insufficient balance', `You only have ${availableLabel} available.`);
      return;
    }

    if (fromSpot) {
      const ok = transferCashToFutures(parsed);
      if (!ok) {
        Alert.alert('Transfer failed', 'Could not debit spot buying power.');
        return;
      }
      addFuturesMargin(parsed);
    } else {
      const ok = transferMarginToSpot(parsed);
      if (!ok) {
        Alert.alert('Transfer failed', 'Could not debit futures margin.');
        return;
      }
      receiveTransferFromFutures(parsed);
    }

    Alert.alert(
      'Transfer complete',
      fromSpot
        ? `Rs ${formatPortfolioRs(parsed)} moved to futures margin.`
        : `Rs ${formatPortfolioRs(parsed)} moved to spot buying power.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#1a1a1a]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#e0e0e0" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[16px] font-semibold mr-10">Transfer</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-5 flex-row items-start">
          <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" style={{ marginTop: 2, marginRight: 8 }} />
          <Text className="text-[#9CA3AF] text-[11px] flex-1 leading-5">
            Move funds between Spot and Futures wallets instantly. External deposits and withdrawals only touch Spot — like Binance.
          </Text>
        </View>

        <View className="flex-row bg-[#111214] border border-[#2A2B2F] rounded-xl p-1 mb-5">
          <TouchableOpacity
            onPress={() => setDirection('spot-to-futures')}
            className={`flex-1 py-2.5 rounded-lg items-center ${fromSpot ? 'bg-[#FF8A00]' : ''}`}
          >
            <Text className={`text-xs font-bold ${fromSpot ? 'text-black' : 'text-[#9CA3AF]'}`}>Spot → Futures</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDirection('futures-to-spot')}
            className={`flex-1 py-2.5 rounded-lg items-center ${!fromSpot ? 'bg-[#FF8A00]' : ''}`}
          >
            <Text className={`text-xs font-bold ${!fromSpot ? 'text-black' : 'text-[#9CA3AF]'}`}>Futures → Spot</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-4">
          <Text className="text-[#9CA3AF] text-xs mb-1">From</Text>
          <Text className="text-white font-semibold mb-3">{fromSpot ? 'Spot Wallet' : 'Futures Wallet'}</Text>
          <Text className="text-[#9CA3AF] text-xs mb-1">To</Text>
          <Text className="text-white font-semibold mb-3">{fromSpot ? 'Futures Wallet' : 'Spot Wallet'}</Text>
          <Text className="text-[#666] text-[11px]">Available: {availableLabel}</Text>
        </View>

        <Text className="text-[#9CA3AF] text-xs mb-2">Amount (PKR)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#555"
          className="bg-[#111214] border border-[#2A2B2F] rounded-xl px-4 py-3.5 text-white text-lg font-bold mb-3"
        />

        <View className="flex-row flex-wrap gap-2 mb-6">
          {QUICK_AMOUNTS.map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setAmount(String(v))}
              className="px-3 py-1.5 rounded-full border border-[#2A2B2F] bg-[#111214]"
            >
              <Text className="text-[#9CA3AF] text-xs font-semibold">{v.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setAmount(String(Math.floor(available)))}
            className="px-3 py-1.5 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10"
          >
            <Text className="text-[#FF8A00] text-xs font-semibold">Max</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleTransfer} className="bg-[#FF8A00] rounded-xl py-4 items-center mb-4">
          <Text className="text-black font-bold text-base">Confirm Transfer</Text>
        </TouchableOpacity>

        <Text className="text-[#555] text-[11px] text-center leading-5 px-2">
          Internal transfers are instant with no fees. Deposit to Spot first, then transfer here to trade futures.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
