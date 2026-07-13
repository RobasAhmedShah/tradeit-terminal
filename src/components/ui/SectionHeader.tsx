import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, UI } from '../../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onViewAll }) => {
  return (
    <View className="flex-row items-end justify-between px-4 mt-6 mb-3">
      <View className="flex-row items-center">
        <Text className={UI.sectionTitle + ' mr-2'}>{title}</Text>
        {subtitle && <Text className="text-app-muted text-sm">• {subtitle}</Text>}
      </View>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll} className="flex-row items-center">
          <Text className={UI.sectionLink + ' mr-1'}>View all</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};
