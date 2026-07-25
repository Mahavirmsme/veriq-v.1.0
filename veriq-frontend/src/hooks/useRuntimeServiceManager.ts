import { useState, useEffect, useCallback } from 'react';
import { runtimeServiceManagerService, RuntimeServiceManagerStatus, TelemetryPacket } from '../services/runtimeServiceManagerService';

export const useRuntimeServiceManager = () => {
  const [status, setStatus] = useState<RuntimeServiceManagerStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProducedPackets, setLastProducedPackets] = useState<TelemetryPacket[]>([]);

  const loadStatus = useCallback(async () => {
    try {
      const data = await runtimeServiceManagerService.getStatus();
      setStatus(data);
    } catch {
      setError('Error fetching Runtime Service Manager status.');
    }
  }, []);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(() => {
      loadStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadStatus]);

  const startService = async () => {
    setLoading(true);
    try {
      const data = await runtimeServiceManagerService.startService();
      setStatus(data);
    } catch {
      setError('Error starting service.');
    } finally {
      setLoading(false);
    }
  };

  const pauseService = async () => {
    setLoading(true);
    try {
      const data = await runtimeServiceManagerService.pauseService();
      setStatus(data);
    } catch {
      setError('Error pausing service.');
    } finally {
      setLoading(false);
    }
  };

  const triggerManualCycle = async () => {
    setLoading(true);
    try {
      const packets = await runtimeServiceManagerService.triggerManualCycle();
      setLastProducedPackets(packets);
      await loadStatus();
    } catch {
      setError('Error triggering manual cycle.');
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    error,
    lastProducedPackets,
    loadStatus,
    startService,
    pauseService,
    triggerManualCycle,
  };
};
