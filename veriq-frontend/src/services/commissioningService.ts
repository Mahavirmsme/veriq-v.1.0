import { apiClient } from './api/apiClient';

export interface RuntimeSensor {
  id?: string;
  sensorCode: string;
  sensorType: string;
  measurementParameter?: string;
  sensorStatus: string;
}

export interface CommissioningRecord {
  id?: string;
  engineeringNodeId: string;
  nodeCode?: string;
  nodeNumber?: number;
  sensorPackageId?: string;
  status: string; // NOT_STARTED, IN_PROGRESS, PARTIALLY_COMMISSIONED, COMMISSIONED
  remarks?: string;
  commissionedDate?: string;
  runtimeSensors: RuntimeSensor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CompleteCommissioningPayload {
  engineeringNodeId: string;
  remarks?: string;
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

export const commissioningService = {
  getByEngineeringNodeId: async (nodeId: string): Promise<CommissioningRecord | null> => {
    const response = await apiClient.get<ApiResponse<CommissioningRecord>>(`/commissioning/node/${nodeId}`);
    return response.data.data;
  },

  startCommissioning: async (nodeId: string): Promise<CommissioningRecord> => {
    const response = await apiClient.post<ApiResponse<CommissioningRecord>>(`/commissioning/start/${nodeId}`);
    return response.data.data;
  },

  completeCommissioning: async (payload: CompleteCommissioningPayload): Promise<CommissioningRecord> => {
    const response = await apiClient.post<ApiResponse<CommissioningRecord>>('/commissioning/complete', payload);
    return response.data.data;
  },
};
