import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

export const StockTimeframeTabs = () => {
  const [activeFrame, setActiveFrame] = useState('1D');

  return (
    <View className="flex-row justify-between px-4 mt-2">
      {TIMEFRAMES.map((tf) => {
        const isActive = activeFrame === tf;
        return (
          <TouchableOpacity 
            key={tf} 
            onPress={() => setActiveFrame(tf)}
            className={`w-11 h-8 items-center justify-center rounded-full ${isActive ? 'bg-[#FF8A00] border border-[#FF8A00]' : 'border border-transparent'}`}
          >
            <Text className={`text-xs font-semibold ${isActive ? 'text-[#0E1014]' : 'text-app-muted'}`}>
              {tf}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
