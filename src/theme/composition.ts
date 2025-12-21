/**
 * Composition classes for NativeWind
 * These are reusable utility class combinations to keep styling DRY
 */

export const compositions = {
  // Container compositions
  container: 'flex-1 bg-background-primary',
  containerPadded: 'flex-1 bg-background-primary px-4',
  containerCenter: 'flex-1 bg-background-primary items-center justify-center',

  // Card compositions
  card: 'bg-white rounded-lg shadow-sm border border-border-primary p-4',
  cardInteractive: 'bg-white rounded-lg shadow-sm border border-border-primary p-4 active:opacity-80',

  // Button compositions
  buttonPrimary: 'bg-primary rounded-lg px-6 py-3 active:opacity-80',
  buttonSecondary: 'bg-transparent border border-primary rounded-lg px-6 py-3 active:opacity-80',
  buttonText: 'text-base font-semibold text-center',
  buttonTextPrimary: 'text-white text-base font-semibold text-center',
  buttonTextSecondary: 'text-primary text-base font-semibold text-center',

  // Input compositions
  input: 'border border-border-primary rounded-lg px-4 py-3 text-base text-text-primary',
  inputFocused: 'border-primary',
  inputError: 'border-error',

  // Text compositions
  heading1: 'text-3xl font-bold text-text-primary',
  heading2: 'text-2xl font-bold text-text-primary',
  heading3: 'text-xl font-semibold text-text-primary',
  body: 'text-base text-text-primary',
  bodySecondary: 'text-base text-text-secondary',
  caption: 'text-sm text-text-secondary',

  // Layout compositions
  row: 'flex-row items-center',
  rowBetween: 'flex-row items-center justify-between',
  column: 'flex-col',
  columnCenter: 'flex-col items-center justify-center',

  // Spacing compositions
  spacingXs: 'gap-1',
  spacingSm: 'gap-2',
  spacingMd: 'gap-4',
  spacingLg: 'gap-6',
  spacingXl: 'gap-8',
} as const;
