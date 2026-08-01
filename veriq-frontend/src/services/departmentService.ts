import { apiClient } from './api/apiClient';
import { ApiResponse } from './api/apiTypes';

export interface DepartmentDTO {
  id: string;
  code: string;
  name: string;
  organizationId?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentPayloadDTO {
  code: string;
  name: string;
  status?: string;
}

export const departmentService = {
  getAllDepartments: async (): Promise<DepartmentDTO[]> => {
    const res = await apiClient.get<ApiResponse<DepartmentDTO[]>>('/departments');
    return res.data.data || [];
  },

  getDepartmentById: async (id: string): Promise<DepartmentDTO> => {
    const res = await apiClient.get<ApiResponse<DepartmentDTO>>(`/departments/${id}`);
    return res.data.data;
  },

  createDepartment: async (payload: CreateDepartmentPayloadDTO): Promise<DepartmentDTO> => {
    const res = await apiClient.post<ApiResponse<DepartmentDTO>>('/departments', {
      name: payload.name,
      code: payload.code,
      status: payload.status || 'ACTIVE'
    });
    return res.data.data;
  },

  updateDepartment: async (id: string, payload: Partial<CreateDepartmentPayloadDTO>): Promise<DepartmentDTO> => {
    const res = await apiClient.put<ApiResponse<DepartmentDTO>>(`/departments/${id}`, payload);
    return res.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/departments/${id}`);
  }
};
