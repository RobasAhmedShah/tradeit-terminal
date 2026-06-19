import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

/** @deprecated Use /markets?tab=watchlist */
export default function WatchlistRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/markets?tab=watchlist');
  }, [router]);
  return <View className="flex-1 bg-[#050505]" />;
}
