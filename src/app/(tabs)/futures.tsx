import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Line, Text as SvgText } from 'react-native-svg';

export default function FuturesScreen() {
  const [activeTab, setActiveTab] = useState<'chart' | 'orderbook' | 'trades' | 'info'>('chart');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stopLimit'>('limit');
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [leverageModalVisible, setLeverageModalVisible] = useState<boolean>(false);
  const [limitPrice, setLimitPrice] = useState<string>('104,975.50');
  const [quantity, setQuantity] = useState<string>('1');
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleOrder = (side: 'Long' | 'Short') => {
    Alert.alert('Order Placed', `${side} KSE-100 Futures @ 104,975.50`, [
      { text: 'OK' }
    ]);
  };

  // Mock OHLC data for candles
  const candles = [
    { x: 0, o: 80, h: 60, l: 100, c: 70, isUp: true },
    { x: 10, o: 70, h: 40, l: 80, c: 50, isUp: true },
    { x: 20, o: 50, h: 20, l: 60, c: 30, isUp: true },
    { x: 30, o: 30, h: 10, l: 50, c: 20, isUp: true },
    { x: 40, o: 20, h: 10, l: 60, c: 40, isUp: false },
    { x: 50, o: 40, h: 20, l: 70, c: 60, isUp: false },
    { x: 60, o: 60, h: 40, l: 90, c: 80, isUp: false },
    { x: 70, o: 80, h: 60, l: 100, c: 95, isUp: false },
    { x: 80, o: 95, h: 70, l: 110, c: 80, isUp: true },
    { x: 90, o: 80, h: 50, l: 100, c: 60, isUp: true },
    { x: 100, o: 60, h: 30, l: 80, c: 40, isUp: true },
    { x: 110, o: 40, h: 15, l: 60, c: 25, isUp: true },
    { x: 120, o: 25, h: 10, l: 40, c: 30, isUp: false },
    { x: 130, o: 30, h: 15, l: 50, c: 40, isUp: false },
    { x: 140, o: 40, h: 25, l: 60, c: 50, isUp: false },
    { x: 150, o: 50, h: 35, l: 70, c: 60, isUp: false },
    { x: 160, o: 60, h: 45, l: 80, c: 75, isUp: false },
    { x: 170, o: 75, h: 60, l: 95, c: 85, isUp: true },
    { x: 180, o: 85, h: 70, l: 105, c: 90, isUp: true },
    { x: 190, o: 90, h: 75, l: 110, c: 100, isUp: true },
    { x: 200, o: 100, h: 80, l: 115, c: 95, isUp: false },
    { x: 210, o: 95, h: 70, l: 110, c: 80, isUp: false },
    { x: 220, o: 80, h: 60, l: 90, c: 60, isUp: false },
    { x: 230, o: 60, h: 40, l: 70, c: 50, isUp: false },
  ];

  const asks = [
    { price: '105,003.00', size: '10', total: '210' },
    { price: '105,002.50', size: '18', total: '200' },
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
    { price: '104,972.50', size: '30', total: '283' },
    { price: '104,972.00', size: '45', total: '328' },
    { price: '104,972.00', size: '45', total: '328' },
    { price: '104,972.00', size: '45', total: '328' },
    { price: '104,972.00', size: '45', total: '328' },

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

        {/* SECTION 2 - CHART TABS */}
        <View className="mx-3.5 mt-2.5 flex-row border-b border-[#1e1e1e]">
          {(['chart', 'orderbook', 'trades', 'info'] as const).map(tab => {
            const isActive = activeTab === tab;
            const titles = {
              chart: 'Chart',
              orderbook: 'Order Book',
              trades: 'Trades',
              info: 'Contract Info'
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

        {/* CONDITIONAL SECTIONS BASED ON TAB */}
        {activeTab === 'chart' && (
          <View className="bg-[#111] rounded-lg p-1.5 border border-[#1e1e1e] mx-3.5 mt-2">
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

            {/* Candlestick Chart SVG - FULL WIDTH */}
            <View className="w-full h-[180px] relative">
              <Svg width="100%" height="100%" viewBox="0 0 280 180" preserveAspectRatio="none">
                {/* Horizontal line at current price */}
                <Line x1="0" y1="50" x2="280" y2="50" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Vertical line separating Y-axis */}
                <Line x1="235" y1="0" x2="235" y2="180" stroke="#1e1e1e" strokeWidth="0.5" />
                
                <Rect x="235" y="45" width="45" height="12" fill="#f97316" rx="2" />
                <SvgText x="240" y="54" fill="white" fontSize="8" fontWeight="bold">104,975.50</SvgText>

                {/* Candles */}
                {candles.map((c, i) => (
                  <React.Fragment key={i}>
                    {/* Wick */}
                    <Line x1={c.x + 4} y1={c.h} x2={c.x + 4} y2={c.l} stroke={c.isUp ? "#22c55e" : "#ef4444"} strokeWidth="1" />
                    {/* Body */}
                    <Rect x={c.x} y={Math.min(c.o, c.c)} width="8" height={Math.max(Math.abs(c.o - c.c), 1)} fill={c.isUp ? "#22c55e" : "#ef4444"} />
                    {/* Volume bar at bottom */}
                    <Rect x={c.x + 1} y={150 - Math.random() * 30} width="6" height={30 + Math.random() * 30} fill={c.isUp ? "#22c55e" : "#ef4444"} opacity="0.5" />
                  </React.Fragment>
                ))}

                {/* Y-axis labels */}
                <SvgText x="240" y="20" fill="#333" fontSize="8">105,200.00</SvgText>
                <SvgText x="240" y="40" fill="#333" fontSize="8">105,000.00</SvgText>
                <SvgText x="240" y="70" fill="#333" fontSize="8">104,800.00</SvgText>
                <SvgText x="240" y="100" fill="#333" fontSize="8">104,600.00</SvgText>
                <SvgText x="240" y="130" fill="#333" fontSize="8">104,400.00</SvgText>
                <SvgText x="240" y="160" fill="#333" fontSize="8">104,280.00</SvgText>

                {/* X-axis labels */}
                <SvgText x="10" y="175" fill="#333" fontSize="8">18:00</SvgText>
                <SvgText x="60" y="175" fill="#333" fontSize="8">6</SvgText>
                <SvgText x="110" y="175" fill="#333" fontSize="8">06:00</SvgText>
                <SvgText x="160" y="175" fill="#333" fontSize="8">12:00</SvgText>
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
        )}

        {activeTab === 'orderbook' && (
          <View className="bg-[#161616] rounded-[12px] mx-[14px] p-3 mt-2">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-white text-[13px] font-semibold">Order Book</Text>
              <View className="flex-row items-center">
                <Text className="text-[#555] text-[11px] mr-1">0.25</Text>
                <Ionicons name="chevron-down" size={10} color="#555" />
              </View>
            </View>

            {/* Columns */}
            <View className="flex-row justify-between pb-1.5 border-b border-[#1e1e1e] mb-1">
              <Text className="text-[#333] text-[10px] w-[35%]">Price (PKR)</Text>
              <Text className="text-[#333] text-[10px] w-[30%] text-right">Size</Text>
              <Text className="text-[#333] text-[10px] w-[35%] text-right">Total</Text>
            </View>

            {/* Asks */}
            {asks.map((ask, i) => (
              <View key={i} className="flex-row justify-between py-1.5 border-b border-[#111]">
                <Text className="text-[#f6465d] text-[11px] font-medium w-[35%]">{ask.price}</Text>
                <Text className="text-[#c0c0c0] text-[11px] w-[30%] text-right">{ask.size}</Text>
                <Text className="text-[#c0c0c0] text-[11px] w-[35%] text-right">{ask.total}</Text>
              </View>
            ))}

            {/* Current Price Row */}
            <View className="bg-[#1a1a1a] rounded-md py-1.5 px-2.5 my-1 flex-row items-center">
              <Text className="text-[#f97316] text-[13px] font-bold">104,975.50</Text>
              <Ionicons name="play" size={12} color="#444" style={{ marginHorizontal: 6 }} />
              <Text className="text-[#555] text-[10px]">Mark Price  104,972.92</Text>
            </View>

            {/* Bids */}
            {bids.map((bid, i) => (
              <View key={i} className="flex-row justify-between py-1.5 border-b border-[#111]">
                <Text className="text-[#0ecb81] text-[11px] font-medium w-[35%]">{bid.price}</Text>
                <Text className="text-[#c0c0c0] text-[11px] w-[30%] text-right">{bid.size}</Text>
                <Text className="text-[#c0c0c0] text-[11px] w-[35%] text-right">{bid.total}</Text>
              </View>
            ))}

            {/* Bid/Ask Bar */}
            <View className="mt-2.5">
              <View className="flex-row items-center gap-1">
                <Text className="text-[#0ecb81] text-[10px]">B</Text>
                <View className="flex-[0.56] h-[5px] bg-[#0ecb81] opacity-30 rounded-full" />
                <View className="flex-[0.44] h-[5px] bg-[#f6465d] opacity-30 rounded-full" />
                <Text className="text-[#f6465d] text-[10px]">S</Text>
              </View>
              <View className="flex-row justify-between mt-1 px-3">
                <Text className="text-[#0ecb81] text-[9px]">56%</Text>
                <Text className="text-[#f6465d] text-[9px]">44%</Text>
              </View>
            </View>
          </View>
        )}

        {(activeTab === 'trades' || activeTab === 'info') && (
          <View className="bg-[#161616] rounded-[12px] mx-[14px] p-4 mt-2">
            <Text className="text-[#555] text-center text-xs">More content coming soon.</Text>
          </View>
        )}

        {/* SECTION 4 - ORDER BOOK & ORDER PANEL SIDE-BY-SIDE */}
        <View className="flex-row mx-[14px] mt-2.5 gap-2.5">
          {/* LEFT: Mini Order Book */}
          <View className="flex-1 bg-[#111] rounded-[10px] p-2 border border-[#1e1e1e]">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-[11px] font-semibold">Order Book</Text>
              <View className="flex-row items-center bg-[#222] px-1 py-0.5 rounded">
                <Text className="text-[#888] text-[9px] mr-1">0.25</Text>
                <Ionicons name="chevron-down" size={10} color="#888" />
              </View>
            </View>

            {/* Columns */}
            <View className="flex-row justify-between mb-1 pb-1 border-b border-[#1e1e1e]">
              <Text className="text-[#444] text-[9px] w-[35%]">Price</Text>
              <Text className="text-[#444] text-[9px] w-[30%] text-right">Size</Text>
              <Text className="text-[#444] text-[9px] w-[35%] text-right">Total</Text>
            </View>

            {/* Asks */}
            {asks.slice(0, 9).map((ask, i) => (
              <View key={i} className="flex-row justify-between py-0.5 relative">
                <View className="absolute top-0 right-0 bottom-0 bg-[#f6465d] opacity-10" style={{ width: `${10 + i * 12}%` }} />
                <Text className="text-[#f6465d] text-[10px] font-medium w-[35%]">{ask.price}</Text>
                <Text className="text-[#e0e0e0] text-[10px] w-[30%] text-right">{ask.size}</Text>
                <Text className="text-[#e0e0e0] text-[10px] w-[35%] text-right">{ask.total}</Text>
              </View>
            ))}

            {/* Current Price Row */}
            <View className="bg-[#1a1a1a] rounded py-1 px-1 my-1 flex-row items-center justify-between">
              <Text className="text-[#f97316] text-[12px] font-bold">104,975.50</Text>
              <Ionicons name="arrow-up" size={10} color="#f97316" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>

            {/* Bids */}
            {bids.slice(0, 7).map((bid, i) => (
              <View key={i} className="flex-row justify-between py-0.5 relative">
                <View className="absolute top-0 right-0 bottom-0 bg-[#0ecb81] opacity-10" style={{ width: `${80 - i * 10}%` }} />
                <Text className="text-[#0ecb81] text-[10px] font-medium w-[35%]">{bid.price}</Text>
                <Text className="text-[#e0e0e0] text-[10px] w-[30%] text-right">{bid.size}</Text>
                <Text className="text-[#e0e0e0] text-[10px] w-[35%] text-right">{bid.total}</Text>
              </View>
            ))}
          </View>

          {/* RIGHT: Order Panel */}
          <View className="flex-[1.4] bg-[#161616] rounded-[10px] p-2.5">
            {/* ROW 1: Mode Pills + Leverage Badge */}
            <View className="flex-row items-center pb-2 mb-2 border-b border-[#1e1e1e]">
              <View className="flex-row gap-1">
                <TouchableOpacity 
                  onPress={() => setMarginMode('cross')}
                  className={`py-1.5 px-2.5 rounded-md ${marginMode === 'cross' ? 'bg-[#f97316]' : 'bg-[#1e1e1e]'}`}
                >
                  <Text className={`text-[11px] ${marginMode === 'cross' ? 'text-white font-bold' : 'text-[#444] font-medium'}`}>Cross</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setMarginMode('isolated')}
                  className={`py-1.5 px-2.5 rounded-md ${marginMode === 'isolated' ? 'bg-[#f97316]' : 'bg-[#1e1e1e]'}`}
                >
                  <Text className={`text-[11px] ${marginMode === 'isolated' ? 'text-white font-bold' : 'text-[#444] font-medium'}`}>Isolated</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center ml-auto">
                <TouchableOpacity 
                  onPress={() => setLeverageModalVisible(true)}
                  className="flex-row items-center gap-1 bg-[#1e1e1e] rounded-md py-1.5 px-2"
                >
                  <Text className="text-[#f97316] text-[12px] font-bold">{leverage}x</Text>
                  <Ionicons name="chevron-down" size={12} color="#f97316" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ROW 2: Order Type Tabs */}
            <View className="flex-row border-b border-[#1e1e1e] mb-2">
              <TouchableOpacity onPress={() => setOrderType('limit')} className={`flex-1 pb-1.5 ${orderType === 'limit' ? 'border-b-2 border-[#f97316]' : ''}`}>
                <Text className={`text-center text-[12px] font-medium ${orderType === 'limit' ? 'text-[#f97316]' : 'text-[#444]'}`}>Limit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOrderType('market')} className={`flex-1 pb-1.5 ${orderType === 'market' ? 'border-b-2 border-[#f97316]' : ''}`}>
                <Text className={`text-center text-[12px] font-medium ${orderType === 'market' ? 'text-[#f97316]' : 'text-[#444]'}`}>Market</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOrderType('stopLimit')} className={`flex-1 pb-1.5 ${orderType === 'stopLimit' ? 'border-b-2 border-[#f97316]' : ''}`}>
                <Text className={`text-center text-[12px] font-medium ${orderType === 'stopLimit' ? 'text-[#f97316]' : 'text-[#444]'}`}>Stop</Text>
              </TouchableOpacity>
            </View>

            {/* ROW 3: Price + Quantity SIDE BY SIDE */}
            <View className="mb-2.5">
              <Text className="text-[#444] text-[11px] mb-1">Price (PKR)</Text>
              <View className="flex-row items-center bg-[#111] rounded-md py-2 px-2.5">
                <TouchableOpacity><Text className="text-[#888] text-[16px] leading-4">-</Text></TouchableOpacity>
                <TextInput 
                  value={limitPrice}
                  onChangeText={setLimitPrice}
                  className="flex-1 text-center text-white text-[12px] font-semibold py-0"
                  keyboardType="numeric"
                />
                <TouchableOpacity><Text className="text-[#888] text-[16px] leading-4">+</Text></TouchableOpacity>
              </View>
            </View>

            <View className="mb-2.5">
              <Text className="text-[#444] text-[11px] mb-1">Qty (Lots)</Text>
              <View className="flex-row items-center bg-[#111] rounded-md py-2 px-2.5">
                <TouchableOpacity><Text className="text-[#888] text-[16px] leading-4">-</Text></TouchableOpacity>
                <TextInput 
                  value={quantity}
                  onChangeText={setQuantity}
                  className="flex-1 text-center text-white text-[12px] font-semibold py-0"
                  keyboardType="numeric"
                />
                <TouchableOpacity><Text className="text-[#888] text-[16px] leading-4">+</Text></TouchableOpacity>
              </View>
            </View>

            {/* ROW 4: PERCENTAGE SLIDER */}
            <View className="mb-3">
              <View className="h-1.5 bg-[#1e1e1e] w-full rounded-full relative justify-center">
                <View className="absolute left-0 top-0 bottom-0 bg-[#f97316] rounded-full" style={{ width: `${sliderValue}%` }} />
                <View 
                  className="absolute w-3.5 h-3.5 bg-[#f97316] rounded-full -top-1" 
                  style={{ left: `${sliderValue}%`, transform: [{ translateX: -7 }] }} 
                />
              </View>
              <View className="flex-row justify-between mt-1.5">
                {[0, 25, 50, 75, 100].map((val) => (
                  <TouchableOpacity key={val} onPress={() => setSliderValue(val)}>
                    <Text className="text-[#333] text-[9px]">{val}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ROW 5: ORDER SUMMARY STRIP */}
            <View className="flex-row justify-between bg-[#111] rounded-md py-2 px-2 mb-2.5">
              <View>
                <Text className="text-[#444] text-[10px]">Order Value</Text>
                <Text className="text-[#e0e0e0] text-[11px] font-semibold mt-0.5">1,049,755.00</Text>
              </View>
              <View className="items-end">
                <Text className="text-[#444] text-[10px]">Required Margin</Text>
                <Text className="text-[#e0e0e0] text-[11px] font-semibold mt-0.5">104,975.50</Text>
              </View>
            </View>

            {/* ROW 6: LONG / SHORT BUTTONS */}
            <View className="flex-row gap-2 mb-2.5">
              <TouchableOpacity onPress={() => handleOrder('Long')} className="flex-1 bg-[#22c55e] rounded-md py-3">
                <Text className="text-white text-[14px] font-bold text-center">Long  ↗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOrder('Short')} className="flex-1 bg-[#ef4444] rounded-md py-3">
                <Text className="text-white text-[14px] font-bold text-center">Short  ↙</Text>
              </TouchableOpacity>
            </View>

            {/* ROW 7: MARGIN INFO STRIP */}
            <View className="flex-row justify-between border-t border-[#1e1e1e] pt-2">
              <View className="items-center">
                <Text className="text-[#333] text-[9px]">Avail. Margin</Text>
                <Text className="text-[#555] text-[10px] font-medium mt-0.5">1,11,331</Text>
              </View>
              <View className="items-center">
                <Text className="text-[#333] text-[9px]">Used</Text>
                <Text className="text-[#555] text-[10px] font-medium mt-0.5">18,742</Text>
              </View>
              <View className="items-center">
                <Text className="text-[#333] text-[9px]">Ratio</Text>
                <Text className="text-[#f97316] text-[10px] font-medium mt-0.5">16.8%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 5 - OPEN POSITIONS */}
        <View className="mx-3.5 mt-2.5 mb-2">
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

      {/* LEVERAGE MODAL */}
      <Modal
        visible={leverageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLeverageModalVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-[#161616] rounded-t-2xl p-5">
            <Text className="text-white text-[15px] font-semibold mb-1">Adjust Leverage</Text>
            <Text className="text-[#555] text-[12px] mb-4">KSE-100 Futures</Text>
            
            <Text className="text-[#f97316] text-[32px] font-bold text-center mb-4">{leverage}x</Text>
            
            <View className="my-2">
              <View className="h-1 bg-[#222] w-full rounded-full relative justify-center">
                <View className="absolute left-0 top-0 bottom-0 bg-[#f97316] rounded-full" style={{ width: `${(leverage / 125) * 100}%` }} />
                <View 
                  className="absolute w-3.5 h-3.5 bg-[#f97316] rounded-full -top-1.5" 
                  style={{ left: `${(leverage / 125) * 100}%`, transform: [{ translateX: -7 }] }} 
                />
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-[#333] text-[10px]">1x</Text>
                <Text className="text-[#333] text-[10px]">25x</Text>
                <Text className="text-[#333] text-[10px]">50x</Text>
                <Text className="text-[#333] text-[10px]">75x</Text>
                <Text className="text-[#333] text-[10px]">125x</Text>
              </View>
            </View>

            <View className="bg-[#1a0e00] rounded-lg p-2.5 mt-3">
              <Text className="text-[#f97316] text-[10px]">⚠ Higher leverage increases risk of liquidation</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setLeverageModalVisible(false)}
              className="bg-[#f97316] rounded-lg py-3 mt-4"
            >
              <Text className="text-white text-[13px] font-bold text-center">Confirm  {leverage}x</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setLeverageModalVisible(false)}
              className="mt-2.5 mb-2"
            >
              <Text className="text-[#444] text-[12px] text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
