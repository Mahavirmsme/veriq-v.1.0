import { apiClient } from './api/apiClient';

export interface SensorTypeMaster {
  category: string;
  type: string;
  parameter: string;
}

export const SENSOR_MASTER_LIST: SensorTypeMaster[] = [
  // Slope Monitoring
  { category: 'Slope Monitoring', type: 'Tilt Sensor', parameter: 'Angle / Inclination' },
  { category: 'Slope Monitoring', type: 'Inclinometer', parameter: 'Subsurface Displacement' },
  { category: 'Slope Monitoring', type: 'Accelerometer', parameter: 'Dynamic Vibration / Acceleration' },

  // Ground & Soil Monitoring
  { category: 'Ground & Soil Monitoring', type: 'Piezometer', parameter: 'Pore Water Pressure' },
  { category: 'Ground & Soil Monitoring', type: 'Soil Moisture Sensor', parameter: 'Volumetric Water Content' },
  { category: 'Ground & Soil Monitoring', type: 'Soil Temperature Sensor', parameter: 'Soil Thermal Profile' },
  { category: 'Ground & Soil Monitoring', type: 'Earth Pressure Cell', parameter: 'Total Earth Pressure' },
  { category: 'Ground & Soil Monitoring', type: 'Settlement Marker', parameter: 'Vertical Settlement / Heave' },
  { category: 'Ground & Soil Monitoring', type: 'Extensometer', parameter: 'Subsurface Axial Strain' },
  { category: 'Ground & Soil Monitoring', type: 'Crack Meter', parameter: 'Joint / Crack Displacement' },

  // Structural Monitoring
  { category: 'Structural Monitoring', type: 'Strain Gauge', parameter: 'Structural Micro-Strain' },
  { category: 'Structural Monitoring', type: 'Load Cell', parameter: 'Structural Axial Force / Load' },
  { category: 'Structural Monitoring', type: 'Vibration Sensor', parameter: 'Structural Modal Frequency' },

  // Hydrology Monitoring
  { category: 'Hydrology Monitoring', type: 'Water Level Sensor', parameter: 'Water Surface Elevation' },
  { category: 'Hydrology Monitoring', type: 'River Stage Sensor', parameter: 'Channel Discharge Stage' },
  { category: 'Hydrology Monitoring', type: 'Flow Meter', parameter: 'Volumetric Flow Rate' },

  // Weather Monitoring
  { category: 'Weather Monitoring', type: 'Rain Gauge', parameter: 'Precipitation Accumulation' },
  { category: 'Weather Monitoring', type: 'Weather Station', parameter: 'Multi-Parameter Meteorological' },
  { category: 'Weather Monitoring', type: 'Wind Speed Sensor', parameter: 'Anemometer Velocity' },
  { category: 'Weather Monitoring', type: 'Wind Direction Sensor', parameter: 'Vane Azimuth' },
  { category: 'Weather Monitoring', type: 'Relative Humidity Sensor', parameter: 'Ambient Humidity' },
  { category: 'Weather Monitoring', type: 'Atmospheric Pressure Sensor', parameter: 'Barometric Pressure' },
  { category: 'Weather Monitoring', type: 'Solar Radiation Sensor', parameter: 'Irradiance Flux' },

  // Advanced Monitoring
  { category: 'Advanced Monitoring', type: 'GNSS / GPS Station', parameter: '3D High-Precision Position' },
  { category: 'Advanced Monitoring', type: 'Fiber Optic DAS', parameter: 'Distributed Acoustic Strain' },
  { category: 'Advanced Monitoring', type: 'Fiber Optic DTS', parameter: 'Distributed Thermal Sensing' },
  { category: 'Advanced Monitoring', type: 'Acoustic Sensor', parameter: 'Micro-Seismic Emission' },
  { category: 'Advanced Monitoring', type: 'Leakage Detection Sensor', parameter: 'Seepage Hydrodynamics' },

  // Visual Monitoring
  { category: 'Visual Monitoring', type: 'CCTV Camera', parameter: 'Optical Visual Feed' },
  { category: 'Visual Monitoring', type: 'Thermal Camera', parameter: 'Infrared Thermal Imaging' },

  // Others
  { category: 'Others', type: 'Custom Sensor', parameter: 'Custom Parameter' },
];

export interface SensorPackageItem {
  id?: string;
  sensorType: string;
  quantity: number;
  samplingSeconds?: number;
  samplingIntervalSeconds?: number;
  warningThreshold?: string;
  criticalThreshold?: string;
  measurementParameter?: string;
  engineeringPurpose?: string;
  remarks?: string;
}

export interface SensorPackage {
  id?: string;
  engineeringNodeId: string;
  nodeCode?: string;
  nodeNumber?: number;
  packageStatus: string;
  totalSensorTypes?: number;
  totalSensorCount?: number;
  items: SensorPackageItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveSensorPackagePayload {
  engineeringNodeId: string;
  items: {
    sensorType: string;
    quantity: number;
    samplingSeconds?: number;
    warningThreshold?: string;
    criticalThreshold?: string;
    measurementParameter?: string;
    engineeringPurpose?: string;
    remarks?: string;
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

export const sensorPackageService = {
  getByEngineeringNodeId: async (nodeId: string): Promise<SensorPackage | null> => {
    const response = await apiClient.get<ApiResponse<SensorPackage>>(`/sensor-packages/node/${nodeId}`);
    return response.data.data;
  },

  savePackage: async (payload: SaveSensorPackagePayload): Promise<SensorPackage> => {
    const response = await apiClient.post<ApiResponse<SensorPackage>>('/sensor-packages/save', payload);
    return response.data.data;
  },
};
