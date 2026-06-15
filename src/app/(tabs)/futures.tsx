import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Line, Text as SvgText } from 'react-native-svg';

export default function FuturesScreen() {
  const [activeTab, setActiveTab] = useState<'chart' | 'orderbook' | 'trades' | 'contractInfo'>('chart');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stopLimit'>('limit');
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<string>('104,975.50');
  const [quantity, setQuantity] = useState<string>('1');
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleLeverageDecrease = () => setLeverage(prev => Math.max(1, prev - 1));
  const handleLeverageIncrease = () => setLeverage(prev => Math.min(125, prev + 1));

  const handleOrder = (side: 'Long' | 'Short') => {
    Alert.alert('Order Placed', `${side} KSE-100 Futures @ 104,975.50`, [
      { text: 'OK' }
    ]);
  };

  // Mock OHLC data for candles (approximate values to render a shape)
  // x, open, high, low, close
  const candles = [
    { x: 10, o: 60, h: 40, l: 80, c: 50, isUp: true },
    { x: 18, o: 50, h: 30, l: 60, c: 35, isUp: true },
    { x: 26, o: 35, h: 10, l: 50, c: 20, isUp: true },
    { x: 34, o: 20, h: 5, l: 30, c: 15, isUp: true },
    { x: 42, o: 15, h: 5, l: 40, c: 30, isUp: false },
    { x: 50, o: 30, h: 15, l: 50, c: 45, isUp: false },
    { x: 58, o: 45, h: 30, l: 70, c: 60, isUp: false },
    { x: 66, o: 60, h: 45, l: 80, c: 75, isUp: false },
    { x: 74, o: 75, h: 50, l: 90, c: 65, isUp: true },
    { x: 82, o: 65, h: 40, l: 80, c: 45, isUp: true },
    { x: 90, o: 45, h: 25, l: 60, c: 30, isUp: true },
    { x: 98, o: 30, h: 10, l: 40, c: 15, isUp: true },
    { x: 106, o: 15, h: 5, l: 30, c: 20, isUp: false },
    { x: 114, o: 20, h: 10, l: 35, c: 25, isUp: false },
    { x: 122, o: 25, h: 15, l: 40, c: 35, isUp: false },
  ];

  const asks = [
    { price: '105,002.00', size: '35', total: '182' },
    { price: '105,001.50', size: '50', total: '147' },
    { price: '105,001.00', size: '45', total: '97' },
    { price: '105,000.50', size: '30', total: '52' },
    { price: '105,000.00', size: '22', total: '22' },
  ];

  const bids = [
    { price: '104,975.00', size: '28', total: '28' },
    { price: '104,974.50', size: '40', total: '68' },
    { price: '104,974.00', size: '55', total: '123' },
    { price: '104,973.50', size: '60', total: '183' },
    { price: '104,973.00', size: '70', total: '253' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]" edges={['top']}>
      {/* NAV BAR */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity className="w-10">
          <Ionicons name="menu" size={26} color="#888" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">Trade<Text className="text-[#f97316]">It</Text></Text>
        </View>
        <View className="flex-row items-center w-10 justify-end">
          <View className="relative mr-3">
            <Ionicons name="notifications-outline" size={24} color="#888" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#f97316] rounded-full items-center justify-center border-2 border-[#0d0d0d]">
              <Text className="text-white text-[8px] font-bold">2</Text>
            </View>
          </View>
          <View className="w-7 h-7 rounded-full border border-[#f97316] items-center justify-center">
            <Text className="text-white font-bold text-[10px]">GT</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, paddingTop: 8 }}>
        
        {/* SECTION 1 - CONTRACT HEADER */}
        <View className="bg-[#161616] rounded-[10px] py-3 px-3.5 mx-3.5 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-[#222] items-center justify-center mr-2 border border-[#1e1e1e]">
              <Text className="text-[#888] text-[9px] font-bold">KSE</Text>
            </View>
            <View>
              <Text className="text-white text-[13px] font-semibold">KSE-100 Futures</Text>
              <Text className="text-[#555] text-[10px] mt-[1px]">Jun 2025 · KSE</Text>
            </View>
          </View>
          
          <View className="flex-1 items-center">
            <Text className="text-[#22c55e] text-[18px] font-bold">104,975.50</Text>
            <Text className="text-[#22c55e] text-[10px] mt-[2px]">+6,358.25 (6.45%)</Text>
          </View>
          
          <View className="items-end">
            <View className="flex-row justify-end mb-0.5">
              <Text className="text-[#444] text-[9px] mr-2 w-10 text-right">24h High</Text>
              <Text className="text-white text-[10px] font-medium w-14 text-right">105,120.00</Text>
            </View>
            <View className="flex-row justify-end mb-0.5">
              <Text className="text-[#444] text-[9px] mr-2 w-10 text-right">24h Low</Text>
              <Text className="text-white text-[10px] font-medium w-14 text-right">98,540.75</Text>
            </View>
            <View className="flex-row justify-end">
              <Text className="text-[#444] text-[9px] mr-2 w-10 text-right">Volume</Text>
              <Text className="text-white text-[10px] font-medium w-14 text-right">18,742</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2 - 4 TABS */}
        <View className="mx-3.5 mt-2.5 flex-row border-b border-[#1e1e1e]">
          {(['chart', 'orderbook', 'trades', 'contractInfo'] as const).map(tab => {
            const isActive = activeTab === tab;
            const titles = {
              chart: 'Chart',
              orderbook: 'Order Book',
              trades: 'Trades',
              contractInfo: 'Contract Info'
            };
            return (
              <TouchableOpacity 
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-2 ${isActive ? 'border-b-2 border-[#f97316]' : ''}`}
              >
                <Text className={`text-center text-[11px] font-medium ${isActive ? 'text-[#f97316]' : 'text-[#555]'}`}>
                  {titles[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SECTION 3 - CHART + ORDER BOOK */}
        <View className="flex-row mx-3.5 mt-2 gap-2">
          
          {/* LEFT: Chart Panel */}
          <View className="flex-[1.4] bg-[#111] rounded-lg p-1.5 border border-[#1e1e1e]">
            {/* Toolbar */}
            <View className="flex-row items-center mb-1 px-1">
              <Text className="text-white text-[10px] font-semibold mr-2">15m</Text>
              <Ionicons name="bar-chart-outline" size={12} color="#888" style={{ marginRight: 6 }} />
              <Text className="text-[#888] text-[9px] mr-2">Indicators</Text>
              <Ionicons name="expand-outline" size={12} color="#888" style={{ marginLeft: 'auto' }} />
            </View>

            {/* Symbol Row */}
            <View className="flex-row items-center mb-0.5 px-1">
              <Text className="text-[#888] text-[8px]">KSE-100 Futures · 15 · KSE</Text>
              <View className="w-1.5 h-1.5 rounded-full bg-[#22c55e] ml-1" />
            </View>
            <View className="flex-row items-center mb-2 px-1">
              <Text className="text-white text-[10px] font-semibold mr-1">104,975.50</Text>
              <Text className="text-[#22c55e] text-[8px]">+125.25 (+0.12%)</Text>
            </View>

            {/* Candlestick Chart SVG */}
            <View className="w-full h-[130px] relative">
              <Svg width="100%" height="100%" viewBox="0 0 160 130">
                {/* Horizontal line at current price */}
                <Line x1="0" y1="35" x2="160" y2="35" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" />
                <Rect x="125" y="30" width="35" height="10" fill="#f97316" rx="2" />
                <SvgText x="130" y="38" fill="white" fontSize="6" fontWeight="bold">104,975.50</SvgText>

                {/* Candles */}
                {candles.map((c, i) => (
                  <React.Fragment key={i}>
                    {/* Wick */}
                    <Line x1={c.x + 2} y1={c.h} x2={c.x + 2} y2={c.l} stroke={c.isUp ? "#22c55e" : "#ef4444"} strokeWidth="1" />
                    {/* Body */}
                    <Rect x={c.x} y={Math.min(c.o, c.c)} width="4" height={Math.max(Math.abs(c.o - c.c), 1)} fill={c.isUp ? "#22c55e" : "#ef4444"} />
                    {/* Volume bar at bottom */}
                    <Rect x={c.x} y={110 - Math.random() * 20} width="3" height={20 + Math.random() * 20} fill={c.isUp ? "#22c55e" : "#ef4444"} opacity="0.5" />
                  </React.Fragment>
                ))}

                {/* Y-axis labels */}
                <SvgText x="130" y="10" fill="#333" fontSize="6">105,200.00</SvgText>
                <SvgText x="130" y="30" fill="#333" fontSize="6">105,000.00</SvgText>
                <SvgText x="130" y="50" fill="#333" fontSize="6">104,800.00</SvgText>
                <SvgText x="130" y="70" fill="#333" fontSize="6">104,600.00</SvgText>
                <SvgText x="130" y="90" fill="#333" fontSize="6">104,400.00</SvgText>
                <SvgText x="130" y="110" fill="#333" fontSize="6">104,280.00</SvgText>

                {/* X-axis labels */}
                <SvgText x="5" y="125" fill="#333" fontSize="6">18:00</SvgText>
                <SvgText x="40" y="125" fill="#333" fontSize="6">6</SvgText>
                <SvgText x="70" y="125" fill="#333" fontSize="6">06:00</SvgText>
                <SvgText x="100" y="125" fill="#333" fontSize="6">12:00</SvgText>
              </Svg>
            </View>

            {/* Time period row */}
            <View className="flex-row items-center mt-1 px-1">
              <Text className="text-[#f97316] text-[9px] mr-2">1D</Text>
              <Text className="text-[#444] text-[9px] mr-2">5D</Text>
              <Text className="text-[#444] text-[9px] mr-2">1M</Text>
              <Text className="text-[#444] text-[9px] mr-2">3M</Text>
              <Text className="text-[#444] text-[9px] mr-2">6M</Text>
              <Text className="text-[#444] text-[9px]">1Y</Text>
              <View className="flex-row ml-auto">
                <Text className="text-[#333] text-[9px] mr-2">%</Text>
                <Text className="text-[#333] text-[9px] mr-2">log</Text>
                <Text className="text-[#333] text-[9px]">auto</Text>
              </View>
            </View>
          </View>

          {/* RIGHT: Order Book Panel */}
          <View className="flex-1 bg-[#111] rounded-lg p-1.5 border border-[#1e1e1e]">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-2 px-1">
              <Text className="text-white text-[9px] font-semibold">Order Book</Text>
              <View className="flex-row items-center bg-[#222] px-1.5 py-0.5 rounded">
                <Text className="text-[#888] text-[8px] mr-1">0.25</Text>
                <Ionicons name="chevron-down" size={8} color="#888" />
              </View>
            </View>

            {/* Columns */}
            <View className="flex-row justify-between mb-1 px-1">
              <Text className="text-[#444] text-[7px] w-[35%]">Price (PKR)</Text>
              <Text className="text-[#444] text-[7px] w-[30%] text-right">Size</Text>
              <Text className="text-[#444] text-[7px] w-[35%] text-right">Total</Text>
            </View>

            {/* Asks */}
            {asks.map((ask, i) => (
              <View key={i} className="flex-row justify-between py-[2px] px-1 relative">
                {/* Background depth bar (mock) */}
                <View className="absolute top-0 right-0 bottom-0 bg-[#f6465d] opacity-10" style={{ width: `${10 + i * 15}%` }} />
                <Text className="text-[#f6465d] text-[8px] font-medium w-[35%]">{ask.price}</Text>
                <Text className="text-[#e0e0e0] text-[8px] w-[30%] text-right">{ask.size}</Text>
                <Text className="text-[#e0e0e0] text-[8px] w-[35%] text-right">{ask.total}</Text>
              </View>
            ))}

            {/* Current Price Separator */}
            <View className="bg-[#1a1a1a] py-[3px] px-1 my-1 flex-row items-center justify-between rounded-sm">
              <View className="flex-row items-center">
                <Text className="text-[#f97316] text-[9px] font-bold mr-1">104,975.50</Text>
                <Ionicons name="arrow-up" size={8} color="#f97316" style={{ transform: [{ rotate: '45deg' }] }} />
              </View>
              <Text className="text-[#555] text-[8px]">Mark 104,972.92</Text>
            </View>

            {/* Bids */}
            {bids.map((bid, i) => (
              <View key={i} className="flex-row justify-between py-[2px] px-1 relative">
                {/* Background depth bar (mock) */}
                <View className="absolute top-0 right-0 bottom-0 bg-[#0ecb81] opacity-10" style={{ width: `${70 - i * 12}%` }} />
                <Text className="text-[#0ecb81] text-[8px] font-medium w-[35%]">{bid.price}</Text>
                <Text className="text-[#e0e0e0] text-[8px] w-[30%] text-right">{bid.size}</Text>
                <Text className="text-[#e0e0e0] text-[8px] w-[35%] text-right">{bid.total}</Text>
              </View>
            ))}

            {/* Ratio Bar */}
            <View className="flex-row items-center mt-2 px-1">
              <Text className="text-[#0ecb81] text-[7px] mr-1">B</Text>
              <Text className="text-[#0ecb81] text-[7px] mr-1 w-4">56%</Text>
              <View className="flex-1 flex-row h-1 rounded-full overflow-hidden">
                <View className="flex-[0.56] bg-[#0ecb81] opacity-40" />
                <View className="flex-[0.44] bg-[#f6465d] opacity-40" />
              </View>
              <Text className="text-[#f6465d] text-[7px] ml-1 w-4 text-right">44%</Text>
              <Text className="text-[#f6465d] text-[7px] ml-1">S</Text>
            </View>
          </View>
        </View>

        {/* SECTION 4 - MARGIN MODE + ORDER ENTRY */}
        <View className="flex-row mx-3.5 mt-2.5 gap-2">
          
          {/* LEFT: Margin Panel */}
          <View className="flex-1 bg-[#161616] rounded-[10px] p-2.5 border border-[#1e1e1e]">
            <View className="flex-row items-center">
              <Text className="text-white text-[10px] font-semibold mr-1">Margin Mode</Text>
              <Ionicons name="information-circle-outline" size={12} color="#444" />
            </View>
            
            <View className="flex-row mt-1.5 mb-2">
              <TouchableOpacity className="bg-[#f97316] rounded-md px-2.5 py-1.5 mr-1.5 flex-1 items-center border border-[#f97316]">
                <Text className="text-white text-[10px] font-semibold">Cross</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#222] rounded-md px-2.5 py-1.5 flex-1 items-center border border-[#333]">
                <Text className="text-[#555] text-[10px]">Isolated</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mt-1">
              <Text className="text-[#555] text-[9px] mr-1">Leverage</Text>
              <Ionicons name="information-circle-outline" size={10} color="#555" />
            </View>

            <View className="flex-row items-center mt-1 bg-[#111] rounded-md border border-[#222] p-1">
              <TouchableOpacity onPress={handleLeverageDecrease} className="w-6 h-6 bg-[#222] rounded justify-center items-center">
                <Text className="text-[#888] text-[16px] leading-[18px]">-</Text>
              </TouchableOpacity>
              <Text className="flex-1 text-center text-[#f97316] text-[13px] font-bold">{leverage}x</Text>
              <TouchableOpacity onPress={handleLeverageIncrease} className="w-6 h-6 bg-[#222] rounded justify-center items-center">
                <Text className="text-[#888] text-[16px] leading-[18px]">+</Text>
              </TouchableOpacity>
            </View>

            <View className="h-[0.5px] bg-[#1e1e1e] my-2" />

            <View className="flex-row justify-between mb-1">
              <Text className="text-[#444] text-[9px] flex-1">Available Margin</Text>
              <Text className="text-[#e0e0e0] text-[9px] font-medium">Rs 1,11,331.60</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-[#444] text-[9px] flex-1">Margin Used</Text>
              <Text className="text-[#e0e0e0] text-[9px] font-medium">Rs 18,742.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#444] text-[9px] flex-1">Margin Ratio</Text>
              <Text className="text-[#22c55e] text-[9px] font-medium">16.84%</Text>
            </View>
          </View>

          {/* RIGHT: Order Entry Panel */}
          <View className="flex-[1.4] bg-[#161616] rounded-[10px] p-2.5 border border-[#1e1e1e]">
            {/* Order type tabs */}
            <View className="flex-row border-b border-[#1e1e1e] mb-2">
              <TouchableOpacity className="pb-1.5 border-b-2 border-[#f97316] px-1 mr-3">
                <Text className="text-[#f97316] text-[10px] font-medium">Limit</Text>
              </TouchableOpacity>
              <TouchableOpacity className="pb-1.5 px-1 mr-3">
                <Text className="text-[#444] text-[10px]">Market</Text>
              </TouchableOpacity>
              <TouchableOpacity className="pb-1.5 px-1 flex-row items-center">
                <Text className="text-[#444] text-[10px] mr-1">Stop Limit</Text>
                <Ionicons name="information-circle-outline" size={10} color="#444" />
              </TouchableOpacity>
            </View>

            {/* Limit Price */}
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-[#444] text-[9px]">Limit Price (PKR)</Text>
            </View>
            <View className="flex-row items-center bg-[#111] rounded-md border border-[#222] px-2 py-1 mt-1">
              <Text className="text-white text-[11px] font-semibold flex-1 py-0.5">{limitPrice}</Text>
              <View className="flex-row border-l border-[#222] pl-1">
                <TouchableOpacity className="px-2 py-1"><Text className="text-[#888] text-[12px] leading-3">-</Text></TouchableOpacity>
                <TouchableOpacity className="px-2 py-1"><Text className="text-[#888] text-[12px] leading-3">+</Text></TouchableOpacity>
              </View>
            </View>
            <Text className="text-[#444] text-[8px] mt-0.5">≈ Mark Price</Text>

            {/* Quantity */}
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-[#444] text-[9px]">Quantity (Lots)</Text>
            </View>
            <View className="flex-row items-center bg-[#111] rounded-md border border-[#222] px-2 py-1 mt-1">
              <Text className="text-white text-[11px] font-semibold flex-1 py-0.5">{quantity}</Text>
              <View className="flex-row border-l border-[#222] pl-1">
                <TouchableOpacity className="px-2 py-1"><Text className="text-[#888] text-[12px] leading-3">-</Text></TouchableOpacity>
                <TouchableOpacity className="px-2 py-1"><Text className="text-[#888] text-[12px] leading-3">+</Text></TouchableOpacity>
              </View>
            </View>
            <Text className="text-[#444] text-[8px] mt-0.5 text-right">1 Lot = 10 Index</Text>

            {/* Slider mock */}
            <View className="my-2 px-1">
              <View className="h-0.5 bg-[#222] w-full rounded-full relative justify-center">
                {/* Thumbs */}
                <View className="absolute left-0 w-2.5 h-2.5 bg-transparent border-2 border-[#555] rounded-full z-10 bg-[#161616]" />
                <View className="absolute left-1/4 w-1.5 h-1.5 bg-[#555] rounded-full z-0" />
                <View className="absolute left-2/4 w-1.5 h-1.5 bg-[#555] rounded-full z-0" />
                <View className="absolute left-3/4 w-1.5 h-1.5 bg-[#555] rounded-full z-0" />
                <View className="absolute right-0 w-1.5 h-1.5 bg-[#555] rounded-full z-0" />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-[#333] text-[7px]">0%</Text>
                <Text className="text-[#333] text-[7px]">25%</Text>
                <Text className="text-[#333] text-[7px]">50%</Text>
                <Text className="text-[#333] text-[7px]">75%</Text>
                <Text className="text-[#333] text-[7px]">100%</Text>
              </View>
            </View>

            {/* Values */}
            <View className="flex-row justify-between mt-1 mb-2">
              <View>
                <Text className="text-[#444] text-[9px] mb-0.5">Order Value</Text>
                <Text className="text-[#e0e0e0] text-[9px] font-medium">Rs 1,049,755.00</Text>
              </View>
              <View className="items-end">
                <Text className="text-[#444] text-[9px] mb-0.5">Required Margin</Text>
                <Text className="text-[#e0e0e0] text-[9px] font-medium">Rs 104,975.50</Text>
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-2 mt-1">
              <TouchableOpacity onPress={() => handleOrder('Long')} className="flex-1 bg-[#22c55e] rounded-lg py-2.5 items-center flex-row justify-center">
                <Text className="text-white text-[12px] font-bold mr-1">Long</Text>
                <Ionicons name="arrow-up" size={12} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOrder('Short')} className="flex-1 bg-[#ef4444] rounded-lg py-2.5 items-center flex-row justify-center">
                <Text className="text-white text-[12px] font-bold mr-1">Short</Text>
                <Ionicons name="arrow-down" size={12} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SECTION 5 - OPEN POSITIONS */}
        <View className="mx-3.5 mt-3 mb-2">
          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-white text-[13px] font-semibold">Open Positions (1)</Text>
            <View className="flex-row items-center">
              <Text className="text-[#f97316] text-[11px] mr-1">View All</Text>
              <Ionicons name="chevron-forward" size={10} color="#f97316" />
            </View>
          </View>

          <View className="bg-[#161616] rounded-[10px] p-3 border border-[#1e1e1e]">
            <View className="flex-row items-center">
              <View className="bg-[#0d2010] border border-[#1f3f20] px-1.5 py-0.5 rounded">
                <Text className="text-[#22c55e] text-[9px] font-bold">Long</Text>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-white text-[11px] font-semibold">KSE-100 Futures</Text>
                <Text className="text-[#444] text-[8px]">Jun 2025 · 10x</Text>
              </View>
              <TouchableOpacity className="bg-[#222] border border-[#333] px-2.5 py-1 rounded">
                <Text className="text-[#888] text-[9px]">Close</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-2.5">
              <View className="flex-1">
                <Text className="text-[#444] text-[8px] mb-1">Size (Lots)</Text>
                <Text className="text-[#e0e0e0] text-[9px] font-medium">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#444] text-[8px] mb-1">Entry Price</Text>
                <Text className="text-[#e0e0e0] text-[9px] font-medium">104,250.00</Text>
              </View>
              <View className="flex-[1.2]">
                <Text className="text-[#444] text-[8px] mb-1">Mark Price</Text>
                <Text className="text-[#e0e0e0] text-[9px] font-medium">104,975.50</Text>
              </View>
              <View className="flex-[1.2] items-end">
                <Text className="text-[#444] text-[8px] mb-1">Unrealized PnL</Text>
                <Text className="text-[#22c55e] text-[9px] font-medium">+14,514.00</Text>
                <Text className="text-[#22c55e] text-[8px]">(13.90%)</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
