import { apiClient } from './client';
import type { ApiResponse, Organisation, GenderOption, Group } from './types';

export interface IdentityType {
  id: number;
  name: string;
}

export interface KYCInitialPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  national_identity: string;
  dob: string;       // DD-MM-YYYY
  gender: number;    // gender id from /gender/index
  org_id: number;
}

export interface KYCFinalPayload {
  form_id: number;
  tax_pin: string;
  email: string;
  id_front_photo?: {
    uri: string;
    name: string;
    type: string;
  };
  id_back_photo?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface KYCFinalResponse {
  username: string;
  firstName: string;
  memberNumber: string;
  idFrontUrl: string;
  idBackUrl: string;
  associatedOrgs: unknown[];
}

export const onboardingApi = {
  getOrganisations: (limit = 50) =>
    apiClient.post<ApiResponse<Organisation[]>>('/organization/index', { limit }),

  getGenders: (org_id: number) =>
    apiClient.post<ApiResponse<GenderOption[]>>('/gender/index', { org_id: String(org_id) }),

  getGroups: (org_id: number) =>
    apiClient.post<ApiResponse<Group[]>>('/group/index', { org_id: String(org_id) }),

  getIdentityTypes: () =>
    apiClient.post<ApiResponse<IdentityType[]>>('/identity-type/index'),

  createClientInitial: (payload: KYCInitialPayload) => {
    const params = new URLSearchParams();
    (Object.keys(payload) as (keyof KYCInitialPayload)[]).forEach((key) => {
      params.append(key, String(payload[key]));
    });
    return apiClient.post<ApiResponse<{ form_id: number }>>('/client/create/basic/initial', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  createClientFinal: (payload: KYCFinalPayload) => {
    const form = new FormData();
    form.append('form_id', String(payload.form_id));
    form.append('tax_pin', payload.tax_pin);
    form.append('email', payload.email);
    if (payload.id_front_photo) {
      form.append('id_front_photo', payload.id_front_photo as any);
    }
    if (payload.id_back_photo) {
      form.append('id_back_photo', payload.id_back_photo as any);
    }
    return apiClient.post<ApiResponse<KYCFinalResponse>>('/client/create/basic/final', form, {
      timeout: 60000,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
