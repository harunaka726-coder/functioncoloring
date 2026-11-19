/**
 * Material 3 Expressive を意識したトークン。
 * （大きな角丸・トーンサーフェス・はっきりした primary）
 */
export const m3 = {
  primary: '#4C5FF7',
  onPrimary: '#FFFFFF',
  primaryContainer: '#DEE0FF',
  onPrimaryContainer: '#00105C',

  secondary: '#5B5D72',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E0E1F9',
  onSecondaryContainer: '#181A2C',

  tertiary: '#EA580C',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFDBCC',
  onTertiaryContainer: '#351000',

  error: '#BA1A1A',
  errorContainer: '#FFDAD6',

  surface: '#F8F9FF',
  surfaceDim: '#D8D9E4',
  surfaceBright: '#F8F9FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F3FD',
  surfaceContainer: '#ECEDF8',
  surfaceContainerHigh: '#E6E7F2',
  surfaceContainerHighest: '#E0E1EC',

  onSurface: '#1A1B23',
  onSurfaceVariant: '#46464F',
  outline: '#777680',
  outlineVariant: '#C7C5D0',

  /** Expressive: 大きめの丸み */
  radiusXs: 8,
  radiusSm: 12,
  radiusMd: 20,
  radiusLg: 28,
  radiusXl: 36,
  radiusFull: 999,

  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 12,
  spaceLg: 16,
  spaceXl: 24,

  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
};
