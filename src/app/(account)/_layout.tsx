import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function AccountLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
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
