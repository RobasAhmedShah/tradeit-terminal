import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

export const StockChartCard = () => {
  const [activeFrame, setActiveFrame] = useState('1D');
  const screenWidth = Dimensions.get('window').width;

  return (
    <View className="mt-4">
      <View className="flex-row justify-between px-6 mb-4">
        {TIMEFRAMES.map((tf) => (
          <TouchableOpacity 
            key={tf} 
            onPress={() => setActiveFrame(tf)}
            className={`w-10 h-8 items-center justify-center rounded-full ${activeFrame === tf ? 'border border-[#FF8A00] bg-[#FF8A00]/10' : ''}`}
          >
            <Text className={`${activeFrame === tf ? 'text-[#FF8A00] font-bold' : 'text-app-muted'} text-xs`}>
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SVG Placeholder matching the premium green gradient line chart */}
      <View className="h-48 w-full px-4 flex-row">
        <View className="flex-1 justify-end pb-6">
          <Text className="text-[#0ECB81] text-sm tracking-[5px] opacity-50">\/\/\__/\/\_/\___/\/`</Text>
          <Text className="text-[#0ECB81] text-lg tracking-[8px] font-bold">/\_/\/\_/\/`</Text>
        </View>
        <View className="w-12 justify-between items-end pb-6">
          <Text className="text-app-muted text-[10px]">920</Text>
          <View className="bg-[#0ECB81] px-1 py-0.5 rounded">
            <Text className="text-black text-[10px] font-bold">904</Text>
          </View>
          <Text className="text-app-muted text-[10px]">880</Text>
          <Text className="text-app-muted text-[10px]">860</Text>
          <Text className="text-app-muted text-[10px]">840</Text>
        </View>
      </View>

      {/* Time axis */}
      <View className="flex-row px-4 mr-12 justify-between">
        <Text className="text-app-muted text-[10px]">09:00</Text>
        <Text className="text-app-muted text-[10px]">12:00</Text>
        <Text className="text-app-muted text-[10px]">15:00</Text>
      </View>
    </View>
  );
};
