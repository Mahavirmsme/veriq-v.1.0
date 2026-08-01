import { apiClient } from './api/apiClient';
import { ApiResponse } from './api/apiTypes';

export interface DesignationDTO {
  id: string;
  code: string;
  title: string;
  organizationId?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDesignationPayloadDTO {
  code: string;
  title: string;
  status?: string;
}

export const designationService = {
  getAllDesignations: async (): Promise<DesignationDTO[]> => {
    const res = await apiClient.get<ApiResponse<DesignationDTO[]>>('/designations');
    return res.data.data || [];
  },

  getDesignationById: async (id: string): Promise<DesignationDTO> => {
    const res = await apiClient.get<ApiResponse<DesignationDTO>>(`/designations/${id}`);
    return res.data.data;
  },

  createDesignation: async (payload: CreateDesignationPayloadDTO): Promise<DesignationDTO> => {
    const res = await apiClient.post<ApiResponse<DesignationDTO>>('/designations', {
      title: payload.title,
      code: payload.code,
      status: payload.status || 'ACTIVE'
    });
    return res.data.data;
  },

  updateDesignation: async (id: string, payload: Partial<CreateDesignationPayloadDTO>): Promise<DesignationDTO> => {
    const res = await apiClient.put<ApiResponse<DesignationDTO>>(`/designations/${id}`, payload);
    return res.data.data;
  },

  deleteDesignation: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/designations/${id}`);
  }
};
