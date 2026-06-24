import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line, Rect, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../../types';
import { ChartTimeframe, generateCandles } from '../../utils/chartSeries';

interface CandlestickChartPlaceholderProps {
  stock: Stock;
}

const TIMEFRAMES: ChartTimeframe[] = ['1m', '15m', '1H', '4H', '1D'];

export const CandlestickChartPlaceholder: React.FC<CandlestickChartPlaceholderProps> = ({ stock }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 24;
  const chartHeight = 220;
  const priceAxisWidth = 45;
  const mainWidth = chartWidth - priceAxisWidth;

  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const candles = useMemo(() => generateCandles(stock, timeframe), [stock.symbol, stock.price, timeframe]);

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const maxP = Math.max(...prices, stock.price);
  const minP = Math.min(...prices, stock.price);
  const span = maxP - minP || 1;

  const mapY = (price: number) => 12 + ((maxP - price) / span) * (chartHeight - 36);

  const mapped = candles.map((c) => ({
    ...c,
    yHigh: mapY(c.high),
    yLow: mapY(c.low),
    yOpen: mapY(c.open),
    yClose: mapY(c.close),
  }));

  const currentY = mapY(stock.price);

  return (
    <View className="bg-[#111214] rounded-xl border border-[#2A2B2F] overflow-hidden">
      <View className="flex-row items-center justify-between px-3 py-2 border-b border-[#2A2B2F]">
        <View className="flex-row items-center">
          {TIMEFRAMES.map((tf) => {
            const active = timeframe === tf;
            return (
              <TouchableOpacity key={tf} onPress={() => setTimeframe(tf)} className={`mr-3 ${active ? 'border-b-2 border-[#FF8A00] pb-1' : ''}`}>
                <Text className={`text-[11px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>{tf}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View className="flex-row items-center">
          <Ionicons name="options-outline" size={16} color="#9CA3AF" />
        </View>
      </View>

      <View className="flex-row items-center px-3 py-2 flex-wrap">
        <Text className="text-[#9CA3AF] text-[10px] mr-2">{stock.symbol} • {timeframe} • PSX</Text>
        <Text className="text-[#00C853] text-[10px] mr-2">O {(stock.open ?? stock.price).toFixed(2)}</Text>
        <Text className="text-[#00C853] text-[10px] mr-2">H {(stock.high ?? stock.price).toFixed(2)}</Text>
        <Text className="text-[#FF3B30] text-[10px] mr-2">L {(stock.low ?? stock.price).toFixed(2)}</Text>
        <Text className={`text-[10px] ${stock.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>C {stock.price.toFixed(2)}</Text>
      </View>

      <View className="flex-row">
        <Svg width={mainWidth} height={chartHeight}>
          {[0.25, 0.5, 0.75].map((pct) => (
            <Line
              key={pct}
              x1="0"
              y1={12 + (chartHeight - 36) * pct}
              x2={mainWidth}
              y2={12 + (chartHeight - 36) * pct}
              stroke="#2A2B2F"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          ))}

          {mapped.map((c, i) => {
            const color = c.isUp ? '#00C853' : '#FF3B30';
            return (
              <G key={i}>
                <Line x1={c.x} y1={c.yHigh} x2={c.x} y2={c.yLow} stroke={color} strokeWidth="1" />
                <Rect
                  x={c.x - 3}
                  y={Math.min(c.yOpen, c.yClose)}
                  width="6"
                  height={Math.max(1, Math.abs(c.yOpen - c.yClose))}
                  fill={color}
                />
                <Rect
                  x={c.x - 2}
                  y={chartHeight - c.volume * 0.35 - 6}
                  width="4"
                  height={c.volume * 0.35}
                  fill={color}
                  opacity="0.45"
                />
              </G>
            );
          })}

          <Line x1="0" y1={currentY} x2={mainWidth} y2={currentY} stroke="#FF8A00" strokeWidth="1" strokeDasharray="4 4" />
        </Svg>

        <View style={{ width: priceAxisWidth, height: chartHeight }} className="border-l border-[#2A2B2F] items-end justify-between py-2 pr-1">
          <Text className="text-[#9CA3AF] text-[9px]">{maxP.toFixed(2)}</Text>
          <View className="bg-[#FF8A00] px-1 py-0.5 rounded w-full items-end">
            <Text className="text-black text-[9px] font-bold">{stock.price.toFixed(2)}</Text>
          </View>
          <Text className="text-[#9CA3AF] text-[9px]">{minP.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};
