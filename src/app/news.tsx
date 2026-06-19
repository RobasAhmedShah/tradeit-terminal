import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

/** @deprecated Use /markets?tab=news */
export default function NewsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/markets?tab=news');
  }, [router]);
  return <View className="flex-1 bg-[#050505]" />;
}
