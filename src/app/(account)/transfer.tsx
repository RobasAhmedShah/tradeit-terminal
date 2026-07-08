import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { exitLegacyRoute } from '../../utils/navigation';

/** Deep-link fallback: opens transfer sheet then returns when dismissed. */
export default function TransferScreen() {
  const router = useRouter();
  const { openTransfer } = useTransferSheet();

  useEffect(() => {
    openTransfer();
    const t = setTimeout(() => exitLegacyRoute(router, '/(tabs)/portfolio'), 0);
    return () => clearTimeout(t);
  }, [openTransfer, router]);

  return (
    <View className="flex-1 bg-[#050505] items-center justify-center">
      <ActivityIndicator color="#FF8A00" />
    </View>
  );
}
