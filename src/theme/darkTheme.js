import { MD3DarkTheme } from 'react-native-paper';
import { BRAND_COLORS, DARK_COLORS, DARK_TEXT, STATUS_COLORS } from '../constants/colors';

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: BRAND_COLORS.primaryLight,
    primaryContainer: BRAND_COLORS.primaryDark,
    onPrimary: '#000000',
    onPrimaryContainer: BRAND_COLORS.primaryLight,
    
    // Secondary colors
    secondary: '#9ca3af',
    secondaryContainer: '#374151',
    onSecondary: '#000000',
    onSecondaryContainer: '#d1d5db',
    
    // Background colors
    background: DARK_COLORS.background,
    onBackground: DARK_TEXT.primary,
    
    // Surface colors
    surface: DARK_COLORS.surface,
    surfaceVariant: DARK_COLORS.surfaceVariant,
    onSurface: DARK_TEXT.primary,
    onSurfaceVariant: DARK_TEXT.secondary,
    
    // Accent and status colors
    tertiary: BRAND_COLORS.accent,
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    
    // Outline and borders
    outline: DARK_COLORS.border,
    outlineVariant: DARK_COLORS.divider,
    
    // Text colors
    onSurfaceDisabled: DARK_TEXT.disabled,
    placeholder: DARK_TEXT.placeholder,
    
    // Elevation
    elevation: {
      level0: 'transparent',
      level1: DARK_COLORS.surface,
      level2: '#2a2d30',
      level3: DARK_COLORS.surfaceVariant,
      level4: '#34373a',
      level5: '#393c3f',
    },
  },
  // Custom properties
  custom: {
    statusColors: {
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    chartColors: [
      BRAND_COLORS.primaryLight,
      '#34d399',
      '#fbbf24',
      '#f87171',
      '#a78bfa',
      '#f472b6',
    ],
  },
};
