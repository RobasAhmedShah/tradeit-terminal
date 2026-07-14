import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

import { usePortfolio } from '../../context/PortfolioContext';
import { useMarketPrices } from '../../context/MarketPricesContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { SpotOrderSheet, SpotOrderInput } from './SpotOrderSheet';

interface BuySellPanelProps {
  symbol: string;
  currentPrice: number;
  bookPriceFill?: number | null;
  onBookPriceFillConsumed?: () => void;
}

export const BuySellPanel: React.FC<BuySellPanelProps> = ({
  symbol,
  currentPrice,
  bookPriceFill,
  onBookPriceFillConsumed,
}) => {
  const { summary, getHolding } = usePortfolio();
  const { getStock } = useMarketPrices();
  const { showAlert } = useAppAlert();
  const router = useRouter();
  const { colors } = useTheme();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('Market');
  const [price, setPrice] = useState(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState('');
  const [qty, setQty] = useState('10');
  const [priceHintVisible, setPriceHintVisible] = useState(false);
  const [priceFieldHighlight, setPriceFieldHighlight] = useState(false);
  const [sheetOrder, setSheetOrder] = useState<SpotOrderInput | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    if (orderType === 'Market') {
      setPrice(currentPrice.toFixed(2));
    }
  }, [currentPrice, orderType]);

  useEffect(() => {
    if (bookPriceFill == null) return;
    setOrderType('Limit');
    setPrice(bookPriceFill.toFixed(2));
    setPriceHintVisible(true);
    setPriceFieldHighlight(true);
    onBookPriceFillConsumed?.();
    const hintTimer = setTimeout(() => setPriceHintVisible(false), 2500);
    const highlightTimer = setTimeout(() => setPriceFieldHighlight(false), 900);
    return () => {
      clearTimeout(hintTimer);
      clearTimeout(highlightTimer);
    };
  }, [bookPriceFill, onBookPriceFillConsumed]);

  const isBuy = side === 'buy';
  const mainColor = isBuy ? 'bg-[#0ECB81]' : 'bg-[#F6465D]';
  const mainColorText = isBuy ? 'text-[#0ECB81]' : 'text-[#F6465D]';

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

  const adjustPrice = (delta: number, field: 'price' | 'stop' = 'price') => {
    const tick = currentPrice >= 1000 ? 0.5 : currentPrice >= 100 ? 0.25 : 0.05;
    const base = parseFloat((field === 'stop' ? stopPrice : price) || '0') || currentPrice;
    const next = Math.max(tick, base + delta * tick);
    const formatted = next.toFixed(2);
    if (field === 'stop') setStopPrice(formatted);
    else {
      setPrice(formatted);
      if (orderType === 'Market') setOrderType('Limit');
    }
  };

  const initStopLimitDefaults = (nextSide: 'buy' | 'sell') => {
    const stop =
      nextSide === 'buy'
        ? (currentPrice * 1.02).toFixed(2)
        : (currentPrice * 0.98).toFixed(2);
    const limit =
      nextSide === 'buy'
        ? (currentPrice * 1.025).toFixed(2)
        : (currentPrice * 0.975).toFixed(2);
    setStopPrice(stop);
    setPrice(limit);
  };

  const handleCtaPress = () => {
    const stop = parseFloat(stopPrice || '0');

    if (orderType === 'Stop Limit') {
      if (!Number.isFinite(stop) || stop <= 0) {
        showAlert('Invalid stop price', 'Enter a valid stop (trigger) price.', undefined, { tone: 'warning' });
        return;
      }
      if (isBuy) {
        if (stop <= currentPrice) {
          showAlert('Invalid stop price', 'Buy stop must be above the current market price.', undefined, { tone: 'warning' });
          return;
        }
        if (p < stop) {
          showAlert('Invalid limit price', 'Buy limit should be at or above the stop price.', undefined, { tone: 'warning' });
          return;
        }
      } else {
        if (stop >= currentPrice) {
          showAlert('Invalid stop price', 'Sell stop must be below the current market price.', undefined, { tone: 'warning' });
          return;
        }
        if (p > stop) {
          showAlert('Invalid limit price', 'Sell limit should be at or below the stop price.', undefined, { tone: 'warning' });
          return;
        }
      }
    }

    if (q <= 0 || p <= 0) {
      showAlert('Invalid order', 'Enter a valid price and quantity.', undefined, { tone: 'warning' });
      return;
    }

    const holding = getHolding(symbol);

    if (!isBuy) {
      if (!holding || holding.qty < q) {
        showAlert(
          'Insufficient shares',
          `You only own ${holding?.qty?.toFixed(0) ?? 0} shares of ${symbol}.`,
          undefined,
          { tone: 'warning' }
        );
        return;
      }
    } else if (totalCost > buyingPower) {
      const gap = Math.ceil(totalCost - buyingPower);
      showAlert(
        'Insufficient buying power',
        `You need Rs ${formatPortfolioRs(totalCost)} but only have Rs ${formatPortfolioRs(buyingPower)} available.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Deposit',
            onPress: () => router.push(`/deposit?amount=${gap}`),
          },
        ],
        { tone: 'warning' }
      );
      return;
    }

    const stock = getStock(symbol);

    setSheetOrder({
      symbol,
      companyName: stock?.name || '',
      side: isBuy ? 'BUY' : 'SELL',
      orderType,
      price: p,
      stopPrice: orderType === 'Stop Limit' ? stop : undefined,
      quantity: q,
      brokerage,
      fed,
      secp,
      totalCost,
      availableBalance: buyingPower,
      currentMarketPrice: currentPrice,
    });
    setSheetVisible(true);
  };

  return (
    <View className="bg-app-card rounded-xl border border-app-border p-2.5">
      <View className="flex-row bg-app-card-soft rounded-lg p-1 mb-3 border border-app-border">
        <TouchableOpacity
          onPress={() => setSide('buy')}
          className={`flex-1 items-center py-1.5 rounded-md ${isBuy ? 'bg-[#0ECB81]' : ''}`}
        >
          <Text className={`font-bold text-xs ${isBuy ? 'text-black' : 'text-app-muted'}`}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSide('sell')}
          className={`flex-1 items-center py-1.5 rounded-md ${!isBuy ? 'bg-[#F6465D]' : ''}`}
        >
          <Text className={`font-bold text-xs ${!isBuy ? 'text-white' : 'text-app-muted'}`}>Sell</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row gap-2">
          {['Limit', 'Market', 'Stop Limit'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setOrderType(type);
                if (type === 'Market') {
                  setPrice(currentPrice.toFixed(2));
                } else if (type === 'Stop Limit') {
                  initStopLimitDefaults(side);
                }
              }}
              className={`px-2 py-1 rounded-md ${orderType === type ? 'bg-app-card-soft border border-app-border' : ''}`}
            >
              <Text className={`text-[10px] font-semibold ${orderType === type ? mainColorText : 'text-app-muted'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Ionicons name="information-circle-outline" size={12} color={colors.muted} />
      </View>

      {orderType === 'Stop Limit' && (
        <View className="mb-2">
          <Text className="text-app-muted text-[9px] mb-1">Stop Price (trigger)</Text>
          <View className="bg-app-card-soft border border-app-border rounded-lg flex-row items-center h-10">
            <TouchableOpacity
              onPress={() => adjustPrice(-1, 'stop')}
              className="px-3 h-full justify-center border-r border-app-border"
            >
              <Ionicons name="remove" size={14} color={colors.muted} />
            </TouchableOpacity>
            <View className="flex-1 items-center justify-center">
              <TextInput
                value={stopPrice}
                onChangeText={setStopPrice}
                keyboardType="numeric"
                className="text-app-text font-bold text-sm text-center w-full"
              />
            </View>
            <TouchableOpacity
              onPress={() => adjustPrice(1, 'stop')}
              className="px-3 h-full justify-center border-l border-app-border"
            >
              <Ionicons name="add" size={14} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="mb-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-app-muted text-[9px]">
            {orderType === 'Stop Limit' ? 'Limit Price (order)' : 'Price (PKR)'}
          </Text>
          {priceHintVisible ? (
            <Text className="text-[#FF8A00] text-[9px] font-semibold">Price from order book</Text>
          ) : null}
        </View>
        <View
          className={`bg-app-card-soft border rounded-lg flex-row items-center h-10 ${
            priceFieldHighlight ? 'border-[#FF8A00]' : 'border-app-border'
          }`}
        >
          <TouchableOpacity
            onPress={() => adjustPrice(-1, 'price')}
            className="px-3 h-full justify-center border-r border-app-border"
          >
            <Ionicons name="remove" size={14} color={colors.muted} />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              editable={orderType !== 'Market'}
              className="text-app-text font-bold text-sm text-center w-full"
            />
          </View>
          <TouchableOpacity
            onPress={() => adjustPrice(1, 'price')}
            className="px-3 h-full justify-center border-l border-app-border"
          >
            <Ionicons name="add" size={14} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-app-muted text-[9px] mb-1">Qty (Shares)</Text>
        <View className="bg-app-card-soft border border-app-border rounded-lg flex-row items-center h-10">
          <TouchableOpacity
            onPress={() => setQty(String(Math.max(1, q - 1)))}
            className="px-3 h-full justify-center border-r border-app-border"
          >
            <Ionicons name="remove" size={14} color={colors.muted} />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <TextInput
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              className="text-app-text font-bold text-sm text-center w-full"
            />
          </View>
          <TouchableOpacity
            onPress={() => setQty(String(q + 1))}
            className="px-3 h-full justify-center border-l border-app-border"
          >
            <Ionicons name="add" size={14} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="space-y-1.5 mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-app-muted text-[9px]">
            {isBuy ? 'Buying Power' : 'Shares Owned'}
          </Text>
          <Text className="text-[#FF8A00] text-[11px] font-semibold">
            {isBuy
              ? `Rs ${formatPortfolioRs(buyingPower)}`
              : `${getHolding(symbol)?.qty?.toFixed(0) ?? 0} shares`}
          </Text>
        </View>
      </View>

      <View className="border-t border-app-border pt-2.5 mb-4">
        <View className="flex-row justify-between items-center mb-0.5">
          <Text className="text-app-muted text-[10px] mr-1">Estimated Cost</Text>
          <Text className="text-app-text text-sm font-bold">Rs {estimatedCost}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-app-muted text-[8px]">Includes charges & tax</Text>
          <Text className="text-app-muted text-[8px]">Rs {totalCharges}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCtaPress}
        className={`${isBuy ? 'bg-[#FF8A00]' : 'bg-[#F6465D]'} rounded-xl py-3 items-center`}
      >
        <Text className={`font-bold text-sm ${isBuy ? 'text-black' : 'text-white'}`}>
          {isBuy ? 'Buy' : 'Sell'} {symbol}
        </Text>
      </TouchableOpacity>

      <SpotOrderSheet
        visible={sheetVisible}
        order={sheetOrder}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
};
