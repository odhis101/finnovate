import { apiClient } from './client';
import type { ApiResponse, ServiceProvider } from './types';

export interface DepositPayload {
  accountId: number;
  amount: number;
  providerId: number;
  providerPhone: string;
}

export interface InternalTransferPreviewPayload {
  amount: number;
  fromAccountId: number;
  transferType: 'SELF' | 'Other';
  toAccountId?: number;       // for SELF transfers
  accountNumber?: string;     // for Other transfers
}

export interface PreviewResult {
  formId: number;
  charges: number;
  exerciseDuty: number;
}

export const transactionsApi = {
  getServiceProviders: () =>
    apiClient.post<ApiResponse<ServiceProvider[]>>('/service-provider/index'),

  deposit: (payload: DepositPayload) =>
    apiClient.post<ApiResponse<unknown>>('/payment-deposit', payload),

  withdrawal: (payload: DepositPayload) =>
    apiClient.post<ApiResponse<unknown>>('/saving-account-withdrawal', payload),

  internalTransferPreview: (payload: InternalTransferPreviewPayload) =>
    apiClient.post<ApiResponse<PreviewResult>>('/internal-transfer/preview', payload),

  internalTransferCommit: (formId: number) =>
    apiClient.post<ApiResponse<unknown>>('/internal-transfer/commit', { formId }),
};
