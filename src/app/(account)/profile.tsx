import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive' }
    ]);
  };

  const MenuRow = ({ icon, title, sub, isSecurity, hideBorder, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 ${hideBorder ? '' : 'border-b border-[#222]'}`}
    >
      <View className="mr-4 w-6 items-center">
        <Ionicons name={icon} size={22} color="#888" />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-[#e0e0e0] text-[13px] font-medium">{title}</Text>
        <Text className="text-[#666] text-[11px] mt-0.5">{sub}</Text>
      </View>
      {isSecurity ? (
        <Text className="text-[#22c55e] text-[11px] font-medium">2FA Enabled</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#444" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0c]">
      {/* NAV BAR */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#e0e0e0" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-[16px] font-semibold">Profile</Text>
        </View>
        <View className="flex-row items-center w-16 justify-end">
          <Ionicons name="headset-outline" size={20} color="#e0e0e0" style={{ marginRight: 12 }} />
          <TouchableOpacity className="relative" onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#e0e0e0" />
            <View className="absolute -top-1 -right-1 w-[14px] h-[14px] bg-[#f97316] rounded-full items-center justify-center border border-[#0a0a0c]">
              <Text className="text-white text-[8px] font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* SECTION 1 & 2 - UNIFIED USER & STATS CARD */}
        <View className="mx-4 mb-6 mt-2 bg-[#131316] rounded-xl overflow-hidden border border-transparent">
          {/* Top Info */}
          <View className="p-4 flex-row items-start">
            <View className="w-16 h-16 rounded-full bg-[#1a1a1a] items-center justify-center relative border border-[#222]">
              <Ionicons name="bar-chart" size={28} color="#f97316" />
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full items-center justify-center border-2 border-[#131316]">
                <Ionicons name="camera" size={12} color="#000" />
              </View>
            </View>

            <View className="flex-1 ml-4 justify-center py-1">
              <View className="flex-row items-center">
                <Text className="text-white text-[16px] font-bold">Guest Trader</Text>
                <View className="flex-row items-center bg-[#f97316]/10 rounded-full px-2 py-0.5 ml-2">
                  <Ionicons name="checkmark-circle" size={10} color="#f97316" style={{ marginRight: 3 }} />
                  <Text className="text-[#f97316] text-[9px] font-bold">Verified</Text>
                </View>
              </View>
              <Text className="text-[#888] text-[12px] mt-1">guesttrader@email.com</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-[#666] text-[11px]">Client ID: TID12345678</Text>
                <Ionicons name="copy-outline" size={12} color="#666" style={{ marginLeft: 6 }} />
              </View>
              <View className="self-start flex-row items-center bg-[#2d1b4e]/40 rounded-full px-2.5 py-1 mt-2">
                <Ionicons name="diamond" size={10} color="#a855f7" style={{ marginRight: 4 }} />
                <Text className="text-[#a855f7] text-[10px] font-semibold">Premium Account</Text>
              </View>
            </View>

            <View className="self-center">
              <Ionicons name="chevron-forward" size={16} color="#444" />
            </View>
          </View>

          {/* Bottom Stats */}
          <View className="flex-row py-4 border-t border-[#1e1e1e]">
            <View className="flex-1 items-center border-r border-[#222] px-1">
              <Text className="text-[#666] text-[10px] mb-1.5">Total Equity</Text>
              <Text className="text-white text-[13px] font-bold">PKR 104,973.92</Text>
            </View>
            <View className="flex-1 items-center border-r border-[#222] px-1">
              <Text className="text-[#666] text-[10px] mb-1.5">Buying Power</Text>
              <Text className="text-white text-[13px] font-bold">PKR 450,000.00</Text>
            </View>
            <View className="flex-1 items-center px-1">
              <Text className="text-[#666] text-[10px] mb-1.5">Total Return</Text>
              <Text className="text-[#ef4444] text-[13px] font-bold">-5.71%</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3 - QUICK ACTIONS ROW */}
        <View className="mx-4 mb-6 flex-row justify-between bg-[#131316] rounded-xl py-5 px-2">
          <TouchableOpacity className="flex-1 items-center flex-col">
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] items-center justify-center mb-2 border border-[#222]">
              <Ionicons name="person-outline" size={20} color="#f97316" />
            </View>
            <Text className="text-[#888] text-[9px] text-center leading-3">Account{'\n'}Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center flex-col">
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] items-center justify-center mb-2 border border-[#222] relative">
              <Ionicons name="shield-checkmark-outline" size={20} color="#f97316" />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#131316]" />
            </View>
            <Text className="text-[#888] text-[9px] text-center leading-3">KYC{'\n'}Status</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center flex-col">
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] items-center justify-center mb-2 border border-[#222]">
              <Ionicons name="business-outline" size={20} color="#f97316" />
            </View>
            <Text className="text-[#888] text-[9px] text-center leading-3">Bank{'\n'}Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center flex-col">
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] items-center justify-center mb-2 border border-[#222]">
              <Ionicons name="shield-outline" size={20} color="#f97316" />
            </View>
            <Text className="text-[#888] text-[9px] text-center leading-3">Security</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center flex-col">
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] items-center justify-center mb-2 border border-[#222]">
              <Ionicons name="document-text-outline" size={20} color="#f97316" />
            </View>
            <Text className="text-[#888] text-[9px] text-center leading-3">Documents</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 4 - MENU LIST */}
        <View className="mx-4 mb-4 bg-[#131316] rounded-xl overflow-hidden">
          <MenuRow icon="person-outline" title="Account Information" sub="Personal details, address, CNIC" />
          <MenuRow icon="briefcase-outline" title="Brokerage Accounts" sub="Manage your connected brokers" />
          <MenuRow icon="link-outline" title="Linked Accounts" sub="Banks, eWallets & other accounts" />
          <MenuRow icon="lock-closed-outline" title="Security Settings" sub="Password, 2FA, biometric" isSecurity={true} />
          <MenuRow
            icon="alarm-outline"
            title="Price Alerts"
            sub="Create and manage stock price alerts"
            onPress={() => router.push('/alerts')}
          />
          <MenuRow icon="notifications-outline" title="Notification Settings" sub="Price alerts, order updates, news" />
          <MenuRow icon="options-outline" title="Preferences" sub="Theme, language, default market" hideBorder={true} />
        </View>

        {/* SECTION 5 - SUPPORT LIST */}
        <View className="mx-4 mb-4 bg-[#131316] rounded-xl overflow-hidden">
          <MenuRow icon="help-circle-outline" title="Help & Support" sub="FAQs, guides & customer support" />
          <MenuRow icon="information-circle-outline" title="About TradeIt" sub="App info, terms & conditions" hideBorder={true} />
        </View>

        {/* SECTION 6 - LOG OUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mx-4 bg-[#131316] rounded-xl flex-row items-center justify-center py-4 mb-[30px]"
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text className="text-[#ef4444] text-[14px] font-semibold ml-2">Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
