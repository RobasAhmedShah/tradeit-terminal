import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

interface CompactEmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CompactEmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: CompactEmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="mx-4 my-5 bg-app-sheet border border-app-border rounded-2xl px-5 py-10 items-center">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.inputMuted }}
      >
        <Ionicons name={icon} size={26} color={colors.mutedDarker} />
      </View>
      <Text className="text-app-text text-[15px] font-semibold text-center">{title}</Text>
      {message ? (
        <Text className="text-app-muted text-xs text-center mt-2 leading-5 px-2">{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} className="mt-5">
          <Text style={{ color: COLORS.primary }} className="text-sm font-semibold">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
