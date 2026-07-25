import { apiClient } from './api/apiClient';
import { ApiResponse } from './api/apiTypes';

export interface Organization {
  id: string;
  name: string;
  code: string;
  organizationType: string;
  status: string;
  description?: string;
  contactPerson: string;
  designation?: string;
  contactEmail: string;
  contactMobile: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  code: string;
  organizationType: string;
  description?: string;
  contactPerson: string;
  designation?: string;
  contactEmail: string;
  contactMobile: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export interface UpdateOrganizationPayload {
  name: string;
  organizationType: string;
  status: string;
  description?: string;
  contactPerson: string;
  designation?: string;
  contactEmail: string;
  contactMobile: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const res = await apiClient.get<ApiResponse<Organization[]>>('/organizations');
    return res.data.data;
  },

  getById: async (id: string): Promise<Organization> => {
    const res = await apiClient.get<ApiResponse<Organization>>(`/organizations/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateOrganizationPayload): Promise<Organization> => {
    const res = await apiClient.post<ApiResponse<Organization>>('/organizations', payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateOrganizationPayload): Promise<Organization> => {
    const res = await apiClient.put<ApiResponse<Organization>>(`/organizations/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/organizations/${id}`);
  },
};
