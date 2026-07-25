import { apiClient } from './api/apiClient';

export interface Project {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  projectName: string;
  projectCode: string;
  projectDescription?: string;
  projectStatus: string;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  organizationId: string;
  projectName: string;
  projectCode: string;
  projectDescription?: string;
  projectStatus: string;
}

export interface UpdateProjectPayload {
  organizationId: string;
  projectName: string;
  projectDescription?: string;
  projectStatus: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details: string;
    fieldErrors?: Record<string, string>;
  };
  timestamp: string;
}

export const projectService = {
  getAll: async (organizationId?: string): Promise<Project[]> => {
    const params = organizationId ? { organizationId } : undefined;
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', payload);
    return response.data.data;
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/projects/${id}`);
  },
};
