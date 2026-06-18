import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdvancedFilterChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  sortDirection?: 'asc' | 'desc';
  onPress?: () => void;
}

export const AdvancedFilterChip: React.FC<AdvancedFilterChipProps> = ({
  label,
  icon,
  isActive = false,
  sortDirection,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-3 py-1.5 rounded-lg mr-2 border ${
        isActive ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'bg-[#050505] border-[#2A2B2F]'
      }`}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={isActive ? '#FF8A00' : '#9CA3AF'}
          style={{ marginRight: 4 }}
        />
      )}
      <Text className={`text-xs font-medium mr-1 ${isActive ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
        {label}
      </Text>
      <Ionicons
        name={isActive ? (sortDirection === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevron-down'}
        size={12}
        color={isActive ? '#FF8A00' : '#9CA3AF'}
      />
    </TouchableOpacity>
  );
};
