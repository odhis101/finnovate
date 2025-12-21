export const typography = {
  fontFamily: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extrabold: 'Manrope_800ExtraBold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    '26': 26, // For specific 26px line height
  },
  letterSpacing: {
    tight: -0.01, // -1%
    normal: 0,
  },
  // Predefined text styles from your design
  styles: {
    h1: {
      fontFamily: 'Manrope_700Bold',
      fontSize: 24,
      lineHeight: 1.5, // 150%
      letterSpacing: -0.01,
    },
    h1ExtraBold: {
      fontFamily: 'Manrope_800ExtraBold',
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 24, // 100%
      letterSpacing: 0,
    },
    bodyMedium: {
      fontFamily: 'Manrope_500Medium',
      fontSize: 16,
      lineHeight: 26,
      letterSpacing: -0.01,
    },
    bodySmall: {
      fontFamily: 'Manrope_500Medium',
      fontSize: 14,
      lineHeight: 26,
      letterSpacing: -0.01,
    },
    caption: {
      fontFamily: 'Manrope_500Medium',
      fontWeight: '500',
      fontSize: 11,
      lineHeight: 11, // 100%
      letterSpacing: 0,
    },
    greeting: {
      fontFamily: 'Manrope_400Regular',
      fontWeight: '400',
      fontSize: 20,
      lineHeight: 20, // 100%
      letterSpacing: -0.3,
    },
    captionMedium: {
      fontFamily: 'Manrope_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 12, // 100%
      letterSpacing: -0.3,
    },
  },
} as const;
