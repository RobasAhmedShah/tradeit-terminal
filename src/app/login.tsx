import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, ready } = useAuth();
  const [email, setEmail] = useState('guesttrader@email.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) {
      setError('Enter your email and password.');
      return;
    }
    router.replace('/(tabs)/home');
  };

  if (!ready) {
    return (
      <View className="flex-1 bg-[#050505] items-center justify-center">
        <ActivityIndicator color="#FF8A00" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6 justify-center"
      >
        <View className="items-center mb-10">
          <Text className="text-white text-3xl font-bold">
            Trade<Text className="text-[#FF8A00]">It</Text>
          </Text>
          <Text className="text-[#9CA3AF] text-sm mt-2">PSX Spot & Futures Trading</Text>
        </View>

        <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-5">
          <Text className="text-white text-lg font-bold mb-1">Sign in</Text>
          <Text className="text-[#666] text-xs mb-5">Demo login — any email & password works</Text>

          <Text className="text-[#9CA3AF] text-xs mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-[#18191C] border border-[#2A2B2F] rounded-xl px-4 py-3 text-white mb-4"
          />

          <Text className="text-[#9CA3AF] text-xs mb-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-[#18191C] border border-[#2A2B2F] rounded-xl px-4 py-3 text-white mb-2"
          />

          {error ? <Text className="text-[#FF3B30] text-xs mb-3">{error}</Text> : null}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#FF8A00] rounded-xl py-3.5 items-center mt-3"
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black font-bold text-base">Continue</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center mt-6">
          <Ionicons name="shield-checkmark-outline" size={14} color="#666" />
          <Text className="text-[#666] text-[11px] ml-1.5">Mock session · data stays on this device</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
