import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const FloatingActionBtn = () => {
  return (
    <View className="absolute bottom-6 right-6 shadow-lg shadow-black">
      <TouchableOpacity className="bg-[#FF8A00] w-14 h-14 rounded-full items-center justify-center">
        <Ionicons name="add" size={30} color="#0E1014" />
      </TouchableOpacity>
    </View>
  );
};
