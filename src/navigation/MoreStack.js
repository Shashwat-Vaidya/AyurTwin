import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MoreScreen from '../screens/main/MoreScreen';
import ProfileScreen from '../screens/more/ProfileScreen';
import EditProfileScreen from '../screens/more/EditProfileScreen';
import ReportsScreen from '../screens/more/ReportsScreen';
import ReportDetailScreen from '../screens/more/ReportDetailScreen';
import DeviceScreen from '../screens/more/DeviceScreen';
import DeviceConnectionScreen from '../screens/more/DeviceConnectionScreen';
import EducationScreen from '../screens/more/EducationScreen';
import EducationDetailScreen from '../screens/more/EducationDetailScreen';
import AboutScreen from '../screens/more/AboutScreen';
import SettingsScreen from '../screens/more/SettingsScreen';
import NotificationSettings from '../screens/more/NotificationSettings';
import PrivacySettings from '../screens/more/PrivacySettings';
import HelpScreen from '../screens/more/HelpScreen';
import FAQScreen from '../screens/more/FAQScreen';
import { ROUTES } from './types';
import colors from '../utils/constants/colors';

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MORE_MAIN}
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
        name={ROUTES.MORE_MAIN}
        component={MoreScreen}
        options={{ title: 'More' }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name={ROUTES.REPORTS}
        component={ReportsScreen}
        options={{ title: 'Health Reports' }}
      />
      <Stack.Screen
        name={ROUTES.REPORT_DETAIL}
        component={ReportDetailScreen}
        options={{ title: 'Report Details' }}
      />
      <Stack.Screen
        name={ROUTES.DEVICE}
        component={DeviceScreen}
        options={{ title: 'Device' }}
      />
      <Stack.Screen
        name={ROUTES.DEVICE_CONNECTION}
        component={DeviceConnectionScreen}
        options={{ title: 'Connect Device' }}
      />
      <Stack.Screen
        name={ROUTES.EDUCATION}
        component={EducationScreen}
        options={{ title: 'Education' }}
      />
      <Stack.Screen
        name={ROUTES.EDUCATION_DETAIL}
        component={EducationDetailScreen}
        options={{ title: 'Learn More' }}
      />
      <Stack.Screen
        name={ROUTES.ABOUT}
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name={ROUTES.NOTIFICATION_SETTINGS}
        component={NotificationSettings}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name={ROUTES.PRIVACY_SETTINGS}
        component={PrivacySettings}
        options={{ title: 'Privacy' }}
      />
      <Stack.Screen
        name={ROUTES.HELP}
        component={HelpScreen}
        options={{ title: 'Help' }}
      />
      <Stack.Screen
        name={ROUTES.FAQ}
        component={FAQScreen}
        options={{ title: 'FAQ' }}
      />
    </Stack.Navigator>
  );
}