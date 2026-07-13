import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEditOrderSheet } from '../../../context/EditOrderSheetContext';
import { exitLegacyRoute } from '../../../utils/navigation';

/** @deprecated Opens edit sheet — use useEditOrderSheet() instead */
export default function EditOrderRedirect() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { openEditOrder } = useEditOrderSheet();

  useEffect(() => {
    if (!id) return;
    openEditOrder(id);
    const t = setTimeout(() => exitLegacyRoute(router, '/orders?tab=spot&view=open'), 0);
    return () => clearTimeout(t);
  }, [id, openEditOrder, router]);

  return (
    <View className="flex-1 bg-app-bg items-center justify-center">
      <ActivityIndicator color="#FF8A00" />
    </View>
  );
}
