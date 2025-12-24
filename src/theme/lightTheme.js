import { MD3LightTheme } from 'react-native-paper';
import { BRAND_COLORS, LIGHT_COLORS, LIGHT_TEXT, STATUS_COLORS } from '../constants/colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: BRAND_COLORS.primary,
    primaryContainer: BRAND_COLORS.primaryLight,
    onPrimary: '#ffffff',
    onPrimaryContainer: BRAND_COLORS.primaryDark,
    
    // Secondary colors
    secondary: BRAND_COLORS.secondary,
    secondaryContainer: '#f1f3f5',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#495057',
    
    // Background colors
    background: LIGHT_COLORS.background,
    onBackground: LIGHT_TEXT.primary,
    
    // Surface colors
    surface: LIGHT_COLORS.surface,
    surfaceVariant: LIGHT_COLORS.surfaceVariant,
    onSurface: LIGHT_TEXT.primary,
    onSurfaceVariant: LIGHT_TEXT.secondary,
    
    // Accent and status colors
    tertiary: BRAND_COLORS.accent,
    error: STATUS_COLORS.error,
    success: STATUS_COLORS.success,
    warning: STATUS_COLORS.warning,
    info: STATUS_COLORS.info,
    
    // Outline and borders
    outline: LIGHT_COLORS.border,
    outlineVariant: LIGHT_COLORS.divider,
    
    // Text colors
    onSurfaceDisabled: LIGHT_TEXT.disabled,
    placeholder: LIGHT_TEXT.placeholder,
    
    // Elevation
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#f8f9fa',
      level3: '#f1f3f5',
      level4: '#e9ecef',
      level5: '#dee2e6',
    },
  },
  // Custom properties
  custom: {
    statusColors: STATUS_COLORS,
    chartColors: [
      BRAND_COLORS.primary,
      BRAND_COLORS.accent,
      STATUS_COLORS.warning,
      STATUS_COLORS.error,
      '#8b5cf6',
      '#ec4899',
    ],
  },
};
