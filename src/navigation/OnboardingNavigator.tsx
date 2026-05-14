import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import {
  GetStartedScreen,
  LookupScreen,
  PINEntryScreen,
  CreateAccountScreen,
  KYCScreen,
  UploadIDScreen,
  OnboardingDepositScreen,
} from '@/features/onboarding';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Lookup" component={LookupScreen} />
      <Stack.Screen name="PINEntry" component={PINEntryScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
      <Stack.Screen name="UploadID" component={UploadIDScreen} />
      <Stack.Screen name="OnboardingDeposit" component={OnboardingDepositScreen} />
    </Stack.Navigator>
  );
};
