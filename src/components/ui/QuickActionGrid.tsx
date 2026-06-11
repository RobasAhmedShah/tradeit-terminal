import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const QuickActionGrid = () => {
  const router = useRouter();

  const actions = [
    { id: 'deposit', icon: 'cash-outline', label: 'Deposit', route: '/(tabs)/wallet' as const, highlight: false },
    { id: 'withdraw', icon: 'arrow-up-circle-outline', label: 'Withdraw', route: '/(tabs)/wallet' as const, highlight: false },
    { id: 'transfer', icon: 'swap-horizontal-outline', label: 'Transfer', route: '/(tabs)/wallet' as const, highlight: false },
    { id: 'trade', icon: 'stats-chart', label: 'Trade', route: '/(tabs)/trade' as const, highlight: true },
  ];

  return (
    <View className="flex-row justify-between mx-4 my-2">
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          className={`flex-1 mx-1 bg-[#111214] border rounded-xl py-3 items-center justify-center ${action.highlight ? 'border-[#FF8A00]' : 'border-[#2A2B2F]'}`}
          onPress={() => router.push(action.route)}
        >
          <Ionicons 
            name={action.icon as any} 
            size={24} 
            color={action.highlight ? '#FF8A00' : '#FF8A00'} 
            className="mb-1"
          />
          <Text className={`text-xs mt-1 ${action.highlight ? 'text-[#FF8A00] font-semibold' : 'text-white'}`}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
