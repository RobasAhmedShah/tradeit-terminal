import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stock } from '../../types';
import { generateLineSeries, seriesToSvgPath } from '../../utils/chartSeries';

interface StockLineChartPlaceholderProps {
  stock: Stock;
}

export const StockLineChartPlaceholder: React.FC<StockLineChartPlaceholderProps> = ({ stock }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 220;
  const paddingX = 16;
  const rightAxisWidth = 50;
  const chartWidth = screenWidth - paddingX * 2 - rightAxisWidth;

  const { path, min, max } = useMemo(() => {
    const series = generateLineSeries(stock, 28);
    return seriesToSvgPath(series, chartWidth, chartHeight, 14);
  }, [stock.symbol, stock.price, chartWidth]);

  const mid = (min + max) / 2;
  const isUp = stock.isPositive;

  return (
    <View className="px-4 py-4 mt-2 mb-2">
      <View className="flex-row">
        <View style={{ width: chartWidth, height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={isUp ? '#00C853' : '#FF3B30'} stopOpacity="0.3" />
                <Stop offset="1" stopColor={isUp ? '#00C853' : '#FF3B30'} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            <Line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />

            <Path d={`${path} L ${chartWidth - 14},${chartHeight - 14} L 14,${chartHeight - 14} Z`} fill="url(#grad)" />
            <Path d={path} fill="none" stroke={isUp ? '#00C853' : '#FF3B30'} strokeWidth="2" />
          </Svg>
        </View>

        <View style={{ width: rightAxisWidth, height: chartHeight }} className="justify-between items-end pl-2 pb-6 pt-4">
          <Text className="text-[#9CA3AF] text-[10px]">{max.toFixed(0)}</Text>
          <View className={`${isUp ? 'bg-[#00C853]' : 'bg-[#FF3B30]'} px-1 py-0.5 rounded`}>
            <Text className="text-black text-[10px] font-bold">{stock.price.toFixed(2)}</Text>
          </View>
          <Text className="text-[#9CA3AF] text-[10px]">{mid.toFixed(0)}</Text>
          <Text className="text-[#9CA3AF] text-[10px]">{min.toFixed(0)}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-2" style={{ width: chartWidth }}>
        <Text className="text-[#9CA3AF] text-[10px]">09:00</Text>
        <Text className="text-[#9CA3AF] text-[10px]">12:00</Text>
        <Text className="text-[#9CA3AF] text-[10px]">15:00</Text>
      </View>
    </View>
  );
};
