import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { AppThemeProvider, useTheme } from '../context/ThemeContext';
import { WatchlistProvider } from '../context/WatchlistContext';
import { MarketPricesProvider } from '../context/MarketPricesContext';
import { AuthProvider } from '../context/AuthContext';
import { AppAlertProvider } from '../context/AppAlertContext';
import { TransferSheetProvider } from '../context/TransferSheetContext';
import { AlertSheetProvider } from '../context/AlertSheetContext';
import { SearchProvider } from '../context/SearchContext';
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
import { SplashGate } from '../components/ui/SplashGate';
import '../../global.css';

function ThemedAppShell() {
  const { colors, isDark, themeVars } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <GestureHandlerRootView style={[{ flex: 1, backgroundColor: colors.background }, themeVars]}>
        <View style={[{ flex: 1, backgroundColor: colors.background }, themeVars]}>
          <SafeAreaProvider>
            <AppAlertProvider>
              <MarketPricesProvider>
                <AuthProvider>
                  <SplashGate>
                  <WatchlistProvider>
                    <PortfolioProvider>
                      <FuturesProvider>
                        <FuturesCloseSheetProvider>
                          <SearchProvider>
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
                                              <StatusBar style={isDark ? 'light' : 'dark'} />
                                              <Stack
                                                screenOptions={{
                                                  headerShown: false,
                                                  animation: 'slide_from_right',
                                                  contentStyle: { backgroundColor: colors.background },
                                                }}
                                              >
                                                <Stack.Screen name="login" />
                                                <Stack.Screen name="(tabs)" />
                                                <Stack.Screen name="(account)" />
                                                <Stack.Screen name="markets" />
                                                <Stack.Screen name="stock/[symbol]" />
                                                <Stack.Screen name="spot/[symbol]" />
                                                <Stack.Screen
                                                  name="alerts/index"
                                                  options={{
                                                    presentation: 'card',
                                                    contentStyle: { backgroundColor: colors.background },
                                                  }}
                                                />
                                                <Stack.Screen name="orders/index" />
                                                <Stack.Screen name="portfolio/holdings" />
                                                <Stack.Screen name="portfolio/activity" />
                                                <Stack.Screen name="portfolio/holding/[symbol]" />
                                                <Stack.Screen name="futures/position/[id]" />
                                                <Stack.Screen name="news/[id]" />
                                                <Stack.Screen name="community/compose" />
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
                          </SearchProvider>
                        </FuturesCloseSheetProvider>
                      </FuturesProvider>
                    </PortfolioProvider>
                  </WatchlistProvider>
                  </SplashGate>
                </AuthProvider>
              </MarketPricesProvider>
            </AppAlertProvider>
          </SafeAreaProvider>
        </View>
      </GestureHandlerRootView>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ThemedAppShell />
    </AppThemeProvider>
  );
}
