import React from 'react';
import { View, Text } from 'react-native';

interface SparklinePlaceholderProps {
  isPositive: boolean;
  width?: number;
  height?: number;
}

export const SparklinePlaceholder: React.FC<SparklinePlaceholderProps> = ({ isPositive, width = 60, height = 30 }) => {
  const colorClass = isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]';
  return (
    <View style={{ width, height }} className="justify-end items-center overflow-hidden">
      <Text className={`${colorClass} opacity-60 text-xs`}>
        {isPositive ? '╱╲╱╲╱' : '╲╱╲╱╲'}
      </Text>
    </View>
  );
};
