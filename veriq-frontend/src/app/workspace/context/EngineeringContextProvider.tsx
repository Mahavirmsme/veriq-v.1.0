import React, { useState, useEffect, useCallback } from 'react';
import { EngineeringContext } from './EngineeringContext';
import { EngineeringObject } from './EngineeringObject';
import { assetService, Asset } from '../../../services/assetService';
import { regionService, Region } from '../../../services/regionService';
import { pointAssetService, PointAsset } from '../../../services/pointAssetService';
import { deploymentZoneService, DeploymentZone } from '../../../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../../../services/engineeringNodeService';
import { runtimeSensorService, RuntimeSensorRecord } from '../../../services/runtimeSensorService';

export const DEFAULT_ENGINEERING_OBJECT: EngineeringObject = {
  id: 'asset-kosi-left-embankment',
  name: 'Kosi Left Flood Embankment',
  type: 'ASSET',
  parentObject: 'Water Resources Department Bihar',
  hierarchyPath: 'Water Resources Department Bihar > Kosi Left Flood Embankment',
  hasChildren: true
};

export const EngineeringContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [pointAssets, setPointAssets] = useState<PointAsset[]>([]);
  const [zones, setZones] = useState<DeploymentZone[]>([]);
  const [contextNodes, setContextNodes] = useState<EngineeringNode[]>([]);
  const [contextSensors, setContextSensors] = useState<RuntimeSensorRecord[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPointAsset, setSelectedPointAsset] = useState<PointAsset | null>(null);
  const [selectedZone, setSelectedZone] = useState<DeploymentZone | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('');

  const [selectedEngineeringObject, setSelectedEngineeringObject] = useState<EngineeringObject>(DEFAULT_ENGINEERING_OBJECT);

  // Helper to fetch nodes & runtime sensors for a given zone ID without duplication
  const fetchNodesForZone = useCallback(async (zoneId: string) => {
    if (!zoneId) {
      setContextNodes([]);
      setContextSensors([]);
      return;
    }
    try {
      const [fetchedNodes, allSensors] = await Promise.all([
        engineeringNodeService.getByDeploymentZoneId(zoneId, true).catch(() => []),
        runtimeSensorService.getAll().catch(() => [])
      ]);

      if (fetchedNodes && fetchedNodes.length > 0) {
        // Deduplicate nodes by unique nodeCode or id
        const map = new Map<string, EngineeringNode>();
        fetchedNodes.forEach(n => {
          const key = n.id || n.nodeCode;
          if (key && !map.has(key)) {
            map.set(key, n);
          }
        });
        const finalNodes = Array.from(map.values());
        setContextNodes(finalNodes);

        // Scope sensors strictly to the commissioned contextNodes
        const nodeIds = new Set(finalNodes.map(n => n.id).filter(Boolean));
        const scopedSensors = (allSensors || []).filter(s => nodeIds.has(s.engineeringNodeId));
        setContextSensors(scopedSensors);
      } else {
        setContextNodes([]);
        setContextSensors([]);
      }
    } catch {
      setContextNodes([]);
      setContextSensors([]);
    }
  }, []);

  // Synchronized Context Changer: Asset selection handles both LINEAR and POINT asset workflows
  const setContextFromAsset = useCallback(async (assetId: string) => {
    try {
      const ast = assets.find(a => a.id === assetId || a.assetCode === assetId) || assets[0];
      if (!ast) return;

      setSelectedAsset(ast);
      if (ast.assetClass) setSelectedAssetClass(ast.assetClass);

      const isPointAsset = ast.assetNature?.toUpperCase() === 'POINT';

      if (isPointAsset) {
        setRegions([]);
        setSelectedRegion(null);

        const fetchedPointAssets = await pointAssetService.getByAssetId(ast.id).catch(() => []);
        setPointAssets(fetchedPointAssets || []);

        const firstPointAsset = (fetchedPointAssets && fetchedPointAssets.length > 0) ? fetchedPointAssets[0] : null;
        setSelectedPointAsset(firstPointAsset);

        if (firstPointAsset) {
          const fetchedZones = await deploymentZoneService.getByAssetId(firstPointAsset.id).catch(() => []);
          const validZones = (fetchedZones && fetchedZones.length > 0) ? fetchedZones : [];
          setZones(validZones);
          const firstZone = validZones.length > 0 ? validZones[0] : null;
          setSelectedZone(firstZone);

          if (firstZone) {
            fetchNodesForZone(firstZone.id || '');
            setSelectedEngineeringObject({
              id: firstZone.id || firstZone.zoneCode,
              name: firstZone.zoneName || `Zone ${firstZone.zoneCode}`,
              type: 'DEPLOYMENT_ZONE',
              parentObject: firstPointAsset.pointAssetName,
              hierarchyPath: `${ast.assetName} > ${firstPointAsset.pointAssetName} > ${firstZone.zoneName}`,
              hasChildren: true
            });
          } else {
            setContextNodes([]);
          }
        } else {
          setZones([]);
          setSelectedZone(null);
          setContextNodes([]);
        }
      } else {
        setPointAssets([]);
        setSelectedPointAsset(null);

        const fetchedRegions = await regionService.getByAssetId(ast.id).catch(() => []);
        setRegions(fetchedRegions || []);

        const firstRegion = (fetchedRegions && fetchedRegions.length > 0) ? fetchedRegions[0] : null;
        setSelectedRegion(firstRegion);

        if (firstRegion && firstRegion.id) {
          const fetchedZones = await deploymentZoneService.getByRegionId(firstRegion.id).catch(() => []);
          setZones(fetchedZones || []);
          const firstZone = (fetchedZones && fetchedZones.length > 0) ? fetchedZones[0] : null;
          setSelectedZone(firstZone);

          if (firstZone) {
            fetchNodesForZone(firstZone.id || '');
            setSelectedEngineeringObject({
              id: firstRegion.id,
              name: firstRegion.regionName || `Region ${firstRegion.regionCode}`,
              type: 'REGION',
              parentObject: ast.assetName,
              hierarchyPath: `${ast.assetName} > ${firstRegion.regionName}`,
              hasChildren: true
            });
          } else {
            setContextNodes([]);
          }
        } else {
          setZones([]);
          setSelectedZone(null);
          setContextNodes([]);
        }
      }
    } catch {
      // Fallback
    }
  }, [assets, fetchNodesForZone]);

  // Synchronized Context Changer: Region selection (Linear Assets)
  const setContextFromRegion = useCallback(async (regionId: string) => {
    try {
      const reg = regions.find(r => r.id === regionId || r.regionCode === regionId) || regions[0];
      if (!reg) return;

      setSelectedRegion(reg);

      const fetchedZones = await deploymentZoneService.getByRegionId(reg.id || '').catch(() => []);
      setZones(fetchedZones || []);
      const firstZone = (fetchedZones && fetchedZones.length > 0) ? fetchedZones[0] : null;
      setSelectedZone(firstZone);

      if (firstZone) {
        fetchNodesForZone(firstZone.id || '');
      } else {
        setContextNodes([]);
      }

      setSelectedEngineeringObject({
        id: reg.id || reg.regionCode,
        name: reg.regionName || `Region ${reg.regionCode}`,
        type: 'REGION',
        parentObject: selectedAsset?.assetName || 'Asset',
        hierarchyPath: `${selectedAsset?.assetName || 'Asset'} > ${reg.regionName}`,
        hasChildren: true
      });
    } catch {
      // Fallback
    }
  }, [regions, selectedAsset, fetchNodesForZone]);

  // Synchronized Context Changer: Point Asset selection (Point Assets)
  const setContextFromPointAsset = useCallback(async (pointAssetId: string) => {
    try {
      const pa = pointAssets.find(p => p.id === pointAssetId || p.pointAssetCode === pointAssetId) || pointAssets[0];
      if (!pa) return;

      setSelectedPointAsset(pa);

      const fetchedZones = await deploymentZoneService.getByAssetId(pa.id).catch(() => []);
      setZones(fetchedZones || []);
      const firstZone = (fetchedZones && fetchedZones.length > 0) ? fetchedZones[0] : null;
      setSelectedZone(firstZone);

      if (firstZone) {
        fetchNodesForZone(firstZone.id || '');
        setSelectedEngineeringObject({
          id: firstZone.id || firstZone.zoneCode,
          name: firstZone.zoneName || `Zone ${firstZone.zoneCode}`,
          type: 'DEPLOYMENT_ZONE',
          parentObject: pa.pointAssetName,
          hierarchyPath: `${selectedAsset?.assetName || 'Asset'} > ${pa.pointAssetName} > ${firstZone.zoneName}`,
          hasChildren: true
        });
      } else {
        setContextNodes([]);
      }
    } catch {
      // Fallback
    }
  }, [pointAssets, selectedAsset, fetchNodesForZone]);

  // Synchronized Context Changer: Zone selection
  const setContextFromZone = useCallback((zoneId: string) => {
    const zn = zones.find(z => z.id === zoneId || z.zoneCode === zoneId) || zones[0];
    if (!zn) return;

    setSelectedZone(zn);
    if (zn.id) {
      fetchNodesForZone(zn.id);
    }

    const isPointAsset = selectedAsset?.assetNature?.toUpperCase() === 'POINT';
    const hierarchy = isPointAsset
      ? `${selectedAsset?.assetName || 'Asset'} > ${selectedPointAsset?.pointAssetName || 'Point Asset'} > ${zn.zoneName}`
      : `${selectedAsset?.assetName || 'Asset'} > ${selectedRegion?.regionName || 'Region'} > ${zn.zoneName}`;

    setSelectedEngineeringObject({
      id: zn.id || zn.zoneCode,
      name: zn.zoneName || `Zone ${zn.zoneCode}`,
      type: 'DEPLOYMENT_ZONE',
      parentObject: isPointAsset ? (selectedPointAsset?.pointAssetName || 'Point Asset') : (selectedRegion?.regionName || 'Region'),
      hierarchyPath: hierarchy,
      hasChildren: true
    });
  }, [zones, selectedAsset, selectedRegion, selectedPointAsset, fetchNodesForZone]);

  // Initial Load: Fetch Assets first, then cascade according to Asset Nature
  useEffect(() => {
    let isMounted = true;

    const initContext = async () => {
      try {
        const fetchedAssets = await assetService.getAll().catch(() => []);
        if (isMounted && fetchedAssets && fetchedAssets.length > 0) {
          setAssets(fetchedAssets);
          const initialAsset = fetchedAssets[0];
          setSelectedAsset(initialAsset);
          if (initialAsset.assetClass) setSelectedAssetClass(initialAsset.assetClass);

          const isPointAsset = initialAsset.assetNature?.toUpperCase() === 'POINT';

          if (isPointAsset) {
            setRegions([]);
            setSelectedRegion(null);

            const fetchedPointAssets = await pointAssetService.getByAssetId(initialAsset.id).catch(() => []);
            if (isMounted && fetchedPointAssets && fetchedPointAssets.length > 0) {
              setPointAssets(fetchedPointAssets);
              const firstPointAsset = fetchedPointAssets[0];
              setSelectedPointAsset(firstPointAsset);

              const fetchedZones = await deploymentZoneService.getByAssetId(firstPointAsset.id).catch(() => []);
              if (isMounted && fetchedZones && fetchedZones.length > 0) {
                setZones(fetchedZones);
                const firstZone = fetchedZones[0];
                setSelectedZone(firstZone);
                if (firstZone.id) {
                  fetchNodesForZone(firstZone.id);
                }
              }
            }
          } else {
            setPointAssets([]);
            setSelectedPointAsset(null);

            const fetchedRegions = await regionService.getByAssetId(initialAsset.id).catch(() => []);
            if (isMounted && fetchedRegions && fetchedRegions.length > 0) {
              setRegions(fetchedRegions);
              const initialRegion = fetchedRegions[0];
              setSelectedRegion(initialRegion);

              const fetchedZones = await deploymentZoneService.getByRegionId(initialRegion.id || '').catch(() => []);
              if (isMounted && fetchedZones && fetchedZones.length > 0) {
                setZones(fetchedZones);
                const firstZone = fetchedZones[0];
                setSelectedZone(firstZone);
                if (firstZone.id) {
                  fetchNodesForZone(firstZone.id);
                }
              }
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    initContext();

    return () => {
      isMounted = false;
    };
  }, [fetchNodesForZone]);

  return (
    <EngineeringContext.Provider
      value={{
        selectedAsset,
        selectedRegion,
        selectedPointAsset,
        selectedZone,
        selectedAssetClass,
        selectedEngineeringObject,
        assets,
        regions,
        pointAssets,
        zones,
        contextNodes,
        contextSensors,
        setContextFromAsset,
        setContextFromRegion,
        setContextFromPointAsset,
        setContextFromZone,
        setSelectedAssetClass,
        setSelectedEngineeringObject
      }}
    >
      {children}
    </EngineeringContext.Provider>
  );
};
