import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const BASE_URL = 'http://app.finovateltd.com:8081/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Inject Bearer token on every request + log outgoing body
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] --> ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '(no body)');
  return config;
});

// Log response + handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] <-- ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.log(`[API] ERR ${error.response?.status ?? 'network'} ${error.config?.url}`, error.response?.data ?? error.message);
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);
