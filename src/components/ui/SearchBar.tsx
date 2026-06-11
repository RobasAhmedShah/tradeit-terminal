import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-[#111214] border border-[#2A2B2F] rounded-2xl px-4 py-2 mx-4 my-2">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput 
        placeholder="Search stocks, futures..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-white ml-2 text-base"
      />
      <TouchableOpacity>
        <Ionicons name="scan-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};
