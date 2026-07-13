import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/NotificationsContext';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';

const LOGO = require('../../../assets/image.png');

export type AppHeaderVariant = 'discover' | 'default';

interface AppHeaderProps {
  variant?: AppHeaderVariant;
  title?: string;
  /** Discover only — opens customize widgets sheet */
  onCustomize?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ variant = 'default', title, onCustomize }) => {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { openSearch } = useSearch();
  const { colors } = useTheme();

  const isDiscover = variant === 'discover';

  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: colors.background }}
    >
      <TouchableOpacity
        onPress={() => router.push('/profile')}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        className="w-9 h-9 rounded-lg items-center justify-center overflow-hidden"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image source={LOGO} style={{ width: 30, height: 30 }} resizeMode="contain" />
      </TouchableOpacity>

      {isDiscover ? (
        <View className="flex-row items-center">
          <Text style={{ color: colors.text }} className="text-xl font-bold tracking-tight">
            Trade
          </Text>
          <Text style={{ color: colors.primary }} className="text-xl font-bold tracking-tight">
            It
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors.text }} className="text-[17px] font-bold">
          {title ?? ''}
        </Text>
      )}

      <View className="flex-row items-center gap-1">
        {isDiscover && onCustomize && (
          <TouchableOpacity
            className="p-2"
            onPress={onCustomize}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="options-outline" size={22} color={colors.headerIcon} />
          </TouchableOpacity>
        )}
        {isDiscover && (
          <TouchableOpacity
            className="p-2"
            onPress={openSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search-outline" size={24} color={colors.headerIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="relative p-2" onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.headerIcon} />
          {unreadCount > 0 && (
            <View
              className="absolute top-1 right-1 rounded-full min-w-[16px] h-4 px-0.5 items-center justify-center border"
              style={{ backgroundColor: colors.primary, borderColor: colors.background }}
            >
              <Text className="text-app-text text-[9px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
