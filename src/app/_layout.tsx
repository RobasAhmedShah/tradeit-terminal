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
import { NotificationsProvider } from '../context/NotificationsContext';
import { OrdersProvider } from '../context/OrdersContext';
import { PriceAlertMonitor } from '../components/system/PriceAlertMonitor';
import { OrderFillMonitor } from '../components/system/OrderFillMonitor';
import { FuturesOrderFillMonitor } from '../components/system/FuturesOrderFillMonitor';
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
            <NotificationsProvider>
            <OrdersProvider>
            <PriceAlertMonitor />
            <OrderFillMonitor />
            <FuturesOrderFillMonitor />
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(account)" />
              <Stack.Screen name="markets" />
              <Stack.Screen name="stock/[symbol]" />
              <Stack.Screen name="spot/[symbol]" />
              <Stack.Screen name="alerts/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="alerts/create" />
              <Stack.Screen name="orders/open" />
              <Stack.Screen name="orders/history" />
              <Stack.Screen name="orders/[id]" />
              <Stack.Screen name="orders/edit/[id]" />
              <Stack.Screen name="(order-flow)/order-review" />
              <Stack.Screen name="(order-flow)/order-success" />
              <Stack.Screen name="portfolio/holdings" />
              <Stack.Screen name="portfolio/activity" />
              <Stack.Screen name="portfolio/holding/[symbol]" />
              <Stack.Screen name="futures/positions" />
              <Stack.Screen name="futures/position/[id]" />
              <Stack.Screen name="futures/close-review" />
              <Stack.Screen name="futures/close-success" />
              <Stack.Screen name="news/[id]" />
            </Stack>
            </OrdersProvider>
            </NotificationsProvider>
            </PriceAlertsProvider>
          </FuturesProvider>
          </PortfolioProvider>
        </WatchlistProvider>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
