import { useState, useEffect, useCallback } from 'react';
import { commandCenterService, AssetStateDTO, RegionStateDTO, NodeStateDTO, DeploymentZoneStateDTO } from '../services/commandCenterService';
import { assetService } from '../services/assetService';
import { regionService } from '../services/regionService';
import { pointAssetService } from '../services/pointAssetService';
import { deploymentZoneService } from '../services/deploymentZoneService';
import { engineeringNodeService } from '../services/engineeringNodeService';
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

      // Load Regions / Point Assets / Deployment Zones / Nodes for all assets dynamically
      if (astList && astList.length > 0) {
        const allRegions: any[] = [];
        const allNodes: any[] = [];

        for (const ast of astList) {
          const isPoint = ast.assetNature?.toUpperCase() === 'POINT';
          if (isPoint) {
            const pointAssets = await pointAssetService.getByAssetId(ast.id).catch(() => []);
            for (const pa of pointAssets) {
              allRegions.push({
                id: pa.id,
                assetId: ast.id,
                asset: ast,
                regionName: pa.pointAssetName,
                regionCode: pa.pointAssetType || 'POINT',
                isPointAsset: true,
                pointAsset: pa
              });
              const zones = await deploymentZoneService.getByAssetId(pa.id).catch(() => []);
              for (const z of zones) {
                if (z.id) {
                  const nodesInZone = await engineeringNodeService.getByDeploymentZoneId(z.id, true).catch(() => []);
                  allNodes.push(...nodesInZone.map((n: any) => ({ ...n, regionId: pa.id, deploymentZone: z })));
                }
              }
            }
          } else {
            const rgns = await regionService.getByAssetId(ast.id).catch(() => []);
            for (const r of rgns) {
              allRegions.push({ ...r, assetId: ast.id, asset: ast });
              if (r.id) {
                const zones = await deploymentZoneService.getByRegionId(r.id).catch(() => []);
                for (const z of zones) {
                  if (z.id) {
                    const nodesInZone = await engineeringNodeService.getByDeploymentZoneId(z.id, true).catch(() => []);
                    allNodes.push(...nodesInZone.map((n: any) => ({ ...n, regionId: r.id, deploymentZone: z })));
                  }
                }
              }
            }
          }
        }
        setRegions(allRegions);
        setNodes(allNodes);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load Command Center runtime states');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s live refresh
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
