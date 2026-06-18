import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TradeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const TradeSearchBar: React.FC<TradeSearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-xl px-4 mx-4 my-2">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search stocks, symbols..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-white ml-2 text-base"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="characters"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};
