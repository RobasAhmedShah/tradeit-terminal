import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { WatchlistProvider } from '../context/WatchlistContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import { FuturesProvider } from '../context/FuturesContext';
import '../../global.css';


const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={MyTheme}>
      <SafeAreaProvider>
        <WatchlistProvider>
          <PortfolioProvider>
            <FuturesProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(account)" />
            </Stack>
          </FuturesProvider>
          </PortfolioProvider>
        </WatchlistProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
