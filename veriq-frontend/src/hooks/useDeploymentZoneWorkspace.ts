import { useState, useCallback } from 'react';
import { deploymentZoneService, DeploymentZone, SaveDeploymentZonesPayload, PRIORITY_SPACING_DEFAULTS } from '../services/deploymentZoneService';
import { Region } from '../services/regionService';

export interface EditableZoneRow {
  zoneCode: string;
  zoneName: string;
  priority: string;
  startChainage: string;
  endChainage: string;
  length: number;
  nodeSpacing: string;
  totalNodes: number;
  status: 'PENDING' | 'VALIDATED' | 'INVALID';
}

export interface ValidationErrorItem {
  rule: string;
  message: string;
  severity: 'ERROR' | 'SUCCESS';
}

export const useDeploymentZoneWorkspace = () => {
  const [zones, setZones] = useState<EditableZoneRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationErrorItem[]>([]);
  const [isValidatedSuccess, setIsValidatedSuccess] = useState<boolean>(false);

  const loadExistingZones = useCallback(async (regionId: string): Promise<DeploymentZone[]> => {
    setLoading(true);
    setServerError(null);
    setIsValidatedSuccess(false);
    setValidationResults([]);
    try {
      const data = await deploymentZoneService.getByRegionId(regionId);
      if (data && data.length > 0) {
        const rows: EditableZoneRow[] = data.map((z) => ({
          zoneCode: z.zoneCode,
          zoneName: z.zoneName,
          priority: z.priority,
          startChainage: String(z.startChainage),
          endChainage: String(z.endChainage),
          length: z.zoneLength,
          nodeSpacing: String(z.nodeSpacing),
          totalNodes: z.totalNodes,
          status: 'VALIDATED',
        }));
        setZones(rows);
      } else {
        setZones([]);
      }
      return data || [];
    } catch {
      setZones([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateZones = (count: number, regionStart: number, regionEnd: number) => {
    if (count <= 0) return;
    const regionLength = regionEnd - regionStart;
    const interval = regionLength > 0 ? regionLength / count : 0;
    const newRows: EditableZoneRow[] = [];

    for (let i = 0; i < count; i++) {
      const code = `Z-${String(i + 1).padStart(2, '0')}`;
      const name = `Deployment Zone ${i + 1}`;
      const priority = i === 0 ? 'High' : 'Medium';
      const defaultSpacing = PRIORITY_SPACING_DEFAULTS[priority] || 200;
      const start = regionStart + i * interval;
      const end = i === count - 1 ? regionEnd : regionStart + (i + 1) * interval;
      const len = end - start;

      const lengthMeters = len * 1000;
      const nodes = Math.max(1, Math.floor(lengthMeters / defaultSpacing) + 1);

      newRows.push({
        zoneCode: code,
        zoneName: name,
        priority,
        startChainage: start.toFixed(3),
        endChainage: end.toFixed(3),
        length: parseFloat(len.toFixed(3)),
        nodeSpacing: String(defaultSpacing),
        totalNodes: nodes,
        status: 'PENDING',
      });
    }

    setZones(newRows);
    setIsValidatedSuccess(false);
    setValidationResults([]);
  };

  const updateZoneRow = (index: number, field: keyof EditableZoneRow, value: string) => {
    setZones((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      if (field === 'priority' && PRIORITY_SPACING_DEFAULTS[value]) {
        row.nodeSpacing = String(PRIORITY_SPACING_DEFAULTS[value]);
      }

      const start = parseFloat(row.startChainage);
      const end = parseFloat(row.endChainage);
      const spacing = parseFloat(row.nodeSpacing);

      if (!isNaN(start) && !isNaN(end)) {
        const len = parseFloat((end - start).toFixed(3));
        row.length = len >= 0 ? len : 0;
        if (!isNaN(spacing) && spacing > 0 && len > 0) {
          row.totalNodes = Math.max(1, Math.floor((len * 1000) / spacing) + 1);
        } else {
          row.totalNodes = 1;
        }
      } else {
        row.length = 0;
        row.totalNodes = 1;
      }

      row.status = 'PENDING';
      updated[index] = row;
      return updated;
    });
    setIsValidatedSuccess(false);
  };

  const validateDesign = (selectedRegion: Region): boolean => {
    const results: ValidationErrorItem[] = [];
    if (!zones || zones.length === 0) {
      results.push({
        rule: 'ZONE_COUNT',
        message: 'No deployment zones generated. At least one zone required.',
        severity: 'ERROR',
      });
      setValidationResults(results);
      setIsValidatedSuccess(false);
      return false;
    }

    const regionStart = selectedRegion.startChainage || 0;
    const regionEnd = selectedRegion.endChainage || 0;
    const regionLength = selectedRegion.regionLength || (regionEnd - regionStart);

    let hasErrors = false;

    // Rule 1: First Zone starts at Region Start
    const firstStart = parseFloat(zones[0].startChainage);
    if (isNaN(firstStart) || Math.abs(firstStart - regionStart) > 0.001) {
      results.push({
        rule: 'REGION_START_BOUND',
        message: `First Deployment Zone start chainage (${zones[0].startChainage}) must equal Region start (${regionStart} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'REGION_START_BOUND',
        message: `First Deployment Zone correctly starts at Region start (${regionStart} km).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 2: Last Zone ends at Region End
    const lastEnd = parseFloat(zones[zones.length - 1].endChainage);
    if (isNaN(lastEnd) || Math.abs(lastEnd - regionEnd) > 0.001) {
      results.push({
        rule: 'REGION_END_BOUND',
        message: `Last Deployment Zone end chainage (${zones[zones.length - 1].endChainage}) must equal Region end (${regionEnd} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'REGION_END_BOUND',
        message: `Last Deployment Zone correctly ends at Region end (${regionEnd} km).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 3 & 4: Zone Length > 0, Node Spacing > 0 & No Gaps/Overlaps
    let totalCoverage = 0;
    for (let i = 0; i < zones.length; i++) {
      const row = zones[i];
      const start = parseFloat(row.startChainage);
      const end = parseFloat(row.endChainage);
      const spacing = parseFloat(row.nodeSpacing);

      if (isNaN(start) || isNaN(end) || end <= start) {
        results.push({
          rule: 'POSITIVE_LENGTH',
          message: `Deployment Zone ${row.zoneCode} length must be greater than zero.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }

      if (isNaN(spacing) || spacing <= 0) {
        results.push({
          rule: 'POSITIVE_SPACING',
          message: `Deployment Zone ${row.zoneCode} node spacing must be greater than zero meters.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }

      const len = end - start;
      if (!isNaN(len) && len > 0) {
        totalCoverage += len;
      }

      if (i > 0) {
        const prevEnd = parseFloat(zones[i - 1].endChainage);
        if (Math.abs(start - prevEnd) > 0.001) {
          results.push({
            rule: 'GAP_OR_OVERLAP',
            message: `Gap or overlap detected between ${zones[i - 1].zoneCode} (end: ${prevEnd}) and ${row.zoneCode} (start: ${start}).`,
            severity: 'ERROR',
          });
          hasErrors = true;
        }
      }
    }

    // Rule 5: Total Coverage equals Region Length
    if (Math.abs(totalCoverage - regionLength) > 0.001) {
      results.push({
        rule: 'TOTAL_COVERAGE',
        message: `Total Deployment Zone coverage (${totalCoverage.toFixed(3)} km) does not equal Region length (${regionLength} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'TOTAL_COVERAGE',
        message: `Total Deployment Zone coverage (${totalCoverage.toFixed(3)} km) perfectly equals Region length (${regionLength} km).`,
        severity: 'SUCCESS',
      });
    }

    setValidationResults(results);
    const success = !hasErrors;
    setIsValidatedSuccess(success);

    // Update row statuses
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        status: success ? 'VALIDATED' : 'INVALID',
      }))
    );

    return success;
  };

  const saveEngineeringDesign = async (regionId: string) => {
    if (!isValidatedSuccess) return;
    setSaving(true);
    setServerError(null);
    try {
      const payload: SaveDeploymentZonesPayload = {
        regionId,
        zones: zones.map((z) => ({
          zoneCode: z.zoneCode,
          zoneName: z.zoneName,
          priority: z.priority,
          startChainage: parseFloat(z.startChainage),
          endChainage: parseFloat(z.endChainage),
          nodeSpacing: parseFloat(z.nodeSpacing),
        })),
      };
      const savedData = await deploymentZoneService.saveZones(payload);
      if (savedData && savedData.length > 0) {
        const savedRows: EditableZoneRow[] = savedData.map((z) => ({
          zoneCode: z.zoneCode,
          zoneName: z.zoneName,
          priority: z.priority,
          startChainage: String(z.startChainage),
          endChainage: String(z.endChainage),
          length: z.zoneLength,
          nodeSpacing: String(z.nodeSpacing),
          totalNodes: z.totalNodes,
          status: 'VALIDATED',
        }));
        setZones(savedRows);
      }
      return savedData;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Error saving deployment zone engineering design.';
      setServerError(errorMsg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    zones,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingZones,
    generateZones,
    updateZoneRow,
    validateDesign,
    saveEngineeringDesign,
  };
};
