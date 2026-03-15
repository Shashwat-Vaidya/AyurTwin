import { DefaultTheme } from 'react-native-paper';
import colors from './colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primarySaffron,
    accent: colors.primaryGreen,
    background: colors.backgroundWhite,
    surface: colors.cardBeige,
    text: colors.textPrimary,
    error: colors.alertRed,
    success: colors.successGreen,
    warning: colors.warningYellow,
    disabled: colors.disabled,
    placeholder: colors.textTertiary,
    backdrop: colors.overlay,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    semiBold: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  roundness: 24,
  animation: {
    scale: 1.0,
  },
};

export default theme;