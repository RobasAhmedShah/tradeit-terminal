import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MarketsEmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-16 h-16 rounded-full bg-app-card border border-app-border items-center justify-center mb-4">
        <Ionicons name={icon} size={28} color={colors.muted} />
      </View>
      <Text className="text-app-text font-bold text-base mb-2">{title}</Text>
      <Text className="text-app-muted text-sm text-center mb-5">{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} className="bg-[#FF8A00] px-6 py-3 rounded-xl">
          <Text className="text-black font-bold text-sm">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
