import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors, type Colors } from './colors';

export interface AppTheme {
  colors: Colors;
  isDark: boolean;
  navTheme: Theme;
  toggle: () => void;
}

/** Resolves the active palette from the saved mode (light / dark / system). */
export function useTheme(): AppTheme {
  const system = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const navTheme = useMemo<Theme>(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [isDark, colors]);

  return { colors, isDark, navTheme, toggle: () => setMode(isDark ? 'light' : 'dark') };
}
