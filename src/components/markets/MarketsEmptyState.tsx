import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MarketsEmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-16 h-16 rounded-full bg-[#111214] border border-[#2A2B2F] items-center justify-center mb-4">
        <Ionicons name={icon} size={28} color="#555" />
      </View>
      <Text className="text-white font-bold text-base mb-2">{title}</Text>
      <Text className="text-[#9CA3AF] text-sm text-center mb-5">{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} className="bg-[#FF8A00] px-6 py-3 rounded-xl">
          <Text className="text-black font-bold text-sm">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
