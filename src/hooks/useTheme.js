import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setTheme, toggleTheme } from '../store/slices/settingsSlice';
import colors from '../utils/constants/colors';

export const useTheme = () => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const { theme: storedTheme } = useSelector(state => state.settings);
  
  const [currentTheme, setCurrentTheme] = useState(storedTheme || 'light');

  useEffect(() => {
    // Use stored theme if available, otherwise use system preference
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    } else {
      setCurrentTheme(systemColorScheme || 'light');
    }
  }, [storedTheme, systemColorScheme]);

  // Get theme colors
  const getThemeColors = useCallback(() => {
    return {
      ...colors,
      background: currentTheme === 'dark' ? '#1A1A1A' : colors.backgroundWhite,
      surface: currentTheme === 'dark' ? '#2A2A2A' : colors.cardBeige,
      text: currentTheme === 'dark' ? '#FFFFFF' : colors.textPrimary,
      textSecondary: currentTheme === 'dark' ? '#B0B0B0' : colors.textSecondary,
      border: currentTheme === 'dark' ? '#404040' : 'rgba(0,0,0,0.05)',
    };
  }, [currentTheme]);

  // Toggle theme
  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // Set specific theme
  const handleSetTheme = useCallback((theme) => {
    dispatch(setTheme(theme));
  }, [dispatch]);

  // Check if dark mode
  const isDark = currentTheme === 'dark';

  // Get status bar style
  const getStatusBarStyle = useCallback(() => {
    return isDark ? 'light-content' : 'dark-content';
  }, [isDark]);

  return {
    // State
    theme: currentTheme,
    isDark,
    colors: getThemeColors(),

    // Methods
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    getStatusBarStyle,
  };
};

export default useTheme;