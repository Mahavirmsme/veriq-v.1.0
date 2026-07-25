import { useState, useCallback } from 'react';
import { runtimeSensorService, RuntimeSensorRecord } from '../services/runtimeSensorService';

export const useRuntimeSensorRegistry = () => {
  const [sensors, setSensors] = useState<RuntimeSensorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRuntimeSensors = useCallback(async (nodeId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let data: RuntimeSensorRecord[];
      if (nodeId && nodeId !== 'ALL') {
        data = await runtimeSensorService.getByNodeId(nodeId);
      } else {
        data = await runtimeSensorService.getAll();
      }
      setSensors(data || []);
    } catch {
      setSensors([]);
      setError('Error loading runtime sensor registry from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sensors,
    loading,
    error,
    loadRuntimeSensors,
  };
};
