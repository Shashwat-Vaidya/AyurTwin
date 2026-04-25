import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../config/theme';
import { useApp } from '../context/AppContext';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LandingScreen from '../screens/auth/LandingScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PrakritiQuizScreen from '../screens/quiz/PrakritiQuizScreen';

// Main Tab Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import MetricsScreen from '../screens/main/MetricsScreen';
import AlertsScreen from '../screens/main/AlertsScreen';
import LifestyleScreen from '../screens/main/LifestyleScreen';
import MoreScreen from '../screens/main/MoreScreen';

// Dashboard Sub-Screens
import FamilyDashboard from '../screens/family/FamilyDashboard';
import LeaderboardScreen from '../screens/social/LeaderboardScreen';
import SocialFeedScreen from '../screens/social/SocialFeedScreen';
import HealthJourneyScreen from '../screens/main/HealthJourneyScreen';
import SmartInsightsScreen from '../screens/main/SmartInsightsScreen';

// More Sub-Screens
import ProfileScreen from '../screens/main/ProfileScreen';
import ReportsScreen from '../screens/main/ReportsScreen';
import DeviceScreen from '../screens/main/DeviceScreen';
import EducationScreen from '../screens/main/EducationScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import HelpScreen from '../screens/main/HelpScreen';
import AboutScreen from '../screens/main/AboutScreen';
import DoshaDetailScreen from '../screens/main/DoshaDetailScreen';

// Innovative Feature Screens
import FoodRecommendationsScreen from '../screens/main/FoodRecommendationsScreen';
import YogaScreen from '../screens/main/YogaScreen';
import DoshaClockScreen from '../screens/main/DoshaClockScreen';
import PanchakarmaScreen from '../screens/main/PanchakarmaScreen';
import RitucharyaScreen from '../screens/main/RitucharyaScreen';
import ViruddhaAharaScreen from '../screens/main/ViruddhaAharaScreen';
import DiseasePreventionScreen from '../screens/main/DiseasePreventionScreen';
import HealthScoreBreakdownScreen from '../screens/main/HealthScoreBreakdownScreen';
import DiseaseRiskBreakdownScreen from '../screens/main/DiseaseRiskBreakdownScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const MoreStack = createStackNavigator();
const MetricsStack = createStackNavigator();
const LifestyleStack = createStackNavigator();

const TabIcon = ({ name, icon, focused }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
  </View>
);

const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
    <DashboardStack.Screen name="Family" component={FamilyDashboard} />
    <DashboardStack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <DashboardStack.Screen name="Social" component={SocialFeedScreen} />
    <DashboardStack.Screen name="HealthJourney" component={HealthJourneyScreen} />
    <DashboardStack.Screen name="SmartInsights" component={SmartInsightsScreen} />
    <DashboardStack.Screen name="DoshaDetail" component={DoshaDetailScreen} />
    <DashboardStack.Screen name="HealthScoreBreakdown" component={HealthScoreBreakdownScreen} />
    <DashboardStack.Screen name="DiseaseRiskBreakdown" component={DiseaseRiskBreakdownScreen} />
  </DashboardStack.Navigator>
);

const MetricsStackScreen = () => (
  <MetricsStack.Navigator screenOptions={{ headerShown: false }}>
    <MetricsStack.Screen name="MetricsHome" component={MetricsScreen} />
    <MetricsStack.Screen name="DoshaDetail" component={DoshaDetailScreen} />
  </MetricsStack.Navigator>
);

const LifestyleStackScreen = () => (
  <LifestyleStack.Navigator screenOptions={{ headerShown: false }}>
    <LifestyleStack.Screen name="LifestyleHome" component={LifestyleScreen} />
    <LifestyleStack.Screen name="FoodRecommendations" component={FoodRecommendationsScreen} />
    <LifestyleStack.Screen name="Yoga" component={YogaScreen} />
    <LifestyleStack.Screen name="DoshaClock" component={DoshaClockScreen} />
    <LifestyleStack.Screen name="Panchakarma" component={PanchakarmaScreen} />
    <LifestyleStack.Screen name="Ritucharya" component={RitucharyaScreen} />
    <LifestyleStack.Screen name="ViruddhaAhara" component={ViruddhaAharaScreen} />
    <LifestyleStack.Screen name="DiseasePrevention" component={DiseasePreventionScreen} />
  </LifestyleStack.Navigator>
);

const MoreStackScreen = () => (
  <MoreStack.Navigator screenOptions={{ headerShown: false }}>
    <MoreStack.Screen name="MoreHome" component={MoreScreen} />
    <MoreStack.Screen name="Profile" component={ProfileScreen} />
    <MoreStack.Screen name="Reports" component={ReportsScreen} />
    <MoreStack.Screen name="Device" component={DeviceScreen} />
    <MoreStack.Screen name="Education" component={EducationScreen} />
    <MoreStack.Screen name="Settings" component={SettingsScreen} />
    <MoreStack.Screen name="Help" component={HelpScreen} />
    <MoreStack.Screen name="About" component={AboutScreen} />
    <MoreStack.Screen name="DoshaDetail" component={DoshaDetailScreen} />
    <MoreStack.Screen name="HealthJourney" component={HealthJourneyScreen} />
    <MoreStack.Screen name="SmartInsights" component={SmartInsightsScreen} />
    <MoreStack.Screen name="Family" component={FamilyDashboard} />
    <MoreStack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <MoreStack.Screen name="Social" component={SocialFeedScreen} />
    <MoreStack.Screen name="FoodRecommendations" component={FoodRecommendationsScreen} />
    <MoreStack.Screen name="Yoga" component={YogaScreen} />
    <MoreStack.Screen name="DoshaClock" component={DoshaClockScreen} />
    <MoreStack.Screen name="Panchakarma" component={PanchakarmaScreen} />
    <MoreStack.Screen name="Ritucharya" component={RitucharyaScreen} />
    <MoreStack.Screen name="ViruddhaAhara" component={ViruddhaAharaScreen} />
    <MoreStack.Screen name="DiseasePrevention" component={DiseasePreventionScreen} />
  </MoreStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="DashboardTab"
      component={DashboardStackScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" icon="🏠" focused={focused} /> }}
    />
    <Tab.Screen
      name="MetricsTab"
      component={MetricsStackScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Metrics" icon="📊" focused={focused} /> }}
    />
    <Tab.Screen
      name="AlertsTab"
      component={AlertsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Alerts" icon="🚨" focused={focused} /> }}
    />
    <Tab.Screen
      name="LifestyleTab"
      component={LifestyleStackScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Lifestyle" icon="🌿" focused={focused} /> }}
    />
    <Tab.Screen
      name="MoreTab"
      component={MoreStackScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="More" icon="📂" focused={focused} /> }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PrakritiQuiz" component={PrakritiQuizScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { state } = useApp();

  if (state.isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>🌿</Text>
      </View>
    );
  }

  const isFamily = state.user?.role === 'family' && !state.monitoringPatient;

  return (
    <NavigationContainer>
      {!state.isAuthenticated ? (
        <AuthStack />
      ) : isFamily ? (
        <FamilyStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
};

const FamilyStackNav = createStackNavigator();
const FamilyStack = () => (
  <FamilyStackNav.Navigator screenOptions={{ headerShown: false }}>
    <FamilyStackNav.Screen name="FamilyHome" component={FamilyDashboard} />
    <FamilyStackNav.Screen name="DashboardHome" component={DashboardScreen} />
    <FamilyStackNav.Screen name="Metrics" component={MetricsScreen} />
    <FamilyStackNav.Screen name="DoshaDetail" component={DoshaDetailScreen} />
  </FamilyStackNav.Navigator>
);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 48,
  },
  tabBar: {
    height: 65,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 5,
    paddingBottom: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#999',
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default AppNavigator;
