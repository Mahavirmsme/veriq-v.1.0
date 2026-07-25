import { apiClient } from './api/apiClient';

export interface Asset {
  id: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  organizationId?: string;
  organizationName?: string;
  assetName: string;
  assetCode: string;
  assetDescription?: string;
  assetClass: string;
  assetNature: 'Linear' | 'Point';
  startChainage?: number;
  endChainage?: number;
  totalLength?: number;
  assetStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetPayload {
  projectId: string;
  assetName: string;
  assetCode: string;
  assetDescription?: string;
  assetClass: string;
  assetNature: 'Linear' | 'Point';
  startChainage?: number;
  endChainage?: number;
  totalLength?: number;
  assetStatus: string;
}

export interface UpdateAssetPayload {
  projectId: string;
  assetName: string;
  assetDescription?: string;
  assetClass: string;
  assetNature: 'Linear' | 'Point';
  startChainage?: number;
  endChainage?: number;
  totalLength?: number;
  assetStatus: string;
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

export const ASSET_CLASS_MASTER = [
  'Highway',
  'Expressway',
  'Railway',
  'Metro Rail',
  'Bridge',
  'Tunnel',
  'Airport',
  'Seaport',
  'Flood Control Embankment',
  'Dam',
  'Canal',
  'Pipeline',
  'Transmission Line',
  'Industrial Plant',
  'Solar Park',
  'Wind Farm',
  'Power Substation',
  'Water Supply Network',
  'Sewer Network',
  'Smart City',
];

export const assetService = {
  getAll: async (projectId?: string): Promise<Asset[]> => {
    const params = projectId ? { projectId } : undefined;
    const response = await apiClient.get<ApiResponse<Asset[]>>('/assets', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await apiClient.get<ApiResponse<Asset>>(`/assets/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateAssetPayload): Promise<Asset> => {
    const response = await apiClient.post<ApiResponse<Asset>>('/assets', payload);
    return response.data.data;
  },

  update: async (id: string, payload: UpdateAssetPayload): Promise<Asset> => {
    const response = await apiClient.put<ApiResponse<Asset>>(`/assets/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/assets/${id}`);
  },
};
