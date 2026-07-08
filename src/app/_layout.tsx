import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { WatchlistProvider } from '../context/WatchlistContext';
import { MarketPricesProvider } from '../context/MarketPricesContext';
import { AuthProvider } from '../context/AuthContext';
import { AppAlertProvider } from '../context/AppAlertContext';
import { TransferSheetProvider } from '../context/TransferSheetContext';
import { AlertSheetProvider } from '../context/AlertSheetContext';
import { SearchProvider } from '../context/SearchContext';
import { AppMenuProvider } from '../context/AppMenuContext';
import { PostsProvider } from '../context/PostsContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import { FuturesProvider } from '../context/FuturesContext';
import { FuturesCloseSheetProvider } from '../context/FuturesCloseSheetContext';
import { PriceAlertsProvider } from '../context/PriceAlertsContext';
import { NotificationsProvider } from '../context/NotificationsContext';
import { OrdersProvider } from '../context/OrdersContext';
import { EditOrderSheetProvider } from '../context/EditOrderSheetContext';
import { OrderDetailSheetProvider } from '../context/OrderDetailSheetContext';
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

const STACK_SCREEN_OPTIONS = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: { backgroundColor: COLORS.background },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={MyTheme}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaProvider>
        <AppAlertProvider>
        <MarketPricesProvider>
        <AuthProvider>
        <WatchlistProvider>
          <PortfolioProvider>
            <FuturesProvider>
            <FuturesCloseSheetProvider>
            <SearchProvider>
            <AppMenuProvider>
            <NotificationsProvider>
            <PostsProvider>
            <PriceAlertsProvider>
            <AlertSheetProvider>
            <OrdersProvider>
            <EditOrderSheetProvider>
            <OrderDetailSheetProvider>
            <TransferSheetProvider>
            <PriceAlertMonitor />
            <OrderFillMonitor />
            <FuturesOrderFillMonitor />
            <StatusBar style="light" />
            <Stack screenOptions={STACK_SCREEN_OPTIONS}>
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(account)" />
              {/* Primary screens */}
              <Stack.Screen name="markets" />
              <Stack.Screen name="stock/[symbol]" />
              <Stack.Screen name="spot/[symbol]" />
              <Stack.Screen
                name="alerts/index"
                options={{ presentation: 'card', contentStyle: { backgroundColor: COLORS.background } }}
              />
              <Stack.Screen name="orders/index" />
              <Stack.Screen name="portfolio/holdings" />
              <Stack.Screen name="portfolio/activity" />
              <Stack.Screen name="portfolio/holding/[symbol]" />
              <Stack.Screen name="futures/position/[id]" />
              <Stack.Screen name="news/[id]" />
              <Stack.Screen name="community/compose" />
              {/* Legacy deep links — redirect or open sheet, then exit */}
              <Stack.Screen name="watchlist" options={{ animation: 'none' }} />
              <Stack.Screen name="news" options={{ animation: 'none' }} />
              <Stack.Screen name="orders/open" options={{ animation: 'none' }} />
              <Stack.Screen name="orders/history" options={{ animation: 'none' }} />
              <Stack.Screen name="orders/[id]" options={{ animation: 'none' }} />
              <Stack.Screen name="orders/edit/[id]" options={{ animation: 'none' }} />
              <Stack.Screen name="futures/positions" options={{ animation: 'none' }} />
              <Stack.Screen name="futures/close-review" options={{ animation: 'none' }} />
              <Stack.Screen name="futures/close-success" options={{ animation: 'none' }} />
            </Stack>
            </TransferSheetProvider>
            </OrderDetailSheetProvider>
            </EditOrderSheetProvider>
            </OrdersProvider>
            </AlertSheetProvider>
            </PriceAlertsProvider>
            </PostsProvider>
            </NotificationsProvider>
            </AppMenuProvider>
            </SearchProvider>
            </FuturesCloseSheetProvider>
          </FuturesProvider>
          </PortfolioProvider>
        </WatchlistProvider>
        </AuthProvider>
        </MarketPricesProvider>
        </AppAlertProvider>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
