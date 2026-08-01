import { apiClient } from './api/apiClient';

export interface DeploymentZone {
  id?: string;
  regionId?: string;
  zoneCode: string;
  zoneName: string;
  priority: string;
  startChainage: number;
  endChainage: number;
  zoneLength: number;
  nodeSpacing: number;
  totalNodes: number;
  zoneStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveDeploymentZonesPayload {
  regionId: string;
  zones: {
    zoneCode: string;
    zoneName: string;
    priority: string;
    startChainage: number;
    endChainage: number;
    nodeSpacing: number;
  }[];
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

export const PRIORITY_SPACING_DEFAULTS: Record<string, number> = {
  'Very High': 100,
  High: 200,
  Medium: 500,
  Low: 1000,
};

export const deploymentZoneService = {
  getByRegionId: async (regionId: string): Promise<DeploymentZone[]> => {
    const response = await apiClient.get<ApiResponse<DeploymentZone[]>>(`/deployment-zones/region/${regionId}`);
    return response.data.data;
  },

  getByAssetId: async (assetId: string): Promise<DeploymentZone[]> => {
    const response = await apiClient.get<ApiResponse<DeploymentZone[]>>(`/deployment-zones/asset/${assetId}`);
    return response.data.data;
  },

  saveZones: async (payload: SaveDeploymentZonesPayload): Promise<DeploymentZone[]> => {
    const response = await apiClient.post<ApiResponse<DeploymentZone[]>>('/deployment-zones/save', payload);
    return response.data.data;
  },
};
