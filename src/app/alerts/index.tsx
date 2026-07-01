import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePriceAlerts } from '../../context/PriceAlertsContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { useAlertSheet } from '../../context/AlertSheetContext';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { hapticLight } from '../../utils/haptics';
import { CompactEmptyState } from '../../components/ui/CompactEmptyState';

function conditionLabel(condition: 'above' | 'below', price: number): string {
  return condition === 'above' ? `Above Rs ${price.toFixed(2)}` : `Below Rs ${price.toFixed(2)}`;
}

export default function PriceAlertsScreen() {
  const router = useRouter();
  const { alerts, toggleAlert, removeAlert } = usePriceAlerts();
  const { showAlert } = useAppAlert();
  const { openAlert, openEditAlert } = useAlertSheet();

  const sorted = useMemo(
    () => [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [alerts]
  );

  const activeCount = alerts.filter((a) => a.isActive).length;

  const handleDelete = (id: string, symbol: string) => {
    showAlert(
      'Delete Alert',
      `Remove price alert for ${symbol}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            hapticLight();
            removeAlert(id);
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#141414]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[17px] font-bold">Price Alerts</Text>
        <TouchableOpacity
          onPress={() => openAlert()}
          className="w-10 items-end"
        >
          <Ionicons name="add" size={26} color="#FF8A00" />
        </TouchableOpacity>
      </View>

      <View className="px-4 py-3 flex-row justify-between items-center">
        <Text className="text-[#666] text-[12px]">
          {activeCount} active · {alerts.length} total
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {sorted.length === 0 ? (
          <CompactEmptyState
            icon="notifications-outline"
            title="No price alerts yet"
            message="Get notified when a stock crosses your target price."
            actionLabel="Create Alert"
            onAction={() => openAlert()}
          />
        ) : (
          sorted.map((alert) => {
            const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === alert.symbol);
            const currentPrice = stock?.price;

            return (
              <TouchableOpacity
                key={alert.id}
                onPress={() => openEditAlert(alert.id)}
                activeOpacity={0.7}
                className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-4 mb-3"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-white text-[15px] font-bold">{alert.symbol}</Text>
                    <Text className="text-[#666] text-[11px] mt-0.5" numberOfLines={1}>
                      {alert.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      hapticLight();
                      toggleAlert(alert.id);
                    }}
                    hitSlop={8}
                  >
                    <View
                      className={`px-2.5 py-1 rounded-full border ${
                        alert.isActive ? 'border-[#00C853]/40 bg-[#00C853]/10' : 'border-[#444] bg-[#18191C]'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${alert.isActive ? 'text-[#00C853]' : 'text-[#666]'}`}
                      >
                        {alert.isActive ? 'Active' : 'Paused'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[#FF8A00] text-[13px] font-semibold">
                      {conditionLabel(alert.condition, alert.targetPrice)}
                    </Text>
                    {currentPrice != null && (
                      <Text className="text-[#555] text-[11px] mt-1">
                        Now Rs {currentPrice.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(alert.id, alert.symbol)}
                    hitSlop={8}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
