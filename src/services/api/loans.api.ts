import { apiClient } from './client';
import type { ApiResponse, LoanProduct, ActiveLoan, LoanCalculatorResult } from './types';

export interface LoanCalculatorPayload {
  productId: number;
  amount: number;
  repaymentPeriod: number;
}

export interface LoanApplicationPreviewPayload {
  productId: number;
  amount: number;
  depositAccountId: number;
  applicationReason: string;
}

export interface LoanPreviewResult {
  formId: number;
  charges: string;
  exerciseDuty: number;
}

export interface RepaymentPreviewPayload {
  loanId: number;
  amount: number;
  payAll: boolean;
  accountId?: number;      // repay from savings account
  providerId?: number;     // repay via mobile money
  providerPhone?: string;
}

export const loansApi = {
  getLoanProducts: () =>
    apiClient.post<ApiResponse<LoanProduct[]>>('/loan/products'),

  getLoanCalculator: (payload: LoanCalculatorPayload) =>
    apiClient.post<ApiResponse<LoanCalculatorResult>>('/loan/calculator', payload),

  getActiveLoans: (pendingDisbursement = false) =>
    apiClient.post<ApiResponse<ActiveLoan[]>>('/loan/active-loans', { pendingDisbursement }),

  loanApplicationPreview: (payload: LoanApplicationPreviewPayload) =>
    apiClient.post<ApiResponse<LoanPreviewResult>>('/loan/application-preview', payload),

  loanApplicationCommit: (formId: number) =>
    apiClient.post<ApiResponse<unknown>>('/loan/application-commit', { formId }),

  loanRepaymentPreview: (payload: RepaymentPreviewPayload) =>
    apiClient.post<ApiResponse<LoanPreviewResult>>('/loan/repayment-preview', payload),

  loanRepaymentCommit: (formId: number) =>
    apiClient.post<ApiResponse<unknown>>('/loan/repayment-commit', { formId }),

  getLoanProductDetails: (productId: number) =>
    apiClient.post<ApiResponse<{ history: unknown[] }>>('/loan/product-details', { productId }),
};
