import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.finnovate.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // TODO: Add authentication token from secure storage
    // const token = await getAuthToken();
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      apiError.message = data?.message || error.message;
      apiError.code = data?.code;

      // TODO: Handle specific error cases
      // if (error.response.status === 401) {
      //   // Handle unauthorized - clear auth and redirect to login
      // }
      // if (error.response.status === 403) {
      //   // Handle forbidden
      // }
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(apiError);
  }
);
