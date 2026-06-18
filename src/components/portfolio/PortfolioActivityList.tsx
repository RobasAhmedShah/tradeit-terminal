import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PortfolioActivity, activityIcon, formatActivityTime } from '../../data/portfolioActivity';
import { formatPortfolioRs } from '../../data/mockPortfolio';

interface PortfolioActivityListProps {
  items: PortfolioActivity[];
  compact?: boolean;
}

export function PortfolioActivityList({ items, compact = false }: PortfolioActivityListProps) {
  const router = useRouter();

  const handlePress = (item: PortfolioActivity) => {
    if (item.orderId) {
      router.push(`/orders/${item.orderId}`);
      return;
    }
    if (item.symbol && (item.type === 'buy' || item.type === 'sell')) {
      router.push(`/portfolio/holding/${item.symbol}`);
      return;
    }
    if (item.type === 'deposit') {
      router.push('/deposit');
      return;
    }
    if (item.type === 'withdraw') {
      router.push('/withdraw');
    }
  };

  if (items.length === 0) {
    return (
      <View className="bg-[#111214] rounded-xl p-6 border border-[#2A2B2F] items-center">
        <Text className="text-[#9CA3AF] text-sm">No activity yet</Text>
        <Text className="text-[#9CA3AF] text-xs mt-1 text-center">
          Deposits, trades, and orders will show up here.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {items.map((item) => {
        const icon = activityIcon(item.type);
        const isCredit = item.type === 'deposit' || item.type === 'sell';
        const amountColor = isCredit ? 'text-[#00C853]' : 'text-white';

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePress(item)}
            className={`bg-[#111214] rounded-xl border border-[#2A2B2F] flex-row items-center ${
              compact ? 'p-3' : 'p-4'
            }`}
          >
            <View
              className="w-9 h-9 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${icon.color}18` }}
            >
              <Ionicons name={icon.name as keyof typeof Ionicons.glyphMap} size={18} color={icon.color} />
            </View>

            <View className="flex-1 mr-2">
              <Text className="text-white font-semibold text-[12px]">{item.title}</Text>
              <Text className="text-[#9CA3AF] text-[10px] mt-0.5" numberOfLines={1}>
                {item.subtitle}
              </Text>
              <Text className="text-[#9CA3AF] text-[9px] mt-1">{formatActivityTime(item.timestamp)}</Text>
            </View>

            <View className="items-end">
              <Text className={`font-bold text-[11px] ${amountColor}`}>
                {isCredit ? '+' : '-'}Rs {formatPortfolioRs(item.amount)}
              </Text>
              {item.status === 'pending' && (
                <View className="bg-[#FF8A00]/15 px-1.5 py-0.5 rounded mt-1">
                  <Text className="text-[#FF8A00] text-[8px] font-bold">PENDING</Text>
                </View>
              )}
              {item.status === 'processing' && (
                <View className="bg-[#FF8A00]/15 px-1.5 py-0.5 rounded mt-1">
                  <Text className="text-[#FF8A00] text-[8px] font-bold">PROCESSING</Text>
                </View>
              )}
            </View>

            <Ionicons name="chevron-forward" size={14} color="#9CA3AF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
