import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

interface BuySellPanelProps {
  symbol: string;
  currentPrice: number;
}

export const BuySellPanel: React.FC<BuySellPanelProps> = ({ symbol, currentPrice }) => {
  const router = useRouter();
  const { summary, getHolding } = usePortfolio();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('Market');
  const [price, setPrice] = useState(currentPrice.toString());
  const [qty, setQty] = useState('10');

  const isBuy = side === 'buy';
  const mainColor = isBuy ? 'bg-[#00C853]' : 'bg-[#FF3B30]';
  const mainColorText = isBuy ? 'text-[#00C853]' : 'text-[#FF3B30]';

  const p = parseFloat(price || '0');
  const q = parseFloat(qty || '0');
  const tradeValue = p * q;
  const brokerage = tradeValue * 0.0015;
  const fed = tradeValue * 0.0001;
  const secp = tradeValue * 0.00005;
  const totalCost = tradeValue + brokerage + fed + secp;

  const buyingPower = summary.buyingPower;
  const estimatedCost = totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalCharges = (brokerage + fed + secp).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleCtaPress = () => {
    if (q <= 0 || p <= 0) {
      Alert.alert('Invalid order', 'Enter a valid price and quantity.');
      return;
    }

    const holding = getHolding(symbol);

    if (!isBuy) {
      if (!holding || holding.qty < q) {
        Alert.alert(
          'Insufficient shares',
          `You only own ${holding?.qty?.toFixed(0) ?? 0} shares of ${symbol}.`
        );
        return;
      }
    } else if (totalCost > buyingPower) {
      Alert.alert(
        'Insufficient buying power',
        `You need Rs ${formatPortfolioRs(totalCost)} but only have Rs ${formatPortfolioRs(buyingPower)} available. Deposit funds first.`
      );
      return;
    }

    const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === symbol);

    const jsorderParams = {
      symbol,
      companyName: stock?.name || '',
      side: isBuy ? 'BUY' : 'SELL',
      orderType,
      price: p,
      quantity: q,
      brokerage,
      fed,
      secp,
      totalCost,
      availableBalance: buyingPower,
    };

    router.push({
      pathname: '/order-review',
      params: { data: JSON.stringify(jsorderParams) },
    });
  };

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] p-2.5">
      <View className="flex-row bg-[#18191C] rounded-lg p-1 mb-3 border border-[#2A2B2F]">
        <TouchableOpacity
          onPress={() => setSide('buy')}
          className={`flex-1 items-center py-1.5 rounded-md ${isBuy ? 'bg-[#00C853]' : ''}`}
        >
          <Text className={`font-bold text-xs ${isBuy ? 'text-black' : 'text-white'}`}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSide('sell')}
          className={`flex-1 items-center py-1.5 rounded-md ${!isBuy ? 'bg-[#FF3B30]' : ''}`}
        >
          <Text className={`font-bold text-xs ${!isBuy ? 'text-white' : 'text-[#9CA3AF]'}`}>Sell</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row gap-2">
          {['Limit', 'Market', 'Stop Limit'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setOrderType(type)}
              className={`px-2 py-1 rounded-md ${orderType === type ? 'bg-[#18191C] border border-[#2A2B2F]' : ''}`}
            >
              <Text className={`text-[10px] font-semibold ${orderType === type ? mainColorText : 'text-[#9CA3AF]'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Ionicons name="information-circle-outline" size={12} color="#9CA3AF" />
      </View>

      <View className="mb-2">
        <Text className="text-[#9CA3AF] text-[9px] mb-1">Price (PKR)</Text>
        <View className="bg-[#18191C] border border-[#2A2B2F] rounded-lg flex-row items-center h-10">
          <TouchableOpacity className="px-3 h-full justify-center border-r border-[#2A2B2F]">
            <Ionicons name="remove" size={14} color="#9CA3AF" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              className="text-white font-bold text-sm text-center w-full"
            />
          </View>
          <TouchableOpacity className="px-3 h-full justify-center border-l border-[#2A2B2F]">
            <Ionicons name="add" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-[#9CA3AF] text-[9px] mb-1">Qty (Shares)</Text>
        <View className="bg-[#18191C] border border-[#2A2B2F] rounded-lg flex-row items-center h-10">
          <TouchableOpacity className="px-3 h-full justify-center border-r border-[#2A2B2F]">
            <Ionicons name="remove" size={14} color="#9CA3AF" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <TextInput
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              className="text-white font-bold text-sm text-center w-full"
            />
          </View>
          <TouchableOpacity className="px-3 h-full justify-center border-l border-[#2A2B2F]">
            <Ionicons name="add" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="space-y-1.5 mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#9CA3AF] text-[9px]">
            {isBuy ? 'Buying Power' : 'Shares Owned'}
          </Text>
          <Text className="text-[#FF8A00] text-[11px] font-semibold">
            {isBuy
              ? `Rs ${formatPortfolioRs(buyingPower)}`
              : `${getHolding(symbol)?.qty?.toFixed(0) ?? 0} shares`}
          </Text>
        </View>
      </View>

      <View className="border-t border-[#2A2B2F] pt-2.5 mb-4">
        <View className="flex-row justify-between items-center mb-0.5">
          <Text className="text-[#9CA3AF] text-[10px] mr-1">Estimated Cost</Text>
          <Text className="text-white text-sm font-bold">Rs {estimatedCost}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#9CA3AF] text-[8px]">Includes charges & tax</Text>
          <Text className="text-[#9CA3AF] text-[8px]">Rs {totalCharges}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCtaPress}
        className={`${isBuy ? 'bg-[#FF8A00]' : 'bg-[#FF3B30]'} rounded-xl py-3 items-center`}
      >
        <Text className={`font-bold text-sm ${isBuy ? 'text-black' : 'text-white'}`}>
          {isBuy ? 'Buy' : 'Sell'} {symbol}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
