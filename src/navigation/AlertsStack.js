import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AlertsScreen from '../screens/main/AlertsScreen';
import AlertDetailScreen from '../screens/alerts/AlertDetailScreen';
import AlertHistoryScreen from '../screens/alerts/AlertHistoryScreen';
import AlertSettingsScreen from '../screens/alerts/AlertSettingsScreen';
import { ROUTES } from './types';
import colors from '../utils/constants/colors';

const Stack = createStackNavigator();

export default function AlertsStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.ALERTS_MAIN}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundWhite,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
        cardStyle: { backgroundColor: colors.backgroundWhite },
      }}
    >
      <Stack.Screen
        name={ROUTES.ALERTS_MAIN}
        component={AlertsScreen}
        options={{ title: 'Alerts' }}
      />
      <Stack.Screen
        name={ROUTES.ALERT_DETAIL}
        component={AlertDetailScreen}
        options={{ title: 'Alert Details' }}
      />
      <Stack.Screen
        name={ROUTES.ALERT_HISTORY}
        component={AlertHistoryScreen}
        options={{ title: 'Alert History' }}
      />
      <Stack.Screen
        name={ROUTES.ALERT_SETTINGS}
        component={AlertSettingsScreen}
        options={{ title: 'Alert Settings' }}
      />
    </Stack.Navigator>
  );
}