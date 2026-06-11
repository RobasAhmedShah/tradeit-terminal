import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line, Rect, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export const CandlestickChartPlaceholder = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 24; // 12px padding on each side (px-3)
  const chartHeight = 220;
  const priceAxisWidth = 45;
  const mainWidth = chartWidth - priceAxisWidth;

  const timeframes = ['1m', '15m', '1H', '4H', '1D', 'More'];

  // Mock data for drawing candlesticks (x, high, low, open, close)
  const candles = [
    { x: 10, h: 100, l: 140, o: 130, c: 110, isUp: true },
    { x: 25, h: 90, l: 120, o: 110, c: 95, isUp: true },
    { x: 40, h: 85, l: 110, o: 95, c: 105, isUp: false },
    { x: 55, h: 100, l: 130, o: 105, c: 125, isUp: false },
    { x: 70, h: 110, l: 160, o: 125, c: 155, isUp: false },
    { x: 85, h: 140, l: 180, o: 155, c: 170, isUp: false },
    { x: 100, h: 160, l: 190, o: 170, c: 185, isUp: false },
    { x: 115, h: 170, l: 185, o: 185, c: 175, isUp: true },
    { x: 130, h: 150, l: 180, o: 175, c: 160, isUp: true },
    { x: 145, h: 130, l: 165, o: 160, c: 140, isUp: true },
    { x: 160, h: 100, l: 145, o: 140, c: 105, isUp: true },
    { x: 175, h: 80, l: 110, o: 105, c: 85, isUp: true },
    { x: 190, h: 60, l: 95, o: 85, c: 70, isUp: true },
    { x: 205, h: 65, l: 100, o: 70, c: 95, isUp: false },
    { x: 220, h: 80, l: 115, o: 95, c: 105, isUp: false },
    { x: 235, h: 90, l: 125, o: 105, c: 120, isUp: false },
    { x: 250, h: 110, l: 140, o: 120, c: 135, isUp: false },
    { x: 265, h: 125, l: 150, o: 135, c: 145, isUp: false },
    { x: 280, h: 130, l: 160, o: 145, c: 155, isUp: false },
    { x: 295, h: 140, l: 170, o: 155, c: 165, isUp: false },
  ];

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] overflow-hidden">
      {/* Top Toolbar */}
      <View className="flex-row items-center justify-between px-3 py-2 border-b border-[#2A2B2F]">
        <View className="flex-row items-center">
          {timeframes.map((tf) => (
            <TouchableOpacity key={tf} className={`mr-4 ${tf === '1D' ? 'border-b-2 border-[#FF8A00] pb-1' : ''}`}>
              <Text className={`text-[11px] font-semibold ${tf === '1D' ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>{tf}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-row items-center">
          <Ionicons name="options-outline" size={16} color="#9CA3AF" className="mr-3" />
          <Ionicons name="expand-outline" size={16} color="#9CA3AF" className="ml-2" />
        </View>
      </View>

      {/* Chart Status Line */}
      <View className="flex-row items-center px-3 py-2">
        <Text className="text-[#9CA3AF] text-[10px] mr-2">AABS • 1D • PSX</Text>
        <Text className="text-[#00C853] text-[10px] mr-2">O 892.50</Text>
        <Text className="text-[#00C853] text-[10px] mr-2">H 912.50</Text>
        <Text className="text-[#00C853] text-[10px] mr-2">L 888.00</Text>
        <Text className="text-[#00C853] text-[10px]">C 904.00</Text>
      </View>

      {/* SVG Candlestick Area */}
      <View className="flex-row">
        <Svg width={mainWidth} height={chartHeight}>
          {/* Subtle Grid */}
          {[50, 100, 150, 200].map((y) => (
            <Line key={y} x1="0" y1={y} x2={mainWidth} y2={y} stroke="#2A2B2F" strokeWidth="0.5" strokeDasharray="2 2" />
          ))}

          {/* Candlesticks */}
          {candles.map((c, i) => {
            const color = c.isUp ? '#00C853' : '#FF3B30';
            return (
              <G key={i}>
                <Line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="1" />
                <Rect x={c.x - 3} y={Math.min(c.o, c.c)} width="6" height={Math.max(1, Math.abs(c.o - c.c))} fill={color} />
              </G>
            );
          })}

          {/* Current Price Line */}
          <Line x1="0" y1="95" x2={mainWidth} y2="95" stroke="#00C853" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Volume Bars */}
          {candles.map((c, i) => {
            const color = c.isUp ? '#00C853' : '#FF3B30';
            const volHeight = 10 + (i * 3) % 25; // Randomish volume
            return (
              <Rect key={`vol-${i}`} x={c.x - 2} y={chartHeight - volHeight - 5} width="4" height={volHeight} fill={color} opacity="0.6" />
            );
          })}
        </Svg>

        {/* Right Price Axis */}
        <View style={{ width: priceAxisWidth, height: chartHeight }} className="border-l border-[#2A2B2F] items-end justify-between py-2 pr-1">
          <Text className="text-[#9CA3AF] text-[9px]">960.00</Text>
          <Text className="text-[#9CA3AF] text-[9px]">920.00</Text>
          <View className="bg-[#00C853] px-1 py-0.5 rounded w-full items-end mt-1">
            <Text className="text-black text-[9px] font-bold">904.00</Text>
          </View>
          <Text className="text-[#9CA3AF] text-[9px]">880.00</Text>
          <Text className="text-[#9CA3AF] text-[9px]">840.00</Text>
          <Text className="text-[#9CA3AF] text-[9px]">800.00</Text>
          <Text className="text-[#9CA3AF] text-[9px]">760.00</Text>
          <View className="flex-1 justify-end pb-4">
            <Text className="text-[#9CA3AF] text-[9px]">5M</Text>
            <View className="bg-[#00C853]/20 px-1 py-0.5 rounded w-full items-end mt-1">
              <Text className="text-[#00C853] text-[9px] font-bold">2.90M</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom X-Axis */}
      <View className="flex-row justify-between px-4 pb-2 border-t border-[#2A2B2F] pt-1" style={{ width: mainWidth }}>
        <Text className="text-[#9CA3AF] text-[9px]">Mar</Text>
        <Text className="text-[#9CA3AF] text-[9px]">Apr</Text>
        <Text className="text-[#9CA3AF] text-[9px]">May</Text>
        <Text className="text-[#9CA3AF] text-[9px]">Jun</Text>
        <Text className="text-[#9CA3AF] text-[9px]">17</Text>
      </View>
    </View>
  );
};
