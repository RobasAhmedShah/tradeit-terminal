import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioActivityList } from '../../components/portfolio/PortfolioActivityList';

export default function PortfolioActivityScreen() {
  const router = useRouter();
  const { activities } = usePortfolio();

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <View className="flex-row items-center px-4 py-3 border-b border-[#2A2B2F]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Activity</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[#9CA3AF] text-xs mb-4">
          Deposits, withdrawals, trades, and pending orders in one place.
        </Text>
        <PortfolioActivityList items={activities} />
      </ScrollView>
    </SafeAreaView>
  );
}
