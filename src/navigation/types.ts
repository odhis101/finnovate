import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type OnboardingStackParamList = {
  GetStarted: undefined;
  Lookup: undefined;
  OTPVerification: { phoneNumber: string; idNumber: string };
  PINEntry: {
    title?: string;
    subtitle?: string;
    pinLength?: number;
    mode?: 'enter' | 'create' | 'confirm';
    nextScreen?: keyof OnboardingStackParamList;
    showBiometric?: boolean;
    storedPin?: string;
  };
  SaccoSelection: undefined;
};

export type AuthStackParamList = {
  LoginLanding: undefined;
  LoginPIN: {
    userName?: string;
    showBiometric?: boolean;
  };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Loans: undefined;
  Services: undefined;
  Profile: undefined;
};

export type AccountsStackParamList = {
  AccountsList: undefined;
  AccountDetails: { accountId: string };
};

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  TransactionDetails: { transactionId: string };
  TransferFunds: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
