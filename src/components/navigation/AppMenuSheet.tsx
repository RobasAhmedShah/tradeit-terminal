import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

interface AppMenuSheetProps {
  visible: boolean;
  onClose: () => void;
}

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  badge?: number;
  onPress: () => void;
};

export const AppMenuSheet: React.FC<AppMenuSheetProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { summary } = usePortfolio();
  const { openTransfer } = useTransferSheet();
  const { showAlert } = useAppAlert();

  const go = (action: () => void) => {
    onClose();
    setTimeout(action, 120);
  };

  const handleLogout = () => {
    onClose();
    showAlert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  const menuSections: { title?: string; items: MenuItem[] }[] = [
    {
      items: [
        {
          icon: 'person-outline',
          label: 'Profile & Account',
          sub: session?.email ?? 'View account settings',
          onPress: () => go(() => router.push('/profile')),
        },
        {
          icon: 'pie-chart-outline',
          label: 'Portfolio',
          sub: `Rs ${formatPortfolioRs(summary.totalValue)}`,
          onPress: () => go(() => router.push('/(tabs)/portfolio')),
        },
      ],
    },
    {
      title: 'Funds',
      items: [
        { icon: 'arrow-down-outline', label: 'Deposit', onPress: () => go(() => router.push('/deposit')) },
        { icon: 'arrow-up-outline', label: 'Withdraw', onPress: () => go(() => router.push('/withdraw')) },
        {
          icon: 'swap-horizontal-outline',
          label: 'Transfer',
          sub: 'Spot ↔ Futures',
          onPress: () => go(() => openTransfer()),
        },
      ],
    },
    {
      title: 'Trading',
      items: [
        {
          icon: 'list-outline',
          label: 'Open Orders',
          onPress: () =>
            go(() => router.push({ pathname: '/orders', params: { tab: 'spot', view: 'open' } })),
        },
        { icon: 'alarm-outline', label: 'Price Alerts', onPress: () => go(() => router.push('/alerts')) },
        { icon: 'stats-chart-outline', label: 'Markets', onPress: () => go(() => router.push('/markets')) },
      ],
    },
    {
      title: 'More',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          badge: unreadCount,
          onPress: () => go(() => router.push('/notifications')),
        },
        {
          icon: 'time-outline',
          label: 'Activity',
          onPress: () => go(() => router.push('/portfolio/activity')),
        },
      ],
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <Pressable className="flex-1 bg-black/60" onPress={onClose} />

        <View
          className="bg-[#111214] border-r border-[#2A2B2F]"
          style={{ width: '82%', paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#2A2B2F]">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-[#1A0E00] border border-[#FF8A00] items-center justify-center mr-3">
                <Text className="text-[#FF8A00] text-sm font-bold">GT</Text>
              </View>
              <View>
                <Text className="text-white text-[15px] font-bold">{session?.displayName ?? 'Trader'}</Text>
                <View className="flex-row items-center mt-0.5">
                  <Ionicons name="shield-checkmark" size={12} color="#0ECB81" />
                  <Text className="text-[#0ECB81] text-[10px] font-semibold ml-1">KYC Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#8A8D93" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-3 pt-2">
            {menuSections.map((section) => (
              <View key={section.title ?? 'main'} className="mb-3">
                {section.title && (
                  <Text className="text-[#5C6068] text-[10px] font-bold uppercase tracking-wider px-2 mb-1">
                    {section.title}
                  </Text>
                )}
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={item.onPress}
                    className="flex-row items-center px-2 py-3.5 rounded-xl active:bg-[#18191C]"
                  >
                    <View className="w-9 h-9 rounded-lg bg-[#18191C] items-center justify-center mr-3">
                      <Ionicons name={item.icon} size={18} color="#FF8A00" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-[14px] font-semibold">{item.label}</Text>
                      {item.sub && (
                        <Text className="text-[#8A8D93] text-[11px] mt-0.5" numberOfLines={1}>
                          {item.sub}
                        </Text>
                      )}
                    </View>
                    {item.badge != null && item.badge > 0 && (
                      <View className="bg-[#FF8A00] rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center mr-1">
                        <Text className="text-black text-[10px] font-bold">
                          {item.badge > 9 ? '9+' : item.badge}
                        </Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={16} color="#5C6068" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-2 py-3.5 mt-2 mb-4 rounded-xl border border-[#2A2B2F]"
            >
              <View className="w-9 h-9 rounded-lg bg-[#F6465D]/10 items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={18} color="#F6465D" />
              </View>
              <Text className="text-[#F6465D] text-[14px] font-semibold">Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
