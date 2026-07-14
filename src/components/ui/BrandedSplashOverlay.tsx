import React, { useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#FF8A00';
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const HeroArt: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const BAR_COUNT = 7;
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
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="splashHero" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFB347" />
          <Stop offset="0.45" stopColor={PRIMARY} />
          <Stop offset="1" stopColor="#C25E00" />
        </LinearGradient>
        <LinearGradient id="splashStreak" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill="url(#splashHero)" />
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Rect
          key={i}
          x={i * (barW + gap)}
          y={0}
          width={barW}
          height={height}
          fill="url(#splashStreak)"
          opacity={glow(i)}
        />
      ))}
    </Svg>
  );
};

interface BrandedSplashOverlayProps {
  opacity: SharedValue<number>;
}

/** Full-screen TradeIt splash — works in Expo Go where native splash assets don't apply. */
export const BrandedSplashOverlay: React.FC<BrandedSplashOverlayProps> = ({ opacity }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { zIndex: 9999, elevation: 9999 }, animatedStyle]}
    >
      <StatusBar style="light" />
      <HeroArt width={SCREEN_W} height={SCREEN_H} />
      <View style={styles.center}>
        <View style={styles.logoTile}>
          <Image
            source={require('../../../assets/tradit-logo.png')}
            style={{ width: 72, height: 72 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.wordmark}>TradeIt</Text>
      </View>
    </Animated.View>
  );
};

/** Hook to fade out and signal when the overlay can unmount. */
export function useSplashFadeOut(onDone: () => void) {
  const opacity = useSharedValue(1);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const fadeOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: 380 }, (finished) => {
      if (finished) runOnJS(onDoneRef.current)();
    });
  }, [opacity]);

  return { opacity, fadeOut };
}

const styles = StyleSheet.create({
  
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTile: {
    width: 96,
    height: 96,
    borderRadius: 20,
    // backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  wordmark: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
