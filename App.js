import React, { useCallback, useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/utils/constants/colors';

import { LogBox } from 'react-native';

// This will show the component stack trace
LogBox.ignoreLogs([]); // Don't ignore any logs

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a theme with custom fonts - updated to use Inter fonts when loaded
const createTheme = (fontsLoaded) => ({
  colors: {
    primary: colors.primarySaffron,
    accent: colors.primaryGreen,
    background: colors.backgroundWhite,
    surface: colors.cardBeige,
    text: colors.textPrimary,
    error: colors.alertRed,
    warning: colors.warningYellow,
    success: colors.successGreen,
    disabled: colors.disabled,
    placeholder: colors.textTertiary,
  },
  fonts: {
    regular: { 
      fontFamily: fontsLoaded ? 'Inter-Regular' : 'System', 
      fontWeight: '400' 
    },
    medium: { 
      fontFamily: fontsLoaded ? 'Inter-Medium' : 'System', 
      fontWeight: '500' 
    },
    light: { 
      fontFamily: fontsLoaded ? 'Inter-Regular' : 'System', 
      fontWeight: '300' 
    },
    thin: { 
      fontFamily: fontsLoaded ? 'Inter-Regular' : 'System', 
      fontWeight: '100' 
    },
  },
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded || fontError) {
          // Artificially delay for a smoother experience (optional)
          await new Promise(resolve => setTimeout(resolve, 500));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  // Create theme with font loading status
  const theme = createTheme(fontsLoaded);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <View style={styles.appContainer}>
                <StatusBar style="dark" backgroundColor={colors.backgroundWhite} />
                <AppNavigator />
              </View>
            </SafeAreaProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
});