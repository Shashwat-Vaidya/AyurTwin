import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../screens/main/DashboardScreen';
import HeartRateDetail from '../screens/metrics/HeartRateDetail';
import TemperatureDetail from '../screens/metrics/TemperatureDetail';
import SpO2Detail from '../screens/metrics/SpO2Detail';
import StressDetail from '../screens/metrics/StressDetail';
import SleepDetail from '../screens/metrics/SleepDetail';
import ActivityDetail from '../screens/metrics/ActivityDetail';
import { ROUTES } from './types';
import colors from '../utils/constants/colors';

const Stack = createStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.DASHBOARD_MAIN}
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
        name={ROUTES.DASHBOARD_MAIN}
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HEART_RATE_DETAIL}
        component={HeartRateDetail}
        options={{ title: 'Heart Rate Details' }}
      />
      <Stack.Screen
        name={ROUTES.TEMPERATURE_DETAIL}
        component={TemperatureDetail}
        options={{ title: 'Temperature Details' }}
      />
      <Stack.Screen
        name={ROUTES.SPO2_DETAIL}
        component={SpO2Detail}
        options={{ title: 'SpO₂ Details' }}
      />
      <Stack.Screen
        name={ROUTES.STRESS_DETAIL}
        component={StressDetail}
        options={{ title: 'Stress Details' }}
      />
      <Stack.Screen
        name={ROUTES.SLEEP_DETAIL}
        component={SleepDetail}
        options={{ title: 'Sleep Details' }}
      />
      <Stack.Screen
        name={ROUTES.ACTIVITY_DETAIL}
        component={ActivityDetail}
        options={{ title: 'Activity Details' }}
      />
    </Stack.Navigator>
  );
}