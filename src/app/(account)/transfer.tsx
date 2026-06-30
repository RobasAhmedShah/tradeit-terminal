import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransferSheet } from '../../context/TransferSheetContext';

/** Deep-link fallback: opens transfer sheet then returns when dismissed. */
export default function TransferScreen() {
  const router = useRouter();
  const { openTransfer } = useTransferSheet();

  useEffect(() => {
    openTransfer(() => router.back());
  }, [openTransfer, router]);

  return <View className="flex-1 bg-[#050505]" />;
}
