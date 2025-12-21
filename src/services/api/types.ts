export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}
