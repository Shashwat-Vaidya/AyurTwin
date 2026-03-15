import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // Headings
  h1: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 32,
  },
  h2: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 28,
  },
  h3: {
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 24,
  },
  // Body text
  body1: {
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    fontSize: 16,
  },
  body2: {
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    fontSize: 14,
  },
  // Other styles
  regular: {
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
  },
  semiBold: {
    fontFamily: 'sans-serif',
    fontWeight: '600',
  },
  bold: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
});

export default typography;