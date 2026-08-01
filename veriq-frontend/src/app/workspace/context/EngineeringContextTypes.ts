import { EngineeringObject } from './EngineeringObject';
import { Asset } from '../../../services/assetService';
import { Region } from '../../../services/regionService';
import { PointAsset } from '../../../services/pointAssetService';
import { DeploymentZone } from '../../../services/deploymentZoneService';
import { EngineeringNode } from '../../../services/engineeringNodeService';

import { RuntimeSensorRecord } from '../../../services/runtimeSensorService';

export interface SynchronizedContextState {
  selectedAsset: Asset | null;
  selectedRegion: Region | null;
  selectedPointAsset: PointAsset | null;
  selectedZone: DeploymentZone | null;
  selectedAssetClass: string;
  selectedEngineeringObject: EngineeringObject;
  assets: Asset[];
  regions: Region[];
  pointAssets: PointAsset[];
  zones: DeploymentZone[];
  contextNodes: EngineeringNode[];
  contextSensors: RuntimeSensorRecord[];
  setContextFromAsset: (assetId: string) => Promise<void>;
  setContextFromRegion: (regionId: string) => Promise<void>;
  setContextFromPointAsset: (pointAssetId: string) => Promise<void>;
  setContextFromZone: (zoneId: string) => void;
  setSelectedAssetClass: (assetClass: string) => void;
  setSelectedEngineeringObject: (object: EngineeringObject) => void;
}

export type EngineeringContextState = SynchronizedContextState;
