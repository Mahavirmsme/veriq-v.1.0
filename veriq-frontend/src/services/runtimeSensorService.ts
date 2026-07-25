import { apiClient } from './api/apiClient';

export interface RuntimeSensorTransitionLogDTO {
  id: string;
  previousState: string;
  newState: string;
  transitionOwner: string;
  reason: string;
  createdAt: string;
}

export interface RuntimeSensorRecord {
  id: string;
  sensorCode: string;
  sensorType: string;
  measurementParameter?: string;
  runtimeStatus: string;
  currentStateOwner?: string;
  engineeringNodeId: string;
  nodeCode: string;
  nodeNumber: number;
  nodeChainage: number;
  formattedChainage: string;
  deploymentZoneCode?: string;
  regionCode?: string;
  assetName?: string;
  projectName?: string;
  commissioningRecordId?: string;
  commissioningReference?: string;
  currentValue?: string;
  lastTelemetry?: string;
  lastTransitionTime?: string;
  lastTransitionReason?: string;
  transitionLogs?: RuntimeSensorTransitionLogDTO[];
  createdAt?: string;
  updatedAt?: string;
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

export const runtimeSensorService = {
  getAll: async (): Promise<RuntimeSensorRecord[]> => {
    const response = await apiClient.get<ApiResponse<RuntimeSensorRecord[]>>('/runtime-sensors');
    return response.data.data;
  },

  getByNodeId: async (nodeId: string): Promise<RuntimeSensorRecord[]> => {
    const response = await apiClient.get<ApiResponse<RuntimeSensorRecord[]>>(`/runtime-sensors/node/${nodeId}`);
    return response.data.data;
  },
};
