import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import {
  GetStartedScreen,
  LookupScreen,
  OTPVerificationScreen,
  PINEntryScreen,
  SaccoSelectionScreen,
} from '@/features/onboarding';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Lookup" component={LookupScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="PINEntry" component={PINEntryScreen} />
      <Stack.Screen name="SaccoSelection" component={SaccoSelectionScreen} />
    </Stack.Navigator>
  );
};
