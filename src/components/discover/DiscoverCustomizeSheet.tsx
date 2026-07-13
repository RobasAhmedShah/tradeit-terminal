import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, Text, TouchableOpacity, Switch, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DiscoverWidgetPrefs } from '../../utils/discoverPrefs';
import { hapticSelection } from '../../utils/haptics';

type PrefKey = keyof DiscoverWidgetPrefs;

const ROWS: {
  key: PrefKey;
  title: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: 'showWatchlist',
    title: 'Watchlist',
    sub: 'Your starred stocks strip',
    icon: 'star-outline',
  },
  {
    key: 'showMovers',
    title: 'Top Gainers & Losers',
    sub: 'Market movers on Discover',
    icon: 'trending-up-outline',
  },
  {
    key: 'showCommunity',
    title: 'Community feed',
    sub: 'Posts, Following, and news tabs',
    icon: 'people-outline',
  },
];

interface DiscoverCustomizeSheetProps {
  visible: boolean;
  prefs: DiscoverWidgetPrefs;
  onChange: (next: DiscoverWidgetPrefs) => void;
  onClose: () => void;
}

export const DiscoverCustomizeSheet: React.FC<DiscoverCustomizeSheetProps> = ({
  visible,
  prefs,
  onChange,
  onClose,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const update = (key: PrefKey, value: boolean) => {
    hapticSelection();
    onChange({ ...prefs, [key]: value });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />

        <View
          className="bg-app-sheet rounded-t-3xl border-t border-app-border"
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-app-border" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-3">
            <Text className="text-app-text text-[16px] font-bold">Customize Discover</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center">
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View className="mx-5 bg-app-input rounded-2xl overflow-hidden border border-app-border mb-4">
            {ROWS.map((row, index) => (
              <View
                key={row.key}
                className={`flex-row items-center px-4 py-3.5 ${
                  index < ROWS.length - 1 ? 'border-b border-app-border' : ''
                }`}
              >
                <View className="w-9 h-9 rounded-full bg-app-card-soft items-center justify-center mr-3">
                  <Ionicons name={row.icon} size={18} color="#FF8A00" />
                </View>
                <View className="flex-1 mr-3">
                  <Text className="text-app-text text-[13px] font-medium">{row.title}</Text>
                  <Text className="text-app-muted text-[11px] mt-0.5">{row.sub}</Text>
                </View>
                <Switch
                  value={prefs[row.key]}
                  onValueChange={(value) => update(row.key, value)}
                  trackColor={{ false: '#333', true: '#FF8A00' }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>

          <Text className="text-app-muted text-[11px] px-7 leading-5 text-center mb-2">
            Balance strip always stays visible. Changes save on this device.
          </Text>
        </View>
      </View>
    </Modal>
  );
};
