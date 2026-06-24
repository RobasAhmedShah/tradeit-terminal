import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <View className="flex-1 bg-[#050505] items-center justify-center">
        <ActivityIndicator color="#FF8A00" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
