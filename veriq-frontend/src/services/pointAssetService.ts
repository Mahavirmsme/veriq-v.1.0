import { apiClient } from './api/apiClient';

export interface PointAsset {
  id: string;
  assetId: string;
  assetName?: string;
  pointAssetCode: string;
  pointAssetName: string;
  pointAssetType: string;
  startChainage?: number;
  structureLengthMeters?: number;
  endChainage?: number;
  locationChainage?: number; // Retained for backward compatibility
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePointAssetPayload {
  assetId: string;
  pointAssetCode: string;
  pointAssetName: string;
  pointAssetType: string;
  startChainage?: number;
  structureLengthMeters?: number;
  endChainage?: number;
  locationChainage?: number; // Retained for backward compatibility
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details: string;
  };
  timestamp: string;
}

export const pointAssetService = {
  getByAssetId: async (assetId: string): Promise<PointAsset[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PointAsset[]>>(`/point-assets/asset/${assetId}`);
      return (response.data.data || []).map(p => ({
        ...p,
        startChainage: p.startChainage !== undefined ? p.startChainage : p.locationChainage,
        endChainage: p.endChainage !== undefined ? p.endChainage : ((p.startChainage || p.locationChainage || 0) + ((p.structureLengthMeters || 0) / 1000))
      }));
    } catch {
      return [];
    }
  },

  getAll: async (): Promise<PointAsset[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PointAsset[]>>('/point-assets');
      return (response.data.data || []).map(p => ({
        ...p,
        startChainage: p.startChainage !== undefined ? p.startChainage : p.locationChainage,
        endChainage: p.endChainage !== undefined ? p.endChainage : ((p.startChainage || p.locationChainage || 0) + ((p.structureLengthMeters || 0) / 1000))
      }));
    } catch {
      return [];
    }
  },

  create: async (payload: CreatePointAssetPayload): Promise<PointAsset> => {
    // Derive endChainage if startChainage & structureLengthMeters are provided
    const start = payload.startChainage !== undefined ? Number(payload.startChainage) : Number(payload.locationChainage || 0);
    const lengthM = Number(payload.structureLengthMeters || 0);
    const derivedEnd = start + (lengthM / 1000);

    const finalPayload: CreatePointAssetPayload = {
      ...payload,
      startChainage: start,
      structureLengthMeters: lengthM,
      endChainage: payload.endChainage !== undefined ? Number(payload.endChainage) : derivedEnd,
      locationChainage: payload.locationChainage !== undefined ? payload.locationChainage : start
    };

    const response = await apiClient.post<ApiResponse<PointAsset>>('/point-assets', finalPayload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/point-assets/${id}`);
  }
};
