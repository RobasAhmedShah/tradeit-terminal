import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PRIMARY = '#FF8A00';
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SCREEN_H * 0.42);

/** On-brand abstract gradient banner (SVG so we avoid extra deps). */
const HeroArt: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
    <Defs>
      <LinearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#FFB347" />
        <Stop offset="0.45" stopColor={PRIMARY} />
        <Stop offset="1" stopColor="#C25E00" />
      </LinearGradient>
      <LinearGradient id="streak" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.0" />
        <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.28" />
        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.0" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={width} height={height} fill="url(#hero)" />
    {/* Soft vertical light streaks */}
    <Rect x={width * 0.12} y={-20} width={26} height={height + 40} fill="url(#streak)" transform={`rotate(8 ${width * 0.12} ${height / 2})`} />
    <Rect x={width * 0.34} y={-20} width={44} height={height + 40} fill="url(#streak)" transform={`rotate(8 ${width * 0.34} ${height / 2})`} />
    <Rect x={width * 0.58} y={-20} width={30} height={height + 40} fill="url(#streak)" transform={`rotate(8 ${width * 0.58} ${height / 2})`} />
    <Rect x={width * 0.78} y={-20} width={52} height={height + 40} fill="url(#streak)" transform={`rotate(8 ${width * 0.78} ${height / 2})`} />
    {/* Glow blobs for depth */}
    <Circle cx={width * 0.8} cy={height * 0.25} r={90} fill="#FFFFFF" opacity={0.08} />
    <Circle cx={width * 0.2} cy={height * 0.7} r={70} fill="#000000" opacity={0.1} />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { login, ready } = useAuth();
  const [email, setEmail] = useState('guesttrader@email.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
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
      <View className="flex-1 bg-app-bg items-center justify-center">
        <ActivityIndicator color={PRIMARY} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <StatusBar style="light" />

      {/* Hero banner */}
      <View style={{ height: HERO_HEIGHT, width: SCREEN_W }}>
        <HeroArt width={SCREEN_W} height={HERO_HEIGHT} />
        <View style={{ paddingTop: insets.top + 12 }} className="px-6 flex-row items-center">
          <View className="w-9 h-9 rounded-lg items-center justify-center mr-2.5 overflow-hidden">
            <Image
              source={require('../../assets/tradit-logo.png')}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-white text-2xl font-extrabold">TradeIt</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        style={{ marginTop: -28 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            className="flex-1 bg-app-bg px-6 pt-8"
            style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
          >
            <Text className="text-app-text text-[28px] font-extrabold">Welcome back</Text>
            <Text className="text-app-muted text-sm mt-1.5">
              Please enter your credentials
            </Text>

            <View className="mt-7">
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor={colors.muted}
                className="bg-app-card-soft border border-app-border rounded-2xl px-4 py-4 text-app-text text-[15px]"
              />

              <View className="mt-4 flex-row items-center bg-app-card-soft border border-app-border rounded-2xl px-4">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.muted}
                  className="flex-1 py-4 text-app-text text-[15px]"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="self-end mt-3" onPress={handleLogin}>
                <Text className="text-app-text text-[13px] font-semibold">Forgot password</Text>
              </TouchableOpacity>

              {error ? <Text className="text-[#F6465D] text-xs mt-3">{error}</Text> : null}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
                className="mt-6 rounded-2xl overflow-hidden"
              >
                <Svg width={SCREEN_W - 48} height={54} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <Defs>
                    <LinearGradient id="btn" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor="#FFB347" />
                      <Stop offset="1" stopColor={PRIMARY} />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width={SCREEN_W - 48} height="54" rx="16" fill="url(#btn)" />
                </Svg>
                <View className="h-[54px] items-center justify-center">
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text className="text-black font-bold text-[16px]">Log in</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-7">
              <View className="flex-1 h-px bg-app-border" />
              <Text className="text-app-muted text-xs mx-3">or continue with</Text>
              <View className="flex-1 h-px bg-app-border" />
            </View>

            {/* Social buttons */}
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className="w-14 h-12 rounded-2xl bg-app-card-soft border border-app-border items-center justify-center mr-4"
              >
                <Ionicons name="logo-google" size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className="w-14 h-12 rounded-2xl bg-app-card-soft border border-app-border items-center justify-center"
              >
                <Ionicons name="logo-apple" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center mt-8 mb-6">
              <Text className="text-app-muted text-[13px]">Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-[#FF8A00] text-[13px] font-bold">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
