import { DefaultTheme } from 'react-native-paper';
import colors from './colors';
import typography from '../../styles/typography';

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
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: '100',
    },
  },
  roundness: 24,
};

export default theme;