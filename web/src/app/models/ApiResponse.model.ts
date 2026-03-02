export interface ApiResponse<T> {
  success: boolean;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  data?: T;
}
