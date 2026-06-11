import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdvancedFilterChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const AdvancedFilterChip: React.FC<AdvancedFilterChipProps> = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center px-3 py-1.5 rounded-lg mr-2 bg-[#050505] border border-[#2A2B2F]"
    >
      {icon && <Ionicons name={icon} size={12} color="#9CA3AF" style={{ marginRight: 4 }} />}
      <Text className="text-[#9CA3AF] text-xs font-medium mr-1">{label}</Text>
      <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
    </TouchableOpacity>
  );
};
