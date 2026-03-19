import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from './types';
import { MainTabsNavigator } from './MainTabsNavigator';
import { MakeDepositScreen, StatementOptionsScreen, StatementFormScreen } from '../features/dashboard/screens';
import {
  LoanRepaymentScreen,
  LoanApplicationScreen,
  LoanConfirmationScreen,
  LoanSuccessScreen,
} from '../features/loans/screens';
import { PINAuthScreen } from '../shared/screens';
import { SavingsScreen, GroupsScreen } from '../features/services/screens';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen
        name="MakeDeposit"
        component={MakeDepositScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="LoanRepayment"
        component={LoanRepaymentScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="StatementOptions"
        component={StatementOptionsScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="StatementForm"
        component={StatementFormScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="LoanApplication"
        component={LoanApplicationScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="LoanConfirmation"
        component={LoanConfirmationScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="PINAuth"
        component={PINAuthScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="LoanSuccess"
        component={LoanSuccessScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Savings"
        component={SavingsScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Groups"
        component={GroupsScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
};
