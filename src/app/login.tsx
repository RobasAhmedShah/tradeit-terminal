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
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PRIMARY = '#FF8A00';
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SCREEN_H * 0.42);

/**
 * Previous TradeIt orange hero, with straight equal-width light bars (no tilt).
 */
const HeroArt: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const BAR_COUNT = 6;
  const gap = 4;
  const barW = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
  const glow = (i: number) => {
    const phase = i % 4;
    if (phase === 0) return 0.32;
    if (phase === 1) return 0.14;
    if (phase === 2) return 0.06;
    return 0.22;
  };

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFB347" />
          <Stop offset="0.45" stopColor={PRIMARY} />
          <Stop offset="1" stopColor="#C25E00" />
        </LinearGradient>
        <LinearGradient id="streak" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width={width} height={height} fill="url(#hero)" />

      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const x = i * (barW + gap);
        const opacity = glow(i);
        return (
          <Rect
            key={i}
            x={x}
            y={0}
            width={barW}
            height={height}
            fill="url(#streak)"
            opacity={opacity}
          />
        );
      })}
    </Svg>
  );
};

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      {/* Full-bleed straight vertical bars behind everything */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: SCREEN_W, height: HERO_HEIGHT }}>
        <HeroArt width={SCREEN_W} height={HERO_HEIGHT} />
      </View>

      <View style={{ paddingTop: insets.top + 12 }} className="px-6 flex-row items-center">
        <View className="w-15 h-15 rounded-lg items-center justify-center mr-2.5 overflow-hidden">
          <Image
            source={require('../../assets/tradit-logo.png')}
            style={{ width: 70, height: 70 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-white text-4xl font-extrabold">
          TradeIt</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, marginTop: Math.round(HERO_HEIGHT * 0.48) }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {/* Upright glass sheet — rounded top only, sides stay straight */}
          <View
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingHorizontal: 24,
              paddingTop: 40,
              paddingBottom: insets.bottom + 24,
              backgroundColor: isDark ? 'rgba(17,18,20,0.88)' : 'rgba(244,245,247,0.92)',
              borderTopWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <Text className="text-app-text text-[28px] font-extrabold">Welcome back</Text>
            <Text className="text-app-muted text-sm mt-1.5">
              Please enter your credentials
            </Text>

            <View className="mt-8">
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

            <View className="flex-row items-center my-7">
              <View className="flex-1 h-px bg-app-border" />
              <Text className="text-app-muted text-xs mx-3">or continue with</Text>
              <View className="flex-1 h-px bg-app-border" />
            </View>

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

            <View className="flex-row items-center justify-center mt-8">
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
