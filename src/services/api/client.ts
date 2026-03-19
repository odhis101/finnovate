import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const BASE_URL = 'http://app.finovateltd.com:8081/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

const serializeBody = (data: any): string => {
  if (!data) return '(none)';
  if (data instanceof FormData) {
    const entries: Record<string, any> = {};
    data.forEach((value: any, key: string) => { entries[key] = value; });
    return JSON.stringify(entries, null, 2);
  }
  return JSON.stringify(data, null, 2);
};


apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log([
    `\n[API] ──► ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    `Headers: ${JSON.stringify(config.headers, null, 2)}`,
    `Body:    ${serializeBody(config.data)}`,
    `Params:  ${JSON.stringify(config.params, null, 2) ?? '(none)'}`,
  ].join('\n'));
  return config;
});

// Log response + handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    console.log([
      `\n[API] ◄── ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      `Response: ${JSON.stringify(response.data, null, 2)}`,
    ].join('\n'));
    return response;
  },
  (error) => {
    const req = error.config;
    const res = error.response;
    console.log([
      `\n[API] ✖ ${res?.status ?? 'NETWORK ERROR'} ${req?.method?.toUpperCase()} ${req?.baseURL}${req?.url}`,
      `Request Headers: ${JSON.stringify(req?.headers, null, 2)}`,
      `Request Body:    ${serializeBody(req?.data)}`,
      `Response Body:   ${JSON.stringify(res?.data, null, 2) ?? '(none)'}`,
      `Error Message:   ${error.message}`,
      `Error Code:      ${error.code ?? '(none)'}`,
    ].join('\n'));
    if (res?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);
