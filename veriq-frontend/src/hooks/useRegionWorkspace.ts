import { useState, useCallback } from 'react';
import { regionService, Region, SaveRegionsPayload } from '../services/regionService';
import { Asset } from '../services/assetService';

export interface EditableRegionRow {
  regionCode: string;
  regionName: string;
  startChainage: string;
  endChainage: string;
  length: number;
  status: 'PENDING' | 'VALIDATED' | 'INVALID';
}

export interface ValidationErrorItem {
  rule: string;
  message: string;
  severity: 'ERROR' | 'SUCCESS';
}

export const useRegionWorkspace = () => {
  const [regions, setRegions] = useState<EditableRegionRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationErrorItem[]>([]);
  const [isValidatedSuccess, setIsValidatedSuccess] = useState<boolean>(false);

  const loadExistingRegions = useCallback(async (assetId: string): Promise<Region[]> => {
    setLoading(true);
    setServerError(null);
    setIsValidatedSuccess(false);
    setValidationResults([]);
    try {
      const data = await regionService.getByAssetId(assetId);
      if (data && data.length > 0) {
        const rows: EditableRegionRow[] = data.map((r) => ({
          regionCode: r.regionCode,
          regionName: r.regionName,
          startChainage: String(r.startChainage),
          endChainage: String(r.endChainage),
          length: r.regionLength,
          status: 'VALIDATED',
        }));
        setRegions(rows);
      } else {
        setRegions([]);
      }
      return data || [];
    } catch {
      setRegions([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateRegions = (count: number, assetStart: number, assetEnd: number) => {
    if (count <= 0) return;
    const assetLength = assetEnd - assetStart;
    const interval = assetLength > 0 ? assetLength / count : 0;
    const newRows: EditableRegionRow[] = [];

    for (let i = 0; i < count; i++) {
      const code = `R-${String(i + 1).padStart(2, '0')}`;
      const name = `Region ${i + 1}`;
      const start = assetStart + i * interval;
      const end = i === count - 1 ? assetEnd : assetStart + (i + 1) * interval;
      const len = end - start;

      newRows.push({
        regionCode: code,
        regionName: name,
        startChainage: start.toFixed(3),
        endChainage: end.toFixed(3),
        length: parseFloat(len.toFixed(3)),
        status: 'PENDING',
      });
    }

    setRegions(newRows);
    setIsValidatedSuccess(false);
    setValidationResults([]);
  };

  const updateRegionRow = (index: number, field: keyof EditableRegionRow, value: string) => {
    setRegions((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };
      const start = parseFloat(row.startChainage);
      const end = parseFloat(row.endChainage);
      if (!isNaN(start) && !isNaN(end)) {
        row.length = parseFloat((end - start).toFixed(3));
      } else {
        row.length = 0;
      }
      row.status = 'PENDING';
      updated[index] = row;
      return updated;
    });
    setIsValidatedSuccess(false);
  };

  const validateDesign = (selectedAsset: Asset): boolean => {
    const results: ValidationErrorItem[] = [];
    if (!regions || regions.length === 0) {
      results.push({
        rule: 'REGION_COUNT',
        message: 'No regions generated. At least one region required.',
        severity: 'ERROR',
      });
      setValidationResults(results);
      setIsValidatedSuccess(false);
      return false;
    }

    const assetStart = selectedAsset.startChainage || 0;
    const assetEnd = selectedAsset.endChainage || 0;
    const assetLength = selectedAsset.totalLength || (assetEnd - assetStart);

    let hasErrors = false;

    // Rule 1: First Region starts at Asset Start
    const firstStart = parseFloat(regions[0].startChainage);
    if (isNaN(firstStart) || Math.abs(firstStart - assetStart) > 0.001) {
      results.push({
        rule: 'ASSET_START_BOUND',
        message: `First Region start chainage (${regions[0].startChainage}) must equal Asset start (${assetStart} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'ASSET_START_BOUND',
        message: `First Region correctly starts at Asset start (${assetStart} km).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 2: Last Region ends at Asset End
    const lastEnd = parseFloat(regions[regions.length - 1].endChainage);
    if (isNaN(lastEnd) || Math.abs(lastEnd - assetEnd) > 0.001) {
      results.push({
        rule: 'ASSET_END_BOUND',
        message: `Last Region end chainage (${regions[regions.length - 1].endChainage}) must equal Asset end (${assetEnd} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'ASSET_END_BOUND',
        message: `Last Region correctly ends at Asset end (${assetEnd} km).`,
        severity: 'SUCCESS',
      });
    }

    // Rule 3 & 4: Region Length > 0 & No Gaps/Overlaps
    let totalCoverage = 0;
    for (let i = 0; i < regions.length; i++) {
      const row = regions[i];
      const start = parseFloat(row.startChainage);
      const end = parseFloat(row.endChainage);

      if (isNaN(start) || isNaN(end) || end <= start) {
        results.push({
          rule: 'POSITIVE_LENGTH',
          message: `Region ${row.regionCode} length must be greater than zero.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }

      const len = end - start;
      if (!isNaN(len) && len > 0) {
        totalCoverage += len;
      }

      if (i > 0) {
        const prevEnd = parseFloat(regions[i - 1].endChainage);
        if (Math.abs(start - prevEnd) > 0.001) {
          results.push({
            rule: 'GAP_OR_OVERLAP',
            message: `Gap or overlap detected between ${regions[i - 1].regionCode} (end: ${prevEnd}) and ${row.regionCode} (start: ${start}).`,
            severity: 'ERROR',
          });
          hasErrors = true;
        }
      }
    }

    // Rule 5: Total Coverage equals Asset Length
    if (Math.abs(totalCoverage - assetLength) > 0.001) {
      results.push({
        rule: 'TOTAL_COVERAGE',
        message: `Total Region coverage (${totalCoverage.toFixed(3)} km) does not equal Asset length (${assetLength} km).`,
        severity: 'ERROR',
      });
      hasErrors = true;
    } else {
      results.push({
        rule: 'TOTAL_COVERAGE',
        message: `Total Region coverage (${totalCoverage.toFixed(3)} km) perfectly equals Asset length (${assetLength} km).`,
        severity: 'SUCCESS',
      });
    }

    setValidationResults(results);
    const success = !hasErrors;
    setIsValidatedSuccess(success);

    // Update row statuses
    setRegions((prev) =>
      prev.map((r) => ({
        ...r,
        status: success ? 'VALIDATED' : 'INVALID',
      }))
    );

    return success;
  };

  const saveEngineeringDesign = async (assetId: string) => {
    if (!isValidatedSuccess) return;
    setSaving(true);
    setServerError(null);
    try {
      const payload: SaveRegionsPayload = {
        assetId,
        regions: regions.map((r) => ({
          regionCode: r.regionCode,
          regionName: r.regionName,
          startChainage: parseFloat(r.startChainage),
          endChainage: parseFloat(r.endChainage),
        })),
      };
      const savedData = await regionService.saveRegions(payload);
      if (savedData && savedData.length > 0) {
        const savedRows: EditableRegionRow[] = savedData.map((r) => ({
          regionCode: r.regionCode,
          regionName: r.regionName,
          startChainage: String(r.startChainage),
          endChainage: String(r.endChainage),
          length: r.regionLength,
          status: 'VALIDATED',
        }));
        setRegions(savedRows);
      }
      return savedData;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Error saving region engineering design.';
      setServerError(errorMsg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    regions,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingRegions,
    generateRegions,
    updateRegionRow,
    validateDesign,
    saveEngineeringDesign,
  };
};
