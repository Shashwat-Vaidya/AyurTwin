import 'react-native-reanimated';
import './polyfills';
import 'react-native-get-random-values';
global.BigInt = require("big-integer");
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, LogBox } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";

import { store, persistor } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/utils/constants/colors";

// Show all logs
LogBox.ignoreLogs([]);

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

// Theme creator
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
    placeholder: colors.textTertiary
  },
  fonts: {
    regular: {
      fontFamily: fontsLoaded ? "Inter-Regular" : "System",
      fontWeight: "400"
    },
    medium: {
      fontFamily: fontsLoaded ? "Inter-Medium" : "System",
      fontWeight: "500"
    },
    light: {
      fontFamily: fontsLoaded ? "Inter-Regular" : "System",
      fontWeight: "300"
    },
    thin: {
      fontFamily: fontsLoaded ? "Inter-Regular" : "System",
      fontWeight: "100"
    }
  }
});

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
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
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

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
    flex: 1
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.backgroundWhite
  }
});
