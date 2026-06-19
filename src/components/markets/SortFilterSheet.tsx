import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable className="bg-[#111214] rounded-t-3xl border-t border-[#2A2B2F] px-4 pt-3 pb-10" onPress={(e) => e.stopPropagation()}>
          <View className="w-10 h-1 bg-[#2A2B2F] rounded-full self-center mb-4" />
          <Text className="text-white text-lg font-bold mb-4">{title}</Text>
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
                <Text className={`font-semibold ${active ? 'text-[#FF8A00]' : 'text-white'}`}>
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
