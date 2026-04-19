import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LifestyleScreen from '../screens/main/LifestyleScreen';
import DinacharyaScreen from '../screens/lifestyle/DinacharyaScreen';
import DietRecommendations from '../screens/lifestyle/DietRecommendations';
import RitucharyaScreen from '../screens/lifestyle/RitucharyaScreen';
import CalorieCalculator from '../screens/lifestyle/CalorieCalculator';
import StressReliefTools from '../screens/lifestyle/StressReliefTools';
import ExerciseSuggestions from '../screens/lifestyle/ExerciseSuggestions';
import DailyChecklist from '../screens/lifestyle/DailyChecklist';
import { ROUTES } from './types';
import colors from '../utils/constants/colors';

const Stack = createStackNavigator();

export default function LifestyleStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LIFESTYLE_MAIN}
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
        name={ROUTES.LIFESTYLE_MAIN}
        component={LifestyleScreen}
        options={{ title: 'Lifestyle Guidance' }}
      />
      <Stack.Screen
        name={ROUTES.DINACHARYA}
        component={DinacharyaScreen}
        options={{ title: 'Dinacharya (Daily Routine)' }}
      />
      <Stack.Screen
        name={ROUTES.DIET_RECOMMENDATIONS}
        component={DietRecommendations}
        options={{ title: 'Diet Recommendations' }}
      />
      <Stack.Screen
        name={ROUTES.RITUCHARYA}
        component={RitucharyaScreen}
        options={{ title: 'Ritucharya (Seasonal Advice)' }}
      />
      <Stack.Screen
        name={ROUTES.CALORIE_CALCULATOR}
        component={CalorieCalculator}
        options={{ title: 'Calorie Calculator' }}
      />
      <Stack.Screen
        name={ROUTES.STRESS_RELIEF}
        component={StressReliefTools}
        options={{ title: 'Stress Relief Tools' }}
      />
      <Stack.Screen
        name={ROUTES.EXERCISE_SUGGESTIONS}
        component={ExerciseSuggestions}
        options={{ title: 'Exercise Suggestions' }}
      />
      <Stack.Screen
        name={ROUTES.DAILY_CHECKLIST}
        component={DailyChecklist}
        options={{ title: 'Daily Checklist' }}
      />
    </Stack.Navigator>
  );
}