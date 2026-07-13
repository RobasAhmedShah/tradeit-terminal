import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

interface SortOption {
  key: string;
  label: string;
}

interface SortFilterSheetProps {
  visible: boolean;
  title: string;
  options: SortOption[];
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}

export function SortFilterSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: SortFilterSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-app-sheet rounded-t-3xl border-t border-app-border px-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-10 h-1 rounded-full self-center mb-4" style={{ backgroundColor: colors.border }} />
          <Text className="text-app-text text-lg font-bold mb-4">{title}</Text>
          {options.map((opt) => {
            const active = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  onSelect(opt.key);
                  onClose();
                }}
                className={`flex-row items-center justify-between py-4 px-3 rounded-xl mb-1 border ${
                  active ? 'bg-[#FF8A00]/10 border-[#FF8A00]' : 'border-transparent'
                }`}
              >
                <Text className={`font-semibold ${active ? 'text-[#FF8A00]' : 'text-app-text'}`}>
                  {opt.label}
                </Text>
                {active && <Ionicons name="checkmark" size={20} color="#FF8A00" />}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
