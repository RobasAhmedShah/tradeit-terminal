import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandedSplashOverlay, useSplashFadeOut } from './BrandedSplashOverlay';

/** Minimum time the branded splash stays visible (ms). */
const MIN_SPLASH_MS = 3200;

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Shows a JS branded splash (works in Expo Go) until theme + auth are ready,
 * then fades out and hides the native splash layer.
 */
export function SplashGate({ children }: { children: React.ReactNode }) {
  const { ready: themeReady } = useTheme();
  const { ready: authReady } = useAuth();
  const bootStarted = useRef(Date.now());
  const dismissed = useRef(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  const onFadeComplete = useCallback(() => setOverlayMounted(false), []);
  const { opacity, fadeOut } = useSplashFadeOut(onFadeComplete);

  // In Expo Go, hide the native shell splash immediately so our branded overlay shows.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (!themeReady || !authReady || dismissed.current) return;

    const elapsed = Date.now() - bootStarted.current;
    const delay = Math.max(0, MIN_SPLASH_MS - elapsed);

    const timer = setTimeout(() => {
      dismissed.current = true;
      fadeOut();
    }, delay);

    return () => clearTimeout(timer);
  }, [themeReady, authReady, fadeOut]);

  return (
    <>
      {children}
      {overlayMounted ? <BrandedSplashOverlay opacity={opacity} /> : null}
    </>
  );
}
