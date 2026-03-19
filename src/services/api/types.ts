// Standard server envelope — every response is one of these shapes
export interface ApiResponse<T = unknown> {
  status: 0 | 1;
  message: string;
  data: T | null;
}

// Auth error shape (401)
export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
}

// ─── Domain types ────────────────────────────────────────────────────────────

export interface User {
  name: string;
  username: string;
  firstname: string;
  lastname: string;
  dob: string;
  idNumber: string;
  genderId: number;
  phone: string;
  email: string;
  org_id: number;
  client_id: number;
}

export interface Organisation {
  id: number;
  name: string;
  isSacco: boolean;
  logo: string;
  org_id?: number;
  website?: string | null;
}

// Full shape returned by /auth/get-associated-orgs
export interface AssociatedOrg {
  id: number;
  org_id: number;
  name: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  nationalIdentity: string;
  dob: string;
  email: string;
  genderId: number | null;
  memberNumber: string;
  isSacco: boolean;
  userId: number;
  customerId: number;
  website: string;
  isFullyRegistered: boolean;
  isBlocked: boolean;
  isPartiallyRegistered: boolean;
  ussdIsActivated: boolean;
  isMobileBanking: boolean | null;
  isInternetBanking: boolean | null;
  internetBankingAccounts: number;
  mobileBankingAccounts: number;
}

export interface GenderOption {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  org_id: number;
}

export interface Account {
  product: string;
  isShare: 0 | 1;
  productId: number;
  accountId: number;
  accountNumber: string;
  accountName: string;
  defaultCurrency: string;
  currentBalance: string;     // "5,464,478.00" — use parseAmount()
  availableBalance: string;   // "5,464,478.00" — use parseAmount()
  lastAmountTransacted: string;
  lastSavingDate: string | null;
  dateOpened: string;
  shareCapital?: number;
  dividend?: number;
}

export interface Transaction {
  transactionDate: string;    // "26-06-2025"
  account: string;
  transactionType: string;
  entryType: 'CREDIT' | 'DEBIT';
  amount: string;             // "KES 10,000" — use parseCurrencyAmount()
}

export interface ServiceProvider {
  id: number;
  name: string;
  code: string;
  logoUrl: string;
}

export interface LoanProduct {
  productId: number;
  code: string;
  name: string;
  imageUrl: string | null;
  limit: string;
  canTopUp: boolean;
  mustBeGuarateed: boolean;
  minAmount: string;
  maxAmount: string;
  interestRate: string;
  maxRepaymentPeriod: string;
  calculationMethod: string;
  penaltyRate: string;
  hasActiveLoan: boolean;
  borrowedAmount: number;
  availableBalance: string;
  date: string;
  activeLoan: ActiveLoan | null;
  canApply: boolean;
  canRepay: boolean;
  showHistory: boolean;
}

export interface ActiveLoan {
  loanId: number;
  productId: number;
  canBeToppedUp: boolean;
  name: string;
  product: string;
  imageUrl: string;
  mustBeGuarateed: boolean;
  amountApplied: string;      // "KES 10,000.00"
  amountDisbursed: string;
  interestAmount: string;
  penaltyAmount: string;
  amountRepaid: string;
  loanBalance: string;        // "KES 14,000.00" — use parseCurrencyAmount()
  applicationDate: string;
}

export interface LoanCalculatorResult {
  principalAmount: string;
  interestAmount: string;
  totalLoanAmount: string;
  installmentAmount: string;
  installmentCount: number;
  currency: string;
}

export interface ClientDetails {
  personalInfo: {
    memberNumber: string;
    email: string;
    phone: string;
    kraPin: string;
    idFrontUrl: string;
    idBackUrl: string;
    facePhotoUrl: string;
    passportPhotoUrl: string;
  };
  identification: {
    fullName: string;
    idNumber: string;
    gender: string;
    dob: string;
  };
  bankInfo: unknown[];
  nextOfKin: unknown[];
  workInfo: unknown[];
  residenceInfo: unknown;
}

// ─── Parse helpers ────────────────────────────────────────────────────────────

/** "5,464,478.00" → 5464478 */
export const parseAmount = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(String(value).replace(/,/g, '')) || 0;
};

/** "KES 10,000" → 10000 */
export const parseCurrencyAmount = (value: string): number => {
  const parts = value.split(' ');
  const numStr = parts.length > 1 ? parts[1] : parts[0];
  return parseFloat(numStr.replace(/,/g, '')) || 0;
};
