import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import {
  FuturesContract,
  FuturesMarginMode,
  FuturesOrderType,
  FuturesSide,
  formatFuturesPrice,
  parseFuturesInput,
} from '../../data/mockFutures';
import {
  calcLotsFromMarginPercent,
  calcMarginUsageRatio,
} from '../../utils/futuresOrderMath';
import { FuturesOrderSheet, FuturesOrderInput } from './FuturesOrderSheet';

const SLIDER_STEPS = [0, 25, 50, 75, 100] as const;

interface FuturesOrderPanelProps {
  contract: FuturesContract;
  leverage: number;
  marginMode: FuturesMarginMode;
  availableMargin: number;
  usedMargin: number;
  onMarginModeChange: (mode: FuturesMarginMode) => void;
  onLeveragePress: () => void;
  bookPriceFill?: number | null;
  onBookPriceFillConsumed?: () => void;
}

export const FuturesOrderPanel: React.FC<FuturesOrderPanelProps> = ({
  contract,
  leverage,
  marginMode,
  availableMargin,
  usedMargin,
  onMarginModeChange,
  onLeveragePress,
  bookPriceFill,
  onBookPriceFillConsumed,
}) => {
  const { colors } = useTheme();
  const [orderType, setOrderType] = useState<FuturesOrderType>('Market');
  const [limitPrice, setLimitPrice] = useState(formatFuturesPrice(contract.markPrice));
  const [quantity, setQuantity] = useState('1');
  const [sliderValue, setSliderValue] = useState(0);
  const [priceHintVisible, setPriceHintVisible] = useState(false);
  const [priceFieldHighlight, setPriceFieldHighlight] = useState(false);
  const [sheetOrder, setSheetOrder] = useState<FuturesOrderInput | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    setLimitPrice(formatFuturesPrice(contract.markPrice));
    setQuantity('1');
    setSliderValue(0);
  }, [contract.symbol, contract.markPrice]);

  useEffect(() => {
    if (bookPriceFill == null) return;
    setOrderType('Limit');
    setLimitPrice(formatFuturesPrice(bookPriceFill));
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

  const price = orderType === 'Market' ? contract.markPrice : parseFuturesInput(limitPrice);
  const qty = parseFuturesInput(quantity);
  const orderValue = price * qty;
  const requiredMargin = leverage > 0 ? orderValue / leverage : 0;

  const summary = useMemo(
    () => ({ orderValue, requiredMargin }),
    [orderValue, requiredMargin]
  );

  const adjustPrice = (delta: number) => {
    const next = Math.max(0, parseFuturesInput(limitPrice) + delta);
    setLimitPrice(formatFuturesPrice(next));
    setSliderValue(0);
  };

  const adjustQty = (delta: number) => {
    const next = Math.max(0, parseFuturesInput(quantity) + delta);
    setQuantity(String(next));
    setSliderValue(0);
  };

  const applySliderPercent = (percent: number) => {
    setSliderValue(percent);
    if (percent === 0) {
      setQuantity('0');
      return;
    }
    const lots = calcLotsFromMarginPercent(
      availableMargin,
      percent,
      price,
      leverage,
      orderType
    );
    setQuantity(String(lots));
  };

  const handleQuantityChange = (text: string) => {
    setQuantity(text);
    setSliderValue(0);
  };

  const submitOrder = (side: FuturesSide) => {
    if (qty <= 0) return;
    setSheetOrder({
      symbol: contract.symbol,
      companyName: contract.name,
      futuresSide: side,
      orderType,
      price,
      quantity: qty,
      leverage,
      marginMode,
      totalCost: summary.requiredMargin,
      availableBalance: availableMargin,
      currentMarketPrice: contract.markPrice,
      priceChange: contract.changeValue,
      priceChangePct: contract.changePercent,
      expiry: contract.expiry,
    });
    setSheetVisible(true);
  };

  return (
    <View className="flex-[1.35] self-stretch bg-app-card border border-app-border rounded-xl p-2.5 justify-between">
      <View className="flex-row items-center pb-2 mb-2 border-b border-app-border">
        <View className="flex-row gap-1">
          {(['Cross', 'Isolated'] as FuturesMarginMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => onMarginModeChange(mode)}
              className={`py-1.5 px-2.5 rounded-md ${marginMode === mode ? 'bg-[#FF8A00]' : 'bg-app-card-soft'}`}
            >
              <Text
                className={`text-xs ${marginMode === mode ? 'text-black font-bold' : 'text-app-muted font-medium'}`}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={onLeveragePress}
          className="ml-auto flex-row items-center bg-app-card-soft rounded-md py-1.5 px-2"
        >
          <Text className="text-[#FF8A00] text-xs font-bold">{leverage}x</Text>
          <Ionicons name="chevron-down" size={12} color="#FF8A00" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      {priceHintVisible && (
        <View className="bg-[#FF8A00]/15 border border-[#FF8A00]/30 rounded-md px-2 py-1 mb-2 flex-row items-center">
          <Ionicons name="arrow-forward" size={12} color="#FF8A00" style={{ marginRight: 4 }} />
          <Text className="text-[#FF8A00] text-[10px] font-semibold flex-1">
            Limit price set from order book
          </Text>
        </View>
      )}

      <View className="flex-row border-b border-app-border mb-2">
        {(['Limit', 'Market', 'Stop'] as FuturesOrderType[]).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setOrderType(type);
              setSliderValue(0);
            }}
            className={`flex-1 pb-1.5 ${orderType === type ? 'border-b-2 border-[#FF8A00]' : ''}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${orderType === type ? 'text-[#FF8A00]' : 'text-app-muted'}`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mb-2">
        <Text className="text-app-muted text-xs mb-1">Price (PKR)</Text>
        <View
          className={`flex-row items-center bg-app-bg border rounded-md py-2 px-2.5 ${
            priceFieldHighlight ? 'border-[#FF8A00]' : 'border-app-border'
          }`}
        >
          <TouchableOpacity onPress={() => adjustPrice(-0.5)} disabled={orderType === 'Market'}>
            <Text className={`text-base ${orderType === 'Market' ? 'text-app-muted' : 'text-app-muted'}`}>-</Text>
          </TouchableOpacity>
          <TextInput
            value={orderType === 'Market' ? 'Market' : limitPrice}
            editable={orderType !== 'Market'}
            onChangeText={(text) => {
              setLimitPrice(text);
              setSliderValue(0);
            }}
            className="flex-1 text-center text-app-text text-sm font-semibold py-0"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => adjustPrice(0.5)} disabled={orderType === 'Market'}>
            <Text className={`text-base ${orderType === 'Market' ? 'text-app-muted' : 'text-app-muted'}`}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-2">
        <Text className="text-app-muted text-xs mb-1">Qty (Lots)</Text>
        <View className="flex-row items-center bg-app-bg border border-app-border rounded-md py-2 px-2.5">
          <TouchableOpacity onPress={() => adjustQty(-1)}>
            <Text className="text-app-muted text-base">-</Text>
          </TouchableOpacity>
          <TextInput
            value={quantity}
            onChangeText={handleQuantityChange}
            className="flex-1 text-center text-app-text text-sm font-semibold py-0"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => adjustQty(1)}>
            <Text className="text-app-muted text-base">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-2.5">
        <View className="flex-row justify-between mb-1">
          <Text className="text-app-muted text-[10px]">Margin %</Text>
          <Text className="text-[#FF8A00] text-[10px] font-semibold">{sliderValue}%</Text>
        </View>
        <View className="h-1.5 bg-app-card-soft w-full rounded-full relative justify-center">
          <View
            className="absolute left-0 top-0 bottom-0 bg-[#FF8A00] rounded-full"
            style={{ width: `${sliderValue}%` }}
          />
          <View
            className="absolute w-3.5 h-3.5 bg-[#FF8A00] rounded-full -top-1 border-2"
            style={{ left: `${sliderValue}%`, transform: [{ translateX: -7 }], borderColor: colors.background }}
          />
        </View>
        <View className="flex-row justify-between mt-1.5">
          {SLIDER_STEPS.map((val) => {
            const isActive = sliderValue === val;
            return (
              <TouchableOpacity
                key={val}
                onPress={() => applySliderPercent(val)}
                className={`px-1.5 py-0.5 rounded ${isActive ? 'bg-[#FF8A00]/20' : ''}`}
              >
                <Text
                  className={`text-[11px] font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-app-muted'}`}
                >
                  {val}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="flex-row justify-between bg-app-bg border border-app-border rounded-md py-2 px-2 mb-2.5">
        <View>
          <Text className="text-app-muted text-xs">Order Value</Text>
          <Text className="text-app-text text-sm font-semibold mt-0.5">
            {formatFuturesPrice(summary.orderValue)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-app-muted text-xs">Required Margin</Text>
          <Text className="text-[#FF8A00] text-sm font-semibold mt-0.5">
            {formatFuturesPrice(summary.requiredMargin)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mb-2.5">
        <TouchableOpacity
          onPress={() => submitOrder('Long')}
          disabled={qty <= 0}
          className={`flex-1 rounded-md py-3 ${qty > 0 ? 'bg-[#0ECB81]' : 'bg-[#0ECB81]/40'}`}
        >
          <Text className="text-black text-sm font-bold text-center">Long</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => submitOrder('Short')}
          disabled={qty <= 0}
          className={`flex-1 rounded-md py-3 ${qty > 0 ? 'bg-[#F6465D]' : 'bg-[#F6465D]/40'}`}
        >
          <Text className="text-white text-sm font-bold text-center">Short</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between border-t border-app-border pt-2">
        <View className="items-center">
          <Text className="text-app-muted text-[11px]">Avail. Margin</Text>
          <Text className="text-app-text text-xs font-medium mt-0.5">
            {availableMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-app-muted text-[11px]">Used</Text>
          <Text className="text-app-text text-xs font-medium mt-0.5">
            {usedMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-app-muted text-[11px]">Ratio</Text>
          <Text className="text-[#FF8A00] text-xs font-medium mt-0.5">
            {calcMarginUsageRatio(usedMargin, availableMargin)}
          </Text>
        </View>
      </View>

      <FuturesOrderSheet
        visible={sheetVisible}
        order={sheetOrder}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
};
