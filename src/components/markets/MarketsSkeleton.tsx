import React from 'react';
import { View } from 'react-native';

function Row() {
  return (
    <View className="flex-row items-center px-4 py-3.5 border-b border-[#2A2B2F]">
      <View className="w-10 h-10 rounded-full bg-[#18191C] mr-3" />
      <View className="flex-1 gap-2">
        <View className="h-3.5 w-16 bg-[#18191C] rounded" />
        <View className="h-2.5 w-28 bg-[#141414] rounded" />
      </View>
      <View className="h-8 w-14 bg-[#18191C] rounded ml-3" />
      <View className="h-8 w-12 bg-[#18191C] rounded ml-3" />
    </View>
  );
}

export function MarketsSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <View className="pt-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Row key={i} />
      ))}
    </View>
  );
}
