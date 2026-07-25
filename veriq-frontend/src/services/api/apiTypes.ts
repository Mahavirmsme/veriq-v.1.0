export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ErrorDetail;
  timestamp: string;
}

export interface ErrorDetail {
  code: string;
  details: string;
  fieldErrors?: Record<string, string>;
}
