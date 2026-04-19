import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MetricsScreen from '../screens/main/MetricsScreen';
import SensorLogScreen from '../screens/metrics/SensorLogScreen';
import ChartsDetail from '../screens/metrics/ChartsDetail';
import { ROUTES } from './types';
import colors from '../utils/constants/colors';

const Stack = createStackNavigator();

export default function MetricsStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.METRICS_MAIN}
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
        name={ROUTES.METRICS_MAIN}
        component={MetricsScreen}
        options={{ title: 'Health Metrics' }}
      />
      <Stack.Screen
        name={ROUTES.SENSOR_LOG}
        component={SensorLogScreen}
        options={{ title: 'Sensor Log' }}
      />
      <Stack.Screen
        name={ROUTES.CHARTS_DETAIL}
        component={ChartsDetail}
        options={{ title: 'Detailed Charts' }}
      />
    </Stack.Navigator>
  );
}