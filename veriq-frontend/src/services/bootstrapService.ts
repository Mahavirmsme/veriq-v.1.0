import { apiClient } from './api/apiClient';

export interface BootstrapStatusDTO {
  initialized: boolean;
  platformName?: string;
  organizationName?: string;
  deploymentEnvironment?: string;
  adminEmail?: string;
  adminName?: string;
  initializedAt?: string;
}

export interface BootstrapRequestPayload {
  platformName: string;
  organizationName: string;
  deploymentEnvironment?: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const bootstrapService = {
  getBootstrapStatus: async (): Promise<BootstrapStatusDTO> => {
    try {
      const response = await apiClient.get<ApiResponse<BootstrapStatusDTO>>('/bootstrap/status');
      return response.data.data;
    } catch (err) {
      return { initialized: false };
    }
  },

  initializePlatform: async (payload: BootstrapRequestPayload): Promise<BootstrapStatusDTO> => {
    const response = await apiClient.post<ApiResponse<BootstrapStatusDTO>>('/bootstrap/initialize', payload);
    return response.data.data;
  }
};
