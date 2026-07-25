import { useState, useCallback } from 'react';
import { engineeringNodeService, EngineeringNode, SaveEngineeringNodesPayload } from '../services/engineeringNodeService';
import { DeploymentZone } from '../services/deploymentZoneService';

export interface DisplayNodeRow {
  nodeCode: string;
  nodeNumber: number;
  chainage: number;
  formattedChainage: string;
  generationStatus: string;
  engineeringStatus: 'GENERATED' | 'VALIDATED' | 'SAVED' | 'INVALID';
}

export interface ValidationErrorItem {
  rule: string;
  message: string;
  severity: 'ERROR' | 'SUCCESS';
}

const formatChainageString = (km: number): string => {
  const wholeKm = Math.floor(km);
  const meters = Math.round((km - wholeKm) * 1000);
  return `${wholeKm}+${String(meters).padStart(3, '0')}`;
};

export const useEngineeringNodeWorkspace = () => {
  const [nodes, setNodes] = useState<DisplayNodeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationErrorItem[]>([]);
  const [isValidatedSuccess, setIsValidatedSuccess] = useState<boolean>(false);

  const loadExistingNodes = useCallback(async (deploymentZoneId: string): Promise<EngineeringNode[]> => {
    setLoading(true);
    setServerError(null);
    setIsValidatedSuccess(false);
    setValidationResults([]);
    try {
      const data = await engineeringNodeService.getByDeploymentZoneId(deploymentZoneId);
      if (data && data.length > 0) {
        const rows: DisplayNodeRow[] = data.map((n) => ({
          nodeCode: n.nodeCode,
          nodeNumber: n.nodeNumber,
          chainage: n.chainage,
          formattedChainage: n.formattedChainage || formatChainageString(n.chainage),
          generationStatus: 'SYSTEM_GENERATED',
          engineeringStatus: 'SAVED',
        }));
        setNodes(rows);
      } else {
        setNodes([]);
      }
      return data || [];
    } catch {
      setNodes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNodes = (zoneStart: number, zoneEnd: number, nodeSpacingMeters: number) => {
    if (nodeSpacingMeters <= 0 || zoneEnd <= zoneStart) return;
    
    const zoneLengthKm = zoneEnd - zoneStart;
    const zoneLengthMeters = zoneLengthKm * 1000;
    const count = Math.max(1, Math.floor(zoneLengthMeters / nodeSpacingMeters) + 1);

    const newRows: DisplayNodeRow[] = [];

    for (let i = 0; i < count; i++) {
      const num = i + 1;
      const code = `ND-${String(num).padStart(3, '0')}`;
      
      let chKm = zoneStart + (i * nodeSpacingMeters) / 1000;
      if (i === count - 1 || chKm > zoneEnd) {
        chKm = zoneEnd;
      }
      chKm = parseFloat(chKm.toFixed(3));

      newRows.push({
        nodeCode: code,
        nodeNumber: num,
        chainage: chKm,
        formattedChainage: formatChainageString(chKm),
        generationStatus: 'SYSTEM_GENERATED',
        engineeringStatus: 'GENERATED',
      });
    }

    setNodes(newRows);
    setIsValidatedSuccess(false);
    setValidationResults([]);
  };

  const validateDesign = (selectedZone: DeploymentZone): boolean => {
    const results: ValidationErrorItem[] = [];
    if (!nodes || nodes.length === 0) {
      results.push({
        rule: 'NODE_COUNT',
        message: 'No engineering nodes generated. Run node generation first.',
        severity: 'ERROR',
      });
      setValidationResults(results);
      setIsValidatedSuccess(false);
      return false;
    }

    const zoneStart = selectedZone.startChainage || 0;
    const zoneEnd = selectedZone.endChainage || 0;

    let hasErrors = false;

    // Rule 1: First Node starts at Zone Start Chainage
    if (Math.abs(nodes[0].chainage - zoneStart) > 0.001) {
      results.push({
        rule: 'ZONE_START_BOUND',
        message: `First Engineering Node chainage (${nodes[0].chainage} km) must equal Deployment Zone start (${zoneStart} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'ZONE_START_BOUND',
        message: `First Engineering Node correctly starts at Deployment Zone start (${formatChainageString(zoneStart)}).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 2: Last Node ends at Zone End Chainage
    const lastNode = nodes[nodes.length - 1];
    if (Math.abs(lastNode.chainage - zoneEnd) > 0.001) {
      results.push({
        rule: 'ZONE_END_BOUND',
        message: `Last Engineering Node chainage (${lastNode.chainage} km) must equal Deployment Zone end (${zoneEnd} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'ZONE_END_BOUND',
        message: `Last Engineering Node correctly ends at Deployment Zone end (${formatChainageString(zoneEnd)}).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 3 & 4: Continuous sequence and no duplicates
    const numberSet = new Set<number>();
    const chainageSet = new Set<number>();

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.nodeNumber !== i + 1) {
        results.push({
          rule: 'CONTINUOUS_SEQUENCE',
          message: `Non-continuous sequence detected at node ${n.nodeCode}.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }
      if (numberSet.has(n.nodeNumber)) {
        results.push({
          rule: 'DUPLICATE_NODE',
          message: `Duplicate node number ${n.nodeNumber} detected.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }
      numberSet.add(n.nodeNumber);

      if (chainageSet.has(n.chainage)) {
        results.push({
          rule: 'DUPLICATE_CHAINAGE',
          message: `Duplicate chainage ${n.formattedChainage} detected at node ${n.nodeCode}.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }
      chainageSet.add(n.chainage);
    }

    if (!hasErrors) {
      results.push({
        rule: 'UNIFORM_SPACING_SEQUENCE',
        message: `All ${nodes.length} Engineering Nodes form a continuous, uniform, and valid engineering sequence.`,
        severity: 'SUCCESS',
      });
    }

    setValidationResults(results);
    const success = !hasErrors;
    setIsValidatedSuccess(success);

    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        engineeringStatus: success ? 'VALIDATED' : 'INVALID',
      }))
    );

    return success;
  };

  const saveEngineeringDesign = async (deploymentZoneId: string) => {
    if (!isValidatedSuccess) return;
    setSaving(true);
    setServerError(null);
    try {
      const payload: SaveEngineeringNodesPayload = {
        deploymentZoneId,
        nodes: nodes.map((n) => ({
          nodeCode: n.nodeCode,
          nodeNumber: n.nodeNumber,
          chainage: n.chainage,
        })),
      };
      const savedData = await engineeringNodeService.saveNodes(payload);
      if (savedData && savedData.length > 0) {
        const savedRows: DisplayNodeRow[] = savedData.map((n) => ({
          nodeCode: n.nodeCode,
          nodeNumber: n.nodeNumber,
          chainage: n.chainage,
          formattedChainage: n.formattedChainage || formatChainageString(n.chainage),
          generationStatus: 'SYSTEM_GENERATED',
          engineeringStatus: 'SAVED',
        }));
        setNodes(savedRows);
      }
      return savedData;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Error saving engineering node design.';
      setServerError(errorMsg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    nodes,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingNodes,
    generateNodes,
    validateDesign,
    saveEngineeringDesign,
  };
};
