import { apiClient } from './client';
import type { ApiResponse, Transaction } from './types';

export interface StatementPreviewPayload {
  accountId: number;
  from: string;            // "YYYY-MM-DD"
  to: string;              // "YYYY-MM-DD"
  recipientEmail: string;
}

export interface StatementPreviewResult {
  formId: number;
}

export const statementsApi = {
  getAccountStatement: (accountId: number, productId: number) => {
    const form = new FormData();
    form.append('accountId', String(accountId));
    form.append('productId', String(productId));
    return apiClient.post<ApiResponse<{ transactions: Transaction[] }>>(
      '/account-statement/index',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  statementPreview: (payload: StatementPreviewPayload) =>
    apiClient.post<ApiResponse<StatementPreviewResult>>('/client/full-statement-preview', payload),

  statementGenerate: (formId: number) =>
    apiClient.post<ApiResponse<unknown>>('/client/full-statement-generate', { formId }),
};
