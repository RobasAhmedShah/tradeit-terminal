import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../context/NotificationsContext';
import { NotificationSettings } from '../../utils/notificationSettingsPrefs';

type SettingKey = keyof NotificationSettings;

const ROWS: { key: SettingKey; title: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    key: 'pushEnabled',
    title: 'Push Notifications',
    sub: 'Allow alerts on this device',
    icon: 'phone-portrait-outline',
  },
  {
    key: 'orderUpdates',
    title: 'Order Updates',
    sub: 'Fills, cancellations, and pending orders',
    icon: 'receipt-outline',
  },
  {
    key: 'priceAlerts',
    title: 'Price Alerts',
    sub: 'When a stock hits your alert price',
    icon: 'alarm-outline',
  },
  {
    key: 'newsUpdates',
    title: 'News & Market',
    sub: 'Headlines and market summaries',
    icon: 'newspaper-outline',
  },
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, ready } = useNotifications();

  const updateSetting = (key: SettingKey, value: boolean) => {
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#1a1a1a]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#e0e0e0" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[16px] font-semibold mr-10">
          Notification Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-[#666] text-[11px] uppercase tracking-wide px-4 pt-5 pb-2">
          Alert preferences
        </Text>

        <View className="mx-4 bg-[#131316] rounded-xl overflow-hidden mb-6">
          {ROWS.map((row, index) => (
            <View
              key={row.key}
              className={`flex-row items-center px-4 py-4 ${index < ROWS.length - 1 ? 'border-b border-[#222]' : ''}`}
            >
              <View className="w-9 h-9 rounded-full bg-[#1a1a1a] items-center justify-center mr-3">
                <Ionicons name={row.icon} size={18} color="#f97316" />
              </View>
              <View className="flex-1 mr-3">
                <Text className="text-[#e0e0e0] text-[13px] font-medium">{row.title}</Text>
                <Text className="text-[#666] text-[11px] mt-0.5">{row.sub}</Text>
              </View>
              <Switch
                value={settings[row.key]}
                onValueChange={(value) => updateSetting(row.key, value)}
                trackColor={{ false: '#333', true: '#f97316' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="mx-4 flex-row items-center justify-between bg-[#131316] rounded-xl px-4 py-4 mb-4"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons name="notifications-outline" size={20} color="#888" style={{ marginRight: 12 }} />
            <View>
              <Text className="text-[#e0e0e0] text-[13px] font-medium">View notification inbox</Text>
              <Text className="text-[#666] text-[11px] mt-0.5">See past alerts and order messages</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </TouchableOpacity>

        <Text className="text-[#555] text-[11px] px-6 pb-8 leading-5 text-center">
          Toggles control which alerts appear in your in-app notification inbox. Device push will be added when the backend is connected.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
