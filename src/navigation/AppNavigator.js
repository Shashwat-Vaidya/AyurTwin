import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import AuthStack from "./AuthStack";
import MainTabNavigator from "./MainTabNavigator";
import RegistrationNavigator from "../screens/registration/RegistrationNavigator";
import { navigationRef } from "./NavigationService";
import { ROUTES } from "./types";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentStep } = useSelector((state) => state.registration);

  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  useEffect(() => {
    setIsRegistrationComplete(currentStep >= 8);
  }, [currentStep]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
          />
        ) : !isRegistrationComplete ? (
          <Stack.Screen
            name={ROUTES.REGISTRATION_NAVIGATOR}
            component={RegistrationNavigator}
          />
        ) : (
          <Stack.Screen
            name={ROUTES.MAIN_TABS}
            component={MainTabNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}