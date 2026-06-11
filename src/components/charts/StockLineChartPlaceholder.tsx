import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export const StockLineChartPlaceholder = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 220;
  const paddingX = 16;
  const rightAxisWidth = 50;
  const chartWidth = screenWidth - paddingX * 2 - rightAxisWidth;

  // Mock path for a stock chart
  const pathData = `M 0,150 L 20,120 L 40,140 L 60,90 L 80,100 L 100,50 L 120,70 L 140,20 L 160,40 L 180,10 L ${chartWidth},30`;

  return (
    <View className="px-4 py-4 mt-2 mb-2">
      <View className="flex-row">
        {/* Main Chart Area */}
        <View style={{ width: chartWidth, height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#00C853" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#00C853" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            
            {/* Grid lines */}
            <Line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#2A2B2F" strokeWidth="1" strokeDasharray="4 4" />

            {/* Filled Area */}
            <Path 
              d={`${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#grad)"
            />
            {/* Stroke Line */}
            <Path 
              d={pathData}
              fill="none"
              stroke="#00C853"
              strokeWidth="2"
            />
          </Svg>
        </View>

        {/* Right Axis Labels */}
        <View style={{ width: rightAxisWidth, height: chartHeight }} className="justify-between items-end pl-2 pb-6 pt-4">
          <Text className="text-[#9CA3AF] text-[10px]">920</Text>
          <View className="bg-[#00C853] px-1 py-0.5 rounded">
            <Text className="text-black text-[10px] font-bold">904</Text>
          </View>
          <Text className="text-[#9CA3AF] text-[10px]">880</Text>
          <Text className="text-[#9CA3AF] text-[10px]">860</Text>
          <Text className="text-[#9CA3AF] text-[10px]">840</Text>
        </View>
      </View>

      {/* Bottom Time Axis */}
      <View className="flex-row justify-between mt-2" style={{ width: chartWidth }}>
        <Text className="text-[#9CA3AF] text-[10px]">09:00</Text>
        <Text className="text-[#9CA3AF] text-[10px]">12:00</Text>
        <Text className="text-[#9CA3AF] text-[10px]">15:00</Text>
      </View>
    </View>
  );
};
