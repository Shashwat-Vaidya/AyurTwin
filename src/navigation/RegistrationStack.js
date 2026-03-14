import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RegistrationNavigator from '../screens/registration/RegistrationNavigator';
import Step1PersonalInfo from '../screens/registration/Step1PersonalInfo';
import Step2Lifestyle from '../screens/registration/Step2Lifestyle';
import Step3SleepMental from '../screens/registration/Step3SleepMental';
import Step4FamilyHistory from '../screens/registration/Step4FamilyHistory';
import Step5Symptoms from '../screens/registration/Step5Symptoms';
import Step6AyurvedicInputs from '../screens/registration/Step6AyurvedicInputs';
import Step7PrakritiSelection from '../screens/registration/Step7PrakritiSelection';
import Step8Credentials from '../screens/registration/Step8Credentials';
import RegistrationComplete from '../screens/registration/RegistrationComplete';
import { ROUTES } from './types';

const Stack = createStackNavigator();

export default function RegistrationStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.REGISTRATION_NAVIGATOR}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name={ROUTES.REGISTRATION_NAVIGATOR} component={RegistrationNavigator} />
      <Stack.Screen name={ROUTES.STEP1_PERSONAL_INFO} component={Step1PersonalInfo} />
      <Stack.Screen name={ROUTES.STEP2_LIFESTYLE} component={Step2Lifestyle} />
      <Stack.Screen name={ROUTES.STEP3_SLEEP_MENTAL} component={Step3SleepMental} />
      <Stack.Screen name={ROUTES.STEP4_FAMILY_HISTORY} component={Step4FamilyHistory} />
      <Stack.Screen name={ROUTES.STEP5_SYMPTOMS} component={Step5Symptoms} />
      <Stack.Screen name={ROUTES.STEP6_AYURVEDIC_INPUTS} component={Step6AyurvedicInputs} />
      <Stack.Screen name={ROUTES.STEP7_PRAKRITI} component={Step7PrakritiSelection} />
      <Stack.Screen name={ROUTES.STEP8_CREDENTIALS} component={Step8Credentials} />
      <Stack.Screen name={ROUTES.REGISTRATION_COMPLETE} component={RegistrationComplete} />
    </Stack.Navigator>
  );
}