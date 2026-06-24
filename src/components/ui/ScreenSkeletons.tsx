import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Pulse({ className }: { className: string }) {
  return <View className={`bg-[#18191C] rounded ${className}`} />;
}

export function TradeListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <View className="pt-2">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center px-4 py-3 border-b border-[#141414]">
          <Pulse className="w-9 h-9 rounded-full mr-3" />
          <View className="flex-1 gap-2">
            <Pulse className="h-3 w-14" />
            <Pulse className="h-2.5 w-24" />
          </View>
          <Pulse className="h-4 w-16 ml-2" />
          <Pulse className="h-4 w-12 ml-3" />
        </View>
      ))}
    </View>
  );
}

export function PortfolioSkeleton() {
  return (
    <View className="px-4 pt-2">
      <Pulse className="h-3 w-32 mx-auto mb-4" />
      <Pulse className="h-36 w-full rounded-2xl mb-4" />
      <Pulse className="h-16 w-full rounded-xl mb-4" />
      <View className="flex-row gap-2 mb-4">
        <Pulse className="h-16 flex-1 rounded-xl" />
        <Pulse className="h-16 flex-1 rounded-xl" />
        <Pulse className="h-16 flex-1 rounded-xl" />
      </View>
      <Pulse className="h-20 w-full rounded-xl mb-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Pulse key={i} className="h-14 w-full rounded-xl mb-2" />
      ))}
    </View>
  );
}

export function SpotTradeSkeleton() {
  return (
    <View className="px-3 pt-2">
      <Pulse className="h-20 w-full rounded-xl mb-4" />
      <Pulse className="h-8 w-full rounded-lg mb-3" />
      <Pulse className="h-44 w-full rounded-xl mb-3" />
      <View className="flex-row gap-2">
        <Pulse className="h-72 flex-[0.52] rounded-xl" />
        <Pulse className="h-72 flex-[0.48] rounded-xl" />
      </View>
    </View>
  );
}

export function ScreenErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name="cloud-offline-outline" size={44} color="#333" />
      <Text className="text-white text-base font-semibold mt-4 text-center">{title}</Text>
      <Text className="text-[#666] text-sm mt-2 text-center leading-5">{message}</Text>
      {onRetry ? (
        <TouchableOpacity onPress={onRetry} className="mt-5 px-5 py-2.5 rounded-full border border-[#FF8A00]">
          <Text className="text-[#FF8A00] font-semibold text-sm">Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
