import React, { useEffect, useState, useCallback } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/utils/constants/theme';
import { colors } from './src/utils/constants/colors';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
]);

// COMMENT OUT OR REMOVE THE FONT LOADING FOR NOW
// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(true); // Set to true immediately

  useEffect(() => {
    // Comment out all font loading code
    // async function prepare() {
    //   try {
    //     await Font.loadAsync({
    //       'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    //       'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    //       'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    //       'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    //       'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
    //       'Inter-Italic': require('./assets/fonts/Inter-Italic.ttf'),
    //     });
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    //   } catch (e) {
    //     console.warn(e);
    //   } finally {
    //     setAppIsReady(true);
    //   }
    // }
    // prepare();
    
    // Just set ready after 2 seconds
    setTimeout(() => {
      setAppIsReady(true);
    }, 2000);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <View style={{ flex: 1, backgroundColor: colors.backgroundWhite }} onLayout={onLayoutRootView}>
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