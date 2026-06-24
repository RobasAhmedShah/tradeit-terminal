import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="deposit" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="transfer" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="notification-settings" />
    </Stack>
  );
}
