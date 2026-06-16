import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const AppHeader = () => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#050505]">
      {/* Avatar — left */}
      <TouchableOpacity
        className="w-9 h-9 rounded-full border border-[#FF8A00] items-center justify-center bg-[#1A0E00]"
        onPress={() => router.push('/profile')}
      >
        <Text className="text-[#FF8A00] text-xs font-bold">GT</Text>
      </TouchableOpacity>

      {/* Logo — center */}
      <View className="flex-row items-center">
        <Text className="text-white text-xl font-bold tracking-tight">Trade</Text>
        <Text className="text-[#FF8A00] text-xl font-bold tracking-tight">It</Text>
      </View>

      {/* Scan + Notifications — right */}
      <View className="flex-row items-center" style={{ gap: 16 }}>
        <TouchableOpacity>
          <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity className="relative" onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <View className="absolute -top-1 -right-1 bg-[#FF8A00] rounded-full w-4 h-4 items-center justify-center border border-[#050505]">
            <Text className="text-white text-[9px] font-bold">2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
