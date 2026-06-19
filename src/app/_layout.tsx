import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { WatchlistProvider } from '../context/WatchlistContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import { FuturesProvider } from '../context/FuturesContext';
import { PriceAlertsProvider } from '../context/PriceAlertsContext';
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
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WatchlistProvider>
          <PortfolioProvider>
            <FuturesProvider>
            <PriceAlertsProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(account)" />
            </Stack>
            </PriceAlertsProvider>
          </FuturesProvider>
          </PortfolioProvider>
        </WatchlistProvider>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
