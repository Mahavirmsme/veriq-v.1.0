import { apiClient } from './api/apiClient';

export interface Region {
  id?: string;
  assetId?: string;
  regionCode: string;
  regionName: string;
  startChainage: number;
  endChainage: number;
  regionLength: number;
  regionStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveRegionsPayload {
  assetId: string;
  regions: {
    regionCode: string;
    regionName: string;
    startChainage: number;
    endChainage: number;
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

export const regionService = {
  getByAssetId: async (assetId: string): Promise<Region[]> => {
    const response = await apiClient.get<ApiResponse<Region[]>>(`/regions/asset/${assetId}`);
    return response.data.data;
  },

  saveRegions: async (payload: SaveRegionsPayload): Promise<Region[]> => {
    const response = await apiClient.post<ApiResponse<Region[]>>('/regions/save', payload);
    return response.data.data;
  },
};
