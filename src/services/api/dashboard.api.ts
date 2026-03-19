import { apiClient } from './client';
import type { ApiResponse, ClientDetails, Account, Transaction } from './types';

export const dashboardApi = {
  getClientDetails: () =>
    apiClient.post<ApiResponse<ClientDetails>>('/client/details'),

  getClientAccounts: () =>
    apiClient.post<ApiResponse<Account[]>>('/client/accounts'),

  getMiniStatement: (accountId: number, productId: number) =>
    apiClient.post<ApiResponse<Transaction[]>>('/client/mini-statement', {
      accountId,
      productId,
    }),

  getBalanceInquiry: (accountId: number, productId: number) =>
    apiClient.post<ApiResponse<{ availableBalance: string; currentBalance: string }>>(
      '/client/balance-inquiry',
      { accountId, productId }
    ),
};
