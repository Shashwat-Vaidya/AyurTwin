import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

import DashboardStack from './DashboardStack';
import MetricsStack from './MetricsStack';
import AlertsStack from './AlertsStack';
import LifestyleStack from './LifestyleStack';
import MoreStack from './MoreStack';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { ROUTES, TAB_ICONS } from './types';
import colors from '../utils/constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const theme = useTheme();

  const screenOptions = {
    headerShown: false,
    tabBarShowLabel: true,
    tabBarActiveTintColor: colors.primarySaffron,
    tabBarInactiveTintColor: colors.textTertiary,
    tabBarStyle: {
      height: 80,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.05)',
      elevation: 0,
      shadowOpacity: 0,
      backdropFilter: 'blur(10px)',
    },
    tabBarItemStyle: {
      paddingVertical: 8,
    },
    tabBarLabelStyle: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      marginTop: 4,
    },
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tab.Screen
          name={ROUTES.DASHBOARD_STACK}
          component={DashboardStack}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => ({
              icon: TAB_ICONS[ROUTES.DASHBOARD],
              color,
              size,
            }),
          }}
        />
        <Tab.Screen
          name={ROUTES.METRICS_STACK}
          component={MetricsStack}
          options={{
            tabBarLabel: 'Metrics',
            tabBarIcon: ({ color, size }) => ({
              icon: TAB_ICONS[ROUTES.METRICS],
              color,
              size,
            }),
          }}
        />
        <Tab.Screen
          name={ROUTES.ALERTS_STACK}
          component={AlertsStack}
          options={{
            tabBarLabel: 'Alerts',
            tabBarIcon: ({ color, size }) => ({
              icon: TAB_ICONS[ROUTES.ALERTS],
              color,
              size,
            }),
          }}
        />
        <Tab.Screen
          name={ROUTES.LIFESTYLE_STACK}
          component={LifestyleStack}
          options={{
            tabBarLabel: 'Lifestyle',
            tabBarIcon: ({ color, size }) => ({
              icon: TAB_ICONS[ROUTES.LIFESTYLE],
              color,
              size,
            }),
          }}
        />
        <Tab.Screen
          name={ROUTES.MORE_STACK}
          component={MoreStack}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color, size }) => ({
              icon: TAB_ICONS[ROUTES.MORE],
              color,
              size,
            }),
          }}
        />
      </Tab.Navigator>
      
      {/* Floating Chatbot Button */}
      <View style={styles.chatbotContainer}>
        {/* ChatbotFloating component will go here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  chatbotContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 1000,
  },
});