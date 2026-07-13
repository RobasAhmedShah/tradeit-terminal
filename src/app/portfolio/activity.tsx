import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { PortfolioActivityList } from '../../components/portfolio/PortfolioActivityList';
import { safeBack } from '../../utils/navigation';

export default function PortfolioActivityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { activities } = usePortfolio();

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="flex-row items-center px-4 py-3 border-b border-app-border">
        <TouchableOpacity onPress={() => safeBack(router, '/(tabs)/portfolio')} className="w-10">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-app-text text-lg font-bold mr-10">Activity</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-app-muted text-xs mb-4">
          Deposits, withdrawals, trades, and pending orders in one place.
        </Text>
        <PortfolioActivityList items={activities} />
      </ScrollView>
    </SafeAreaView>
  );
}
