import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line, Rect, G } from 'react-native-svg';
import { Stock } from '../../types';
import { ChartTimeframe, generateCandles } from '../../utils/chartSeries';
import { ChartRulerLayer, ChartRulerToggle, useChartRuler } from './ChartRulerOverlay';

interface CandlestickChartPlaceholderProps {
  stock: Stock;
}

const TIMEFRAMES: ChartTimeframe[] = ['1m', '15m', '1H', '4H', '1D'];
const BAR_STEP_PX: Record<ChartTimeframe, number> = {
  '1m': 10,
  '15m': 12,
  '1H': 13,
  '4H': 14,
  '1D': 15,
};

export const CandlestickChartPlaceholder: React.FC<CandlestickChartPlaceholderProps> = ({ stock }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 24;
  const chartHeight = 220;
  const priceAxisWidth = 45;
  const mainWidth = chartWidth - priceAxisWidth;

  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const { enabled: rulerEnabled, toggle: toggleRuler } = useChartRuler();
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
  const rulerBounds = {
    width: mainWidth,
    height: chartHeight,
    paddingTop: 12,
    paddingBottom: 24,
    paddingX: 8,
    minPrice: minP,
    maxPrice: maxP,
  };

  return (
    <View className="bg-app-card rounded-xl border border-app-border overflow-hidden">
      <View className="flex-row items-center justify-between px-3 py-2 border-b border-app-border">
        <View className="flex-row items-center">
          {TIMEFRAMES.map((tf) => {
            const active = timeframe === tf;
            return (
              <TouchableOpacity key={tf} onPress={() => setTimeframe(tf)} className={`mr-3 ${active ? 'border-b-2 border-[#FF8A00] pb-1' : ''}`}>
                <Text className={`text-[11px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-app-muted'}`}>{tf}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View className="flex-row items-center">
          <ChartRulerToggle enabled={rulerEnabled} onToggle={toggleRuler} />
          {rulerEnabled ? (
            <Text className="text-app-muted text-[10px] ml-1">Touch chart</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center px-3 py-2 flex-wrap">
        <Text className="text-app-muted text-[10px] mr-2">{stock.symbol} • {timeframe} • PSX</Text>
        <Text className="text-[#0ECB81] text-[10px] mr-2">O {(stock.open ?? stock.price).toFixed(2)}</Text>
        <Text className="text-[#0ECB81] text-[10px] mr-2">H {(stock.high ?? stock.price).toFixed(2)}</Text>
        <Text className="text-[#F6465D] text-[10px] mr-2">L {(stock.low ?? stock.price).toFixed(2)}</Text>
        <Text className={`text-[10px] ${stock.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>C {stock.price.toFixed(2)}</Text>
      </View>

      <View className="flex-row">
        <View style={{ width: mainWidth, height: chartHeight }}>
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
            const color = c.isUp ? '#0ECB81' : '#F6465D';
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
          <ChartRulerLayer
            enabled={rulerEnabled}
            bounds={rulerBounds}
            barStepPx={BAR_STEP_PX[timeframe]}
            timeframeLabel={timeframe}
          />
        </View>

        <View style={{ width: priceAxisWidth, height: chartHeight }} className="border-l border-app-border items-end justify-between py-2 pr-1">
          <Text className="text-app-muted text-[9px]">{maxP.toFixed(2)}</Text>
          <View className="bg-[#FF8A00] px-1 py-0.5 rounded w-full items-end">
            <Text className="text-black text-[9px] font-bold">{stock.price.toFixed(2)}</Text>
          </View>
          <Text className="text-app-muted text-[9px]">{minP.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};
