import { runtimeSensorService, RuntimeSensorRecord } from './runtimeSensorService';

/**
 * CANONICAL INTERNAL SERVICE: RuntimeAssetRegistryService
 * Permanent internal identity for Runtime Asset Registry.
 * Note: Client UI continues displaying approved product terminology ("Runtime Sensors").
 */
export interface RuntimeAssetRegistryDTO extends RuntimeSensorRecord {}

export const runtimeAssetRegistryService = {
  getAll: async (): Promise<RuntimeAssetRegistryDTO[]> => {
    return runtimeSensorService.getAll();
  },

  getByNodeId: async (nodeId: string): Promise<RuntimeAssetRegistryDTO[]> => {
    return runtimeSensorService.getByNodeId(nodeId);
  },
};
