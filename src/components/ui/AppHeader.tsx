import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/NotificationsContext';

export const AppHeader = () => {
  const router = useRouter();
  const { unreadCount } = useNotifications();

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

      {/* Notifications — right */}
      <View className="flex-row items-center">
        <TouchableOpacity className="relative" onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#FF8A00] rounded-full min-w-[16px] h-4 px-0.5 items-center justify-center border border-[#050505]">
              <Text className="text-white text-[9px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
