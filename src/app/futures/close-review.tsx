import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFuturesCloseSheet } from '../../context/FuturesCloseSheetContext';
import { FuturesPosition } from '../../data/mockFutures';
import { exitLegacyRoute } from '../../utils/navigation';

/** @deprecated Opens close sheet — use useFuturesCloseSheet() instead */
export default function FuturesCloseReviewRedirect() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const { openCloseSheet } = useFuturesCloseSheet();

  useEffect(() => {
    if (data) {
      try {
        const position = JSON.parse(data) as FuturesPosition;
        openCloseSheet(position);
      } catch {
        // ignore invalid payload
      }
    }
    const t = setTimeout(() => exitLegacyRoute(router, '/(tabs)/futures'), 0);
    return () => clearTimeout(t);
  }, [data, openCloseSheet, router]);

  return (
    <View className="flex-1 bg-[#050505] items-center justify-center">
      <ActivityIndicator color="#FF8A00" />
    </View>
  );
}
