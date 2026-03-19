import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import { LoginLandingScreen, LoginPINScreen } from '@/features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginLanding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginLanding" component={LoginLandingScreen} />
      <Stack.Screen name="LoginPIN" component={LoginPINScreen} />
      {/* Other auth screens will be added here */}
    </Stack.Navigator>
  );
};
