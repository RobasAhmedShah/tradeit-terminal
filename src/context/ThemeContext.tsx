import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { vars } from 'nativewind';
import {
  ThemeMode,
  ThemeColors,
  colorsForMode,
  loadThemeMode,
  saveThemeMode,
  LIGHT_COLORS,
} from '../constants/theme';

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  ready: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  /** NativeWind CSS variable style for the root tree */
  themeVars: Record<string, string>;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  isDark: false,
  colors: LIGHT_COLORS,
  ready: false,
  setMode: () => {},
  toggleMode: () => {},
  themeVars: {},
});

function buildVars(colors: ThemeColors) {
  return vars({
    '--color-app-bg': colors.background,
    '--color-app-card': colors.card,
    '--color-app-card-soft': colors.cardSoft,
    '--color-app-sheet': colors.sheet,
    '--color-app-input': colors.input,
    '--color-app-border': colors.border,
    '--color-app-text': colors.text,
    '--color-app-muted': colors.muted,
    '--color-app-tab': colors.tabBar,
  });
}

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadThemeMode().then((loaded) => {
      setModeState(loaded);
      setReady(true);
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    saveThemeMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      saveThemeMode(next);
      return next;
    });
  }, []);

  const colors = useMemo(() => colorsForMode(mode), [mode]);
  const themeVars = useMemo(() => buildVars(colors), [colors]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors,
      ready,
      setMode,
      toggleMode,
      themeVars,
    }),
    [mode, colors, ready, setMode, toggleMode, themeVars]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
