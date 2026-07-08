import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/NotificationsContext';
import { useSearch } from '../../context/SearchContext';
import { useAppMenu } from '../../context/AppMenuContext';
import { COLORS } from '../../constants/theme';

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
  const { openMenu } = useAppMenu();

  const isDiscover = variant === 'discover';

  return (
    <View className="flex-row items-center justify-between px-4 py-3" style={{ backgroundColor: COLORS.background }}>
      {isDiscover ? (
        <TouchableOpacity
          onPress={openMenu}
          className="w-9 h-9 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={LOGO} style={{ width: 28, height: 28 }} resizeMode="contain" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={openMenu}
          className="w-9 h-9 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="menu" size={26} color={COLORS.text} />
        </TouchableOpacity>
      )}

      {isDiscover ? (
        <View className="flex-row items-center">
          <Text className="text-white text-xl font-bold tracking-tight">Trade</Text>
          <Text style={{ color: COLORS.primary }} className="text-xl font-bold tracking-tight">
            It
          </Text>
        </View>
      ) : (
        <Text className="text-white text-[17px] font-bold">{title ?? ''}</Text>
      )}

      <View className="flex-row items-center gap-1">
        {isDiscover && onCustomize && (
          <TouchableOpacity
            className="p-2"
            onPress={onCustomize}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="options-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        )}
        {isDiscover && (
          <TouchableOpacity
            className="p-2"
            onPress={openSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="relative p-2" onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          {unreadCount > 0 && (
            <View
              className="absolute top-1 right-1 rounded-full min-w-[16px] h-4 px-0.5 items-center justify-center border"
              style={{ backgroundColor: COLORS.primary, borderColor: COLORS.background }}
            >
              <Text className="text-white text-[9px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
