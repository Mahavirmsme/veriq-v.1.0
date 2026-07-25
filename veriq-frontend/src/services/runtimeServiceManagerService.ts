import { apiClient } from './api/apiClient';

export interface TelemetryPacket {
  packetId: string;
  runtimeSensorId: string;
  sensorCode: string;
  sensorType: string;
  value: number;
  unit: string;
  quality: string;
  timestamp: string;
}

export interface RuntimeServiceManagerStatus {
  running: boolean;
  intervalSeconds: number;
  totalCyclesExecuted: number;
  totalPacketsProduced: number;
  activeSensorsCount: number;
  lastCycleTime?: string;
  recentExecutionLogs: string[];
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

export const runtimeServiceManagerService = {
  getStatus: async (): Promise<RuntimeServiceManagerStatus> => {
    const response = await apiClient.get<ApiResponse<RuntimeServiceManagerStatus>>('/runtime-service-manager/status');
    return response.data.data;
  },

  startService: async (): Promise<RuntimeServiceManagerStatus> => {
    const response = await apiClient.post<ApiResponse<RuntimeServiceManagerStatus>>('/runtime-service-manager/start');
    return response.data.data;
  },

  pauseService: async (): Promise<RuntimeServiceManagerStatus> => {
    const response = await apiClient.post<ApiResponse<RuntimeServiceManagerStatus>>('/runtime-service-manager/pause');
    return response.data.data;
  },

  triggerManualCycle: async (): Promise<TelemetryPacket[]> => {
    const response = await apiClient.post<ApiResponse<TelemetryPacket[]>>('/runtime-service-manager/trigger-cycle');
    return response.data.data;
  },
};
