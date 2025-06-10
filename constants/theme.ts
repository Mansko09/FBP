import { AppTheme } from '../types';

export const COLORS = {
  primary: '#0A2463',
  primaryLight: '#3E4C80',
  primaryDark: '#051538',
  
  secondary: '#E9E6E1',
  secondaryLight: '#F5F3F0',
  secondaryDark: '#D1CEC9',
  
  accent: '#FF6B6B',
  accentLight: '#FF9B9B',
  accentDark: '#E04747',
  
  success: '#4ECDC4',
  successLight: '#7ADCD7',
  successDark: '#36A39B',
  
  warning: '#FFD166',
  warningLight: '#FFE199',
  warningDark: '#D9A843',
  
  error: '#F25F5C',
  errorLight: '#F58784',
  errorDark: '#D13F3C',
  
  gray1: '#F8F9FA',
  gray2: '#E9ECEF',
  gray3: '#DEE2E6',
  gray4: '#CED4DA',
  gray5: '#ADB5BD',
  gray6: '#6C757D',
  gray7: '#495057',
  gray8: '#343A40',
  gray9: '#212529',
  
  white: '#FFFFFF',
  black: '#000000',
  
  transparentDark: 'rgba(0, 0, 0, 0.5)',
  transparentLight: 'rgba(255, 255, 255, 0.5)',
};

export const SIZES = {
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 40,
  
  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  body3: 12,
  caption: 10,
};

export const FONTS = {
  // These will be properly initialized when loading fonts
  h1: { fontFamily: 'Inter-Bold', fontSize: SIZES.h1, lineHeight: SIZES.h1 * 1.2 },
  h2: { fontFamily: 'Inter-Bold', fontSize: SIZES.h2, lineHeight: SIZES.h2 * 1.2 },
  h3: { fontFamily: 'Inter-Medium', fontSize: SIZES.h3, lineHeight: SIZES.h3 * 1.2 },
  h4: { fontFamily: 'Inter-Medium', fontSize: SIZES.h4, lineHeight: SIZES.h4 * 1.2 },
  body1: { fontFamily: 'Inter-Regular', fontSize: SIZES.body1, lineHeight: SIZES.body1 * 1.5 },
  body2: { fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: SIZES.body2 * 1.5 },
  body3: { fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: SIZES.body3 * 1.5 },
  caption: { fontFamily: 'Inter-Regular', fontSize: SIZES.caption, lineHeight: SIZES.caption * 1.5 },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const SPACING = {
  xs: SIZES.base, // 8
  s: SIZES.base * 2, // 16
  m: SIZES.base * 3, // 24
  l: SIZES.base * 4, // 32
  xl: SIZES.base * 5, // 40
  xxl: SIZES.base * 6, // 48
};

export const lightTheme: AppTheme = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  accent: COLORS.accent,
  background: COLORS.gray1,
  surface: COLORS.white,
  text: COLORS.gray9,
  textSecondary: COLORS.gray7,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
  border: COLORS.gray3,
  cardBackground: COLORS.white,
};

export const darkTheme: AppTheme = {
  primary: COLORS.primaryLight,
  secondary: COLORS.secondaryDark,
  accent: COLORS.accentLight,
  background: COLORS.gray9,
  surface: COLORS.gray8,
  text: COLORS.gray1,
  textSecondary: COLORS.gray3,
  error: COLORS.errorLight,
  success: COLORS.successLight,
  warning: COLORS.warningLight,
  border: COLORS.gray7,
  cardBackground: COLORS.gray8,
};