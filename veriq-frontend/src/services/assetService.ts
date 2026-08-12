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
  assetNature: 'Linear' | 'Point' | 'LINEAR' | 'POINT';
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
  assetNature: 'Linear' | 'Point' | 'LINEAR' | 'POINT';
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
  assetNature: 'Linear' | 'Point' | 'LINEAR' | 'POINT';
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

export const FALLBACK_SEED_ASSETS: Asset[] = [
  {
    id: 'asset-linear-samrudhi',
    projectId: 'proj-001',
    projectName: 'Samruddhi Mahamarg Expressway',
    projectCode: 'SM-01',
    assetName: 'Samruddhi Mahamarg',
    assetCode: 'SM-01',
    assetDescription: 'Nagpur-Mumbai Super Communication Expressway',
    assetClass: 'Expressway',
    assetNature: 'Linear',
    startChainage: 0,
    endChainage: 701,
    totalLength: 701,
    assetStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    projectId: 'proj-001',
    projectName: 'Samruddhi Mahamarg Expressway',
    projectCode: 'SM-01',
    assetName: 'Bridge 27 (Yamuna Crossing)',
    assetCode: 'BR-27',
    assetDescription: 'Cable-Stayed Major River Bridge Structure',
    assetClass: 'Bridge',
    assetNature: 'Point',
    assetStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    projectId: 'proj-002',
    projectName: 'Kosi Water Resources Project',
    projectCode: 'KWR-01',
    assetName: 'Kosi Hydro Dam Complex',
    assetCode: 'KDC-01',
    assetDescription: 'Hydroelectric Power Dam & Sluice Gates',
    assetClass: 'Dam',
    assetNature: 'Point',
    assetStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const assetService = {
  getAll: async (projectId?: string): Promise<Asset[]> => {
    try {
      const params = projectId ? { projectId } : undefined;
      const response = await apiClient.get<ApiResponse<Asset[]>>('/assets', { params });
      return response.data.data || [];
    } catch {
      return [];
    }
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
