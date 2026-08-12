import { apiClient } from './api/apiClient';

export interface AssetStateDTO {
  id: string;
  assetId: string;
  assetName: string;
  currentHealth: 'UNKNOWN' | 'STABLE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  previousHealth?: string;
  totalRegions: number;
  healthyRegions: number;
  warningRegions: number;
  criticalRegions: number;
  offlineRegions: number;
  evaluationVersion: string;
  evaluationTimestamp: string;
}

export interface RegionStateDTO {
  id: string;
  regionId: string;
  regionName: string;
  currentHealth: 'UNKNOWN' | 'STABLE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  previousHealth?: string;
  totalZones: number;
  healthyZones: number;
  warningZones: number;
  criticalZones: number;
  offlineZones: number;
  evaluationVersion: string;
  evaluationTimestamp: string;
}

export interface EngineeringObservationDTO {
  observationId: string;
  runtimeSensorId: string;
  sensorCode: string;
  sensorType: string;
  measuredValue: number;
  unit: string;
  observation: string;
  confidence: number;
  interpreterName: string;
  interpreterVersion: string;
  status: string;
  reason?: string;
  observationTimestamp: string;
}

export interface MechanismAssessmentDTO {
  mechanismType: string;
  status: 'UNEVALUATED' | 'EVALUATED' | 'DATA_INSUFFICIENT';
  evaluationMessage: string;
}

export interface NodeStateDTO {
  id: string;
  engineeringNodeId: string;
  nodeCode: string;
  nodeNumber: number;
  currentHealth: 'STABLE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  previousHealth?: string;
  evaluationVersion: string;
  observationCount: number;
  evaluationTimestamp: string;
  healthSource: string;
  observations?: EngineeringObservationDTO[];
  mechanisms?: MechanismAssessmentDTO[];
}

export interface DeploymentZoneStateDTO {
  id: string;
  deploymentZoneId: string;
  zoneCode: string;
  currentHealth: 'UNKNOWN' | 'STABLE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  totalNodes: number;
  healthyNodes: number;
  warningNodes: number;
  criticalNodes: number;
  offlineNodes: number;
  evaluationTimestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const commandCenterService = {
  getAssetStates: async (): Promise<AssetStateDTO[]> => {
    const response = await apiClient.get<ApiResponse<AssetStateDTO[]>>('/asset-states');
    return response.data.data || [];
  },

  getRegionStates: async (): Promise<RegionStateDTO[]> => {
    const response = await apiClient.get<ApiResponse<RegionStateDTO[]>>('/region-states');
    return response.data.data || [];
  },

  getNodeStates: async (): Promise<NodeStateDTO[]> => {
    const response = await apiClient.get<ApiResponse<NodeStateDTO[]>>('/node-states');
    return response.data.data || [];
  },

  getZoneStates: async (): Promise<DeploymentZoneStateDTO[]> => {
    const response = await apiClient.get<ApiResponse<DeploymentZoneStateDTO[]>>('/deployment-zone-states');
    return response.data.data || [];
  }
};
