export const colors = {
  // Gradients for modern UI
  gradientBlueGreen: ['#3b82f6', '#06b6d4'], // blue to cyan
  gradientGreenBlue: ['#06d6a0', '#3b82f6'], // green to blue
  // Primary colors
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  
  // // Secondary colors
  // secondary: '#64748b',
  // secondaryDark: '#475569',
  // secondaryLight: '#94a3b8',
  
  
  // Secondary colors
  secondary: '#2e3192',
  secondaryDark: '#140958',
  secondaryLight: '#94a3b8',
  

  // Accent colors
  accent: '#f59e0b',
  accentDark: '#d97706',
  accentLight: '#fbbf24',
  
  // Status colors
  success: '#10b981',
  successDark: '#059669',
  warning: '#f59e0b',
  warningDark: '#d97706',
  error: '#ef4444',
  errorDark: '#dc2626',
  info: '#3b82f6',
  infoDark: '#2563eb',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  
  // Background colors
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  
  // Text colors
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  
  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  
  // Additional colors for modern UI
  disabled: '#94a3b8',
  textDisabled: '#cbd5e1',
  shadow: '#000000',
  
  // Chart colors
  chart1: '#2563eb',
  chart2: '#10b981',
  chart3: '#f59e0b',
  chart4: '#ef4444',
  chart5: '#8b5cf6',
  chart6: '#06b6d4',
  chart7: '#84cc16',
  chart8: '#f97316',
};

export const darkColors = {
  // Gradients for modern UI
  gradientBlueGreen: ['#2563eb', '#06b6d4'], // blue to cyan (darker)
  gradientGreenBlue: ['#059669', '#2563eb'], // green to blue (darker)
  // Primary colors
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  
  // Secondary colors
  secondary: '#146EA5',
  // secondary: '#94a3b8',
  secondaryDark: '#64748b',
  secondaryLight: '#cbd5e1',
  
  // Accent colors
  accent: '#fbbf24',
  accentDark: '#f59e0b',
  accentLight: '#fcd34d',
  
  // Status colors
  success: '#34d399',
  successDark: '#10b981',
  warning: '#fbbf24',
  warningDark: '#f59e0b',
  error: '#f87171',
  errorDark: '#ef4444',
  info: '#60a5fa',
  infoDark: '#3b82f6',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#0f172a',
  gray100: '#1e293b',
  gray200: '#334155',
  gray300: '#475569',
  gray400: '#64748b',
  gray500: '#94a3b8',
  gray600: '#cbd5e1',
  gray700: '#e2e8f0',
  gray800: '#f1f5f9',
  gray900: '#f8fafc',
  
  // Background colors
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  
  // Text colors
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textInverse: '#0f172a',
  
  // Border colors
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1e293b',
  
  // Additional colors for modern UI
  disabled: '#475569',
  textDisabled: '#64748b',
  shadow: '#000000',
  
  // Chart colors (same as light theme)
  chart1: '#3b82f6',
  chart2: '#34d399',
  chart3: '#fbbf24',
  chart4: '#f87171',
  chart5: '#a78bfa',
  chart6: '#22d3ee',
  chart7: '#a3e635',
  chart8: '#fb923c',
};

export const typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    light: 'Poppins-Light',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export type Theme = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  breakpoints: typeof breakpoints;
};

export const lightTheme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
};
