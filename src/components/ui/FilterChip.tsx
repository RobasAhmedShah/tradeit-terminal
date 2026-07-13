import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  isShariah?: boolean;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress, isShariah }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
        isActive 
          ? 'border-[#FF8A00]' 
          : 'bg-app-card border-app-border'
      }`}
    >
      {isShariah && (
        <Ionicons name="moon" size={12} color="#0ECB81" className="mr-1" style={{ marginRight: 4 }} />
      )}
      <Text className={`${isActive ? 'text-[#FF8A00]' : 'text-app-muted'} font-semibold`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
