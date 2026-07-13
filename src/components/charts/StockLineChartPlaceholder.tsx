import React, { useEffect, useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stock } from '../../types';
import { generateLineSeries, seriesToSvgPath } from '../../utils/chartSeries';
import { ChartRulerLayer, ChartRulerToggle, useChartRuler } from './ChartRulerOverlay';

interface StockLineChartPlaceholderProps {
  stock: Stock;
  onRulerActiveChange?: (active: boolean) => void;
}

const CHART_PADDING = 14;

export const StockLineChartPlaceholder: React.FC<StockLineChartPlaceholderProps> = ({
  stock,
  onRulerActiveChange,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 220;
  const paddingX = 16;
  const rightAxisWidth = 50;
  const chartWidth = screenWidth - paddingX * 2 - rightAxisWidth;
  const { enabled: rulerEnabled, toggle: toggleRuler } = useChartRuler();

  useEffect(() => {
    onRulerActiveChange?.(rulerEnabled);
  }, [rulerEnabled, onRulerActiveChange]);

  const { path, min, max } = useMemo(() => {
    const series = generateLineSeries(stock, 28);
    return seriesToSvgPath(series, chartWidth, chartHeight, CHART_PADDING);
  }, [stock.symbol, stock.price, chartWidth]);

  const mid = (min + max) / 2;
  const isUp = stock.isPositive;
  const rulerBounds = {
    width: chartWidth,
    height: chartHeight,
    paddingTop: CHART_PADDING,
    paddingBottom: CHART_PADDING,
    paddingX: CHART_PADDING,
    minPrice: min,
    maxPrice: max,
  };

  return (
    <View className="px-4 py-4 mt-2 mb-2">
      <View className="flex-row items-center justify-end mb-2" style={{ width: chartWidth + rightAxisWidth }}>
        <ChartRulerToggle enabled={rulerEnabled} onToggle={toggleRuler} />
        {rulerEnabled ? (
          <Text className="text-app-muted text-[10px] ml-2">Touch chart to inspect</Text>
        ) : null}
      </View>

      <View className="flex-row">
        <View style={{ width: chartWidth, height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={isUp ? '#0ECB81' : '#F6465D'} stopOpacity="0.3" />
                <Stop offset="1" stopColor={isUp ? '#0ECB81' : '#F6465D'} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            <Line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />

            <Path d={`${path} L ${chartWidth - CHART_PADDING},${chartHeight - CHART_PADDING} L ${CHART_PADDING},${chartHeight - CHART_PADDING} Z`} fill="url(#grad)" />
            <Path d={path} fill="none" stroke={isUp ? '#0ECB81' : '#F6465D'} strokeWidth="2" />
          </Svg>
          <ChartRulerLayer
            enabled={rulerEnabled}
            bounds={rulerBounds}
            barStepPx={Math.max(8, chartWidth / 28)}
            timeframeLabel="1D"
          />
        </View>

        <View style={{ width: rightAxisWidth, height: chartHeight }} className="justify-between items-end pl-2 pb-6 pt-4">
          <Text className="text-app-muted text-[10px]">{max.toFixed(0)}</Text>
          <View className={`${isUp ? 'bg-[#0ECB81]' : 'bg-[#F6465D]'} px-1 py-0.5 rounded`}>
            <Text className="text-black text-[10px] font-bold">{stock.price.toFixed(2)}</Text>
          </View>
          <Text className="text-app-muted text-[10px]">{mid.toFixed(0)}</Text>
          <Text className="text-app-muted text-[10px]">{min.toFixed(0)}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-2" style={{ width: chartWidth }}>
        <Text className="text-app-muted text-[10px]">09:00</Text>
        <Text className="text-app-muted text-[10px]">12:00</Text>
        <Text className="text-app-muted text-[10px]">15:00</Text>
      </View>
    </View>
  );
};
