import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type NotifCategory = 'All' | 'Orders' | 'Alerts' | 'News';

interface Notification {
  id: string;
  type: 'order' | 'alert' | 'news' | 'system';
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  symbol?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'order', title: 'Order Executed', isRead: false,
    body: 'Your BUY order for FANM (500 shares @ Rs 904.00) has been fully executed.',
    time: '2m ago', symbol: 'FANM',
  },
  {
    id: '2', type: 'alert', title: 'Price Alert — HBL', isRead: false,
    body: 'HBL crossed your alert price of Rs 210.00. Currently trading at Rs 210.75.',
    time: '18m ago', symbol: 'HBL',
  },
  {
    id: '3', type: 'alert', title: 'Price Alert — PSO', isRead: false,
    body: 'PSO is up +6.92% today, crossing your watchlist alert threshold.',
    time: '45m ago', symbol: 'PSO',
  },
  {
    id: '4', type: 'order', title: 'Order Pending', isRead: true,
    body: 'Your SELL order for OGDC (200 shares @ Rs 120.00) is queued on PSX.',
    time: '1h ago', symbol: 'OGDC',
  },
  {
    id: '5', type: 'news', title: 'Market Update', isRead: true,
    body: "KSE-100 index gains 412 points in today's session, led by fertilizer and banking sectors.",
    time: '2h ago',
  },
  {
    id: '6', type: 'news', title: 'FFC Dividend Declared', isRead: true,
    body: 'Fauji Fertilizer Company (FANM) has declared an interim dividend of Rs 12.95 per share.',
    time: '3h ago', symbol: 'FANM',
  },
  {
    id: '7', type: 'system', title: 'Funds Credited', isRead: true,
    body: 'Rs 500,000.00 has been successfully deposited to your TradeIt wallet from HBL account ending 4521.',
    time: '1d ago',
  },
  {
    id: '8', type: 'order', title: 'Order Cancelled', isRead: true,
    body: 'Your BUY order for AABS (100 shares @ Rs 890.00) was cancelled — GTD expired.',
    time: '2d ago', symbol: 'AABS',
  },
  {
    id: '9', type: 'news', title: 'Sector Alert', isRead: true,
    body: "SBP holds policy rate at 12% — banking stocks expected to react in tomorrow's session.",
    time: '2d ago',
  },
];

const ICON_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  order:  { icon: 'receipt-outline',          color: '#f97316', bg: '#1a0e00' },
  alert:  { icon: 'notifications-outline',    color: '#facc15', bg: '#1a1500' },
  news:   { icon: 'newspaper-outline',         color: '#60a5fa', bg: '#0a1628' },
  system: { icon: 'shield-checkmark-outline', color: '#4ade80', bg: '#0a1f0a' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotifCategory>('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'Orders') return n.type === 'order';
    if (activeTab === 'Alerts') return n.type === 'alert';
    if (activeTab === 'News')   return n.type === 'news' || n.type === 'system';
    return true;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  const tabs: NotifCategory[] = ['All', 'Orders', 'Alerts', 'News'];

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#e0e0e0" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-[16px] font-semibold">
            Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={markAllRead} className="w-24 items-end">
          <Text className="text-[#f97316] text-[12px] font-semibold">Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View className="flex-row px-4 pt-3 pb-1 gap-2">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full border ${
              activeTab === tab ? 'bg-[#f97316] border-[#f97316]' : 'border-[#2A2B2F]'
            }`}
          >
            <Text className={`text-[12px] font-semibold ${activeTab === tab ? 'text-white' : 'text-[#9CA3AF]'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 pt-2" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View className="items-center py-20">
            <Ionicons name="notifications-off-outline" size={48} color="#333" />
            <Text className="text-[#555] text-base mt-4">No notifications here</Text>
          </View>
        ) : (
          filtered.map((notif) => {
            const { icon, color, bg } = ICON_MAP[notif.type];
            return (
              <TouchableOpacity
                key={notif.id}
                onPress={() => markRead(notif.id)}
                className={`flex-row px-4 py-4 border-b border-[#111] ${!notif.isRead ? 'bg-[#0d0d0f]' : ''}`}
              >
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Ionicons name={icon} size={20} color={color} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-white text-[13px] font-bold flex-1 mr-2" numberOfLines={1}>
                      {notif.title}
                      {notif.symbol ? <Text className="text-[#f97316]"> · {notif.symbol}</Text> : null}
                    </Text>
                    <Text className="text-[#555] text-[11px]">{notif.time}</Text>
                  </View>
                  <Text className="text-[#888] text-[12px] leading-5">{notif.body}</Text>
                </View>

                {!notif.isRead && (
                  <View className="w-2 h-2 rounded-full bg-[#f97316] mt-1.5 ml-2 flex-shrink-0" />
                )}
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
