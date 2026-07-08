import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderDetailSheet } from '../../context/OrderDetailSheetContext';
import { exitLegacyRoute } from '../../utils/navigation';

/** @deprecated Opens order detail sheet — use useOrderDetailSheet() instead */
export default function OrderDetailRedirect() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { openOrderDetail } = useOrderDetailSheet();

  useEffect(() => {
    if (!id) return;
    openOrderDetail(id);
    const t = setTimeout(() => exitLegacyRoute(router, '/orders?tab=spot&view=open'), 0);
    return () => clearTimeout(t);
  }, [id, openOrderDetail, router]);

  return (
    <View className="flex-1 bg-[#050505] items-center justify-center">
      <ActivityIndicator color="#FF8A00" />
    </View>
  );
}
