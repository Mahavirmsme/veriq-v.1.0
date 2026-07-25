import { apiClient } from './api/apiClient';

export interface UserSession {
  userId: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  allowedWorkspaces: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  login: async (username: string, password: string): Promise<UserSession> => {
    const response = await apiClient.post<ApiResponse<UserSession>>('/auth/login', { username, password });
    return response.data.data;
  }
};
