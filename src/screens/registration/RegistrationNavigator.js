import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import Step1PersonalInfo from './Step1PersonalInfo';
import Step2Lifestyle from './Step2Lifestyle';
import Step3SleepMental from './Step3SleepMental';
import Step4FamilyHistory from './Step4FamilyHistory';
import Step5Symptoms from './Step5Symptoms';
import Step6AyurvedicInputs from './Step6AyurvedicInputs';
import Step7PrakritiSelection from './Step7PrakritiSelection';
import Step8Credentials from './Step8Credentials';
import RegistrationComplete from './RegistrationComplete';
import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';

const Stack = createStackNavigator();

const RegistrationNavigator = () => {
  const { currentStep } = useSelector((state) => state.registration);

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.STEP1_PERSONAL_INFO}
      screenOptions={{
        headerShown: true,
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
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.STEP1_PERSONAL_INFO}
        component={Step1PersonalInfo}
        options={{ 
          title: `Step 1/8 - Personal Info`,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ROUTES.STEP2_LIFESTYLE}
        component={Step2Lifestyle}
        options={{ title: `Step 2/8 - Lifestyle` }}
      />
      <Stack.Screen
        name={ROUTES.STEP3_SLEEP_MENTAL}
        component={Step3SleepMental}
        options={{ title: `Step 3/8 - Sleep & Mental Health` }}
      />
      <Stack.Screen
        name={ROUTES.STEP4_FAMILY_HISTORY}
        component={Step4FamilyHistory}
        options={{ title: `Step 4/8 - Family History` }}
      />
      <Stack.Screen
        name={ROUTES.STEP5_SYMPTOMS}
        component={Step5Symptoms}
        options={{ title: `Step 5/8 - Current Symptoms` }}
      />
      <Stack.Screen
        name={ROUTES.STEP6_AYURVEDIC_INPUTS}
        component={Step6AyurvedicInputs}
        options={{ title: `Step 6/8 - Ayurvedic Inputs` }}
      />
      <Stack.Screen
        name={ROUTES.STEP7_PRAKRITI}
        component={Step7PrakritiSelection}
        options={{ title: `Step 7/8 - Prakriti Analysis` }}
      />
      <Stack.Screen
        name={ROUTES.STEP8_CREDENTIALS}
        component={Step8Credentials}
        options={{ title: `Step 8/8 - Account Setup` }}
      />
      <Stack.Screen
        name={ROUTES.REGISTRATION_COMPLETE}
        component={RegistrationComplete}
        options={{ 
          title: `Registration Complete`,
          headerLeft: null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;