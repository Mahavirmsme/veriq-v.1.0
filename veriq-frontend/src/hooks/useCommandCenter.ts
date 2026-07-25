import { useState, useEffect, useCallback } from 'react';
import { commandCenterService, AssetStateDTO, RegionStateDTO, NodeStateDTO, DeploymentZoneStateDTO } from '../services/commandCenterService';
import { assetService } from '../services/assetService';
import { runtimeSensorService } from '../services/runtimeSensorService';

export function useCommandCenter() {
  const [assetStates, setAssetStates] = useState<AssetStateDTO[]>([]);
  const [regionStates, setRegionStates] = useState<RegionStateDTO[]>([]);
  const [nodeStates, setNodeStates] = useState<NodeStateDTO[]>([]);
  const [zoneStates, setZoneStates] = useState<DeploymentZoneStateDTO[]>([]);

  const [assets, setAssets] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [astStates, rgnStates, ndStates, znStates, astList, snsList] = await Promise.all([
        commandCenterService.getAssetStates().catch(() => []),
        commandCenterService.getRegionStates().catch(() => []),
        commandCenterService.getNodeStates().catch(() => []),
        commandCenterService.getZoneStates().catch(() => []),
        assetService.getAll().catch(() => []),
        runtimeSensorService.getAll().catch(() => [])
      ]);

      setAssetStates(astStates);
      setRegionStates(rgnStates);
      setNodeStates(ndStates);
      setZoneStates(znStates);

      setAssets(astList);
      setSensors(snsList);
    } catch (err: any) {
      setError(err?.message || 'Failed to load Command Center runtime states');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s live refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    assetStates,
    regionStates,
    nodeStates,
    zoneStates,
    assets,
    regions,
    nodes,
    sensors,
    loading,
    error,
    refresh: fetchData
  };
}
