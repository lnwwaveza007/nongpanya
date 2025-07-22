// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Error response interface
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
} 