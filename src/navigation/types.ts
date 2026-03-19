import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  MakeDeposit: undefined;
  LoanRepayment: undefined;
  StatementOptions: undefined;
  StatementForm: { statementType: 'full' | 'mini' };
  LoanApplication: {
    productId: number;
    loanType: string;
    loanLimit: number;
    depositAccountId: number;
  };
  LoanConfirmation: {
    formId: number;
    charges: number;
    loanData: {
      loanType: string;
      amount: number;
      repaymentPeriod: number;
      loanLimit: number;
    };
    calculatorData: {
      installmentAmount: string;
      installmentCount: number;
      totalLoanAmount: string;
      interestAmount: string;
    };
  };
  PINAuth: {
    title?: string;
    subtitle?: string;
    onSuccess?: () => void;
    successScreen?: keyof MainStackParamList;
    successParams?: any;
  };
  LoanSuccess: {
    loanData: {
      loanType: string;
      amount: number;
      price: number;
      fee: number;
    }
  };
  Savings: undefined;
  Groups: undefined;
};

export type OnboardingStackParamList = {
  GetStarted: undefined;
  Lookup: undefined;
  OTPVerification: { phoneNumber: string };
  PINEntry: {
    title?: string;
    subtitle?: string;
    pinLength?: number;
    mode?: 'enter' | 'create' | 'confirm' | 'authenticate';
    nextScreen?: keyof OnboardingStackParamList;
    showBiometric?: boolean;
    storedPin?: string;
  };
  SaccoSelection: undefined;
  CreateAccount: undefined;
  SelectGroup: undefined;
  KYC: undefined;
  UploadID: undefined;
  OnboardingDeposit: undefined;
};

export type AuthStackParamList = {
  LoginLanding: undefined;
  LoginPIN: {
    userName?: string;
    showBiometric?: boolean;
    orgId?: number;
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
