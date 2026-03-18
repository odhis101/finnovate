import { apiClient } from './client';
import type { ApiResponse, User, AssociatedOrg } from './types';

export type { AssociatedOrg };

export interface LoginPayload {
  username: string;
  password: string;
  org_id: number;
}

export interface LoginData {
  token: string;
  last_login: string;
  is_first_login: boolean;
  changePassword: boolean;
  isSacco: boolean;
  user: User;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<LoginData>>('/auth/login', payload),

  getAssociatedOrgs: (phone: string, nationalIdNumber: string, dateOfBirth: string) => {
    const localPhone = phone.startsWith('+254') ? '0' + phone.slice(4) : phone;
    return apiClient.post<ApiResponse<AssociatedOrg[]>>('/auth/get-associated-orgs', { phone: localPhone, nationalIdNumber, dateOfBirth });
  },

  activate: (phone: string) => {
    const localPhone = phone.startsWith('+254') ? '0' + phone.slice(4) : phone;
    return apiClient.post<ApiResponse<{ phone: string }>>('/auth/activate', { phone: localPhone });
  },

  verifyCode: (token: string) =>
    apiClient.post<ApiResponse<unknown>>('/auth/verify-code', { token }),

  resendOtp: (username: string) =>
    apiClient.post<ApiResponse<unknown>>('/auth/resend-otp', { username }),

  validateDefaultPin: (username: string, defaultPin: string) =>
    apiClient.post<ApiResponse<unknown>>('/auth/validate-default-pin', { username, defaultPin }),

  changeDefaultPin: (username: string, password: string, confirm: string) =>
    apiClient.post<ApiResponse<unknown>>('/auth/change-default-pin', {
      username,
      password,
      confirm,
    }),

  verifyUser: (password: string) =>
    apiClient.post<ApiResponse<unknown>>('/auth/verify-user', { password }),
};
