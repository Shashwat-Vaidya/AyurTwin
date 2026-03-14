import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import RegistrationStack from './RegistrationStack';
import { navigationRef } from './NavigationService';
import { ROUTES } from './types';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentStep } = useSelector((state) => state.registration);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  // Check if registration is complete
  useEffect(() => {
    // Registration is complete when user finishes step 8
    setIsRegistrationComplete(currentStep > 8);
  }, [currentStep]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {!isAuthenticated ? (
          // User is not logged in
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !isRegistrationComplete ? (
          // User is logged in but registration not complete
          <Stack.Screen name={ROUTES.REGISTRATION_NAVIGATOR} component={RegistrationStack} />
        ) : (
          // User is logged in and registration complete
          <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}