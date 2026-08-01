import { apiClient } from './api/apiClient';

export interface UserDTO {
  id: string;
  organizationId?: string;
  departmentId?: string;
  designationId?: string;
  firstName: string;
  lastName?: string;
  email: string;
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'PENDING';
  assignedRoles?: string[];
  defaultRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayloadDTO {
  firstName: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  departmentId?: string;
  designationId?: string;
  status?: string;
  assignedRoles?: string[];
  defaultRole?: string;
}

export interface UpdateUserPayloadDTO {
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  designationId?: string;
  status?: string;
  assignedRoles?: string[];
  defaultRole?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const userService = {
  getAllUsers: async (): Promise<UserDTO[]> => {
    const response = await apiClient.get<ApiResponse<UserDTO[]>>('/users');
    return response.data.data || [];
  },

  getUserById: async (id: string): Promise<UserDTO> => {
    const response = await apiClient.get<ApiResponse<UserDTO>>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (payload: CreateUserPayloadDTO): Promise<UserDTO> => {
    const response = await apiClient.post<ApiResponse<UserDTO>>('/users', payload);
    return response.data.data;
  },

  updateUser: async (id: string, payload: UpdateUserPayloadDTO): Promise<UserDTO> => {
    const response = await apiClient.put<ApiResponse<UserDTO>>(`/users/${id}`, payload);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  }
};
