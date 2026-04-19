import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/auth/SplashScreen";
import LandingScreen from "../screens/auth/LandingScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import BiometricScreen from "../screens/auth/BiometricScreen";

import RegistrationStack from "./RegistrationStack";

import { ROUTES } from "./types";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.LANDING} component={LandingScreen} />
      <Stack.Screen name={ROUTES.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
      <Stack.Screen name={ROUTES.BIOMETRIC} component={BiometricScreen} />

      {/* 🔥 FIX ADDED HERE */}
      <Stack.Screen
        name={ROUTES.REGISTRATION_NAVIGATOR}
        component={RegistrationStack}
      />
    </Stack.Navigator>
  );
}