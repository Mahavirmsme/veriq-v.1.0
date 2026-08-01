import { apiClient } from './api/apiClient';

export interface RoleDTO {
  id: string;
  roleCode: string;
  roleName: string;
  description?: string;
  isSystemRole?: boolean;
  organizationId?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayloadDTO {
  roleCode: string;
  roleName: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const roleService = {
  getAllRoles: async (): Promise<RoleDTO[]> => {
    const response = await apiClient.get<ApiResponse<RoleDTO[]>>('/roles');
    return response.data.data || [];
  },

  getRoleById: async (id: string): Promise<RoleDTO> => {
    const response = await apiClient.get<ApiResponse<RoleDTO>>(`/roles/${id}`);
    return response.data.data;
  },

  getRoleByCode: async (code: string): Promise<RoleDTO> => {
    const response = await apiClient.get<ApiResponse<RoleDTO>>(`/roles/code/${code}`);
    return response.data.data;
  },

  createRole: async (payload: CreateRolePayloadDTO): Promise<RoleDTO> => {
    const response = await apiClient.post<ApiResponse<RoleDTO>>('/roles', payload);
    return response.data.data;
  },

  updateRole: async (id: string, payload: Partial<CreateRolePayloadDTO>): Promise<RoleDTO> => {
    const response = await apiClient.put<ApiResponse<RoleDTO>>(`/roles/${id}`, payload);
    return response.data.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/roles/${id}`);
  }
};
