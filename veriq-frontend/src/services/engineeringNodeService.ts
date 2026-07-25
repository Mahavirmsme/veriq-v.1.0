import { apiClient } from './api/apiClient';

export interface EngineeringNode {
  id?: string;
  deploymentZoneId?: string;
  zoneCode?: string;
  zoneName?: string;
  regionCode?: string;
  nodeCode: string;
  nodeNumber: number;
  chainage: number;
  formattedChainage: string;
  generationStatus: string;
  engineeringStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveEngineeringNodesPayload {
  deploymentZoneId: string;
  nodes: {
    nodeCode: string;
    nodeNumber: number;
    chainage: number;
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

export const engineeringNodeService = {
  getByDeploymentZoneId: async (deploymentZoneId: string): Promise<EngineeringNode[]> => {
    const response = await apiClient.get<ApiResponse<EngineeringNode[]>>(`/engineering-nodes/zone/${deploymentZoneId}`);
    return response.data.data;
  },

  saveNodes: async (payload: SaveEngineeringNodesPayload): Promise<EngineeringNode[]> => {
    const response = await apiClient.post<ApiResponse<EngineeringNode[]>>('/engineering-nodes/save', payload);
    return response.data.data;
  },
};
