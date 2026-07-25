import { useState, useCallback } from 'react';
import { commissioningService, CommissioningRecord, RuntimeSensor } from '../services/commissioningService';
import { sensorPackageService, SensorPackage } from '../services/sensorPackageService';

export interface CommissioningRow {
  sensorType: string;
  requiredQty: number;
  commissionedQty: number;
  measurementParameter: string;
  status: 'PENDING' | 'ACCEPTED';
  generatedCodes: string[];
  remarks: string;
}

export interface ValidationErrorItem {
  rule: string;
  message: string;
  severity: 'ERROR' | 'SUCCESS';
}

const getPrefixForType = (type: string): string => {
  const lower = type.toLowerCase();
  if (lower.contains ? lower.contains('tilt') : lower.includes('tilt')) return 'TS';
  if (lower.includes('piezo')) return 'PZ';
  if (lower.includes('soil moisture')) return 'SM';
  if (lower.includes('inclinometer')) return 'INC';
  if (lower.includes('accelerometer')) return 'ACC';
  if (lower.includes('rain')) return 'RG';
  if (lower.includes('water level')) return 'WL';
  if (lower.includes('strain')) return 'SG';
  return 'RS';
};

export const useCommissioningWorkspace = () => {
  const [record, setRecord] = useState<CommissioningRecord | null>(null);
  const [sensorPackage, setSensorPackage] = useState<SensorPackage | null>(null);
  const [gridRows, setGridRows] = useState<CommissioningRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationErrorItem[]>([]);
  const [isValidatedSuccess, setIsValidatedSuccess] = useState<boolean>(false);

  const loadCommissioningState = useCallback(async (nodeId: string) => {
    setLoading(true);
    setServerError(null);
    setIsValidatedSuccess(false);
    setValidationResults([]);
    try {
      // Load saved Sensor Package
      const pkg = await sensorPackageService.getByEngineeringNodeId(nodeId);
      setSensorPackage(pkg);

      // Load Commissioning Record
      const commRecord = await commissioningService.getByEngineeringNodeId(nodeId);
      setRecord(commRecord);

      if (pkg && pkg.items && pkg.items.length > 0) {
        const isCompleted = commRecord?.status === 'COMMISSIONED';
        const runtimeMap = new Map<string, string[]>();

        if (commRecord?.runtimeSensors) {
          commRecord.runtimeSensors.forEach((rs) => {
            const list = runtimeMap.get(rs.sensorType) || [];
            list.push(rs.sensorCode);
            runtimeMap.set(rs.sensorType, list);
          });
        }

        const rows: CommissioningRow[] = pkg.items.map((item) => {
          const req = item.quantity;
          const commQty = isCompleted ? req : req;
          const codes = runtimeMap.get(item.sensorType) || [];

          return {
            sensorType: item.sensorType,
            requiredQty: req,
            commissionedQty: commQty,
            measurementParameter: item.measurementParameter || '',
            status: isCompleted ? 'ACCEPTED' : 'PENDING',
            generatedCodes: codes,
            remarks: item.remarks || '',
          };
        });

        setGridRows(rows);
      } else {
        setGridRows([]);
      }
    } catch {
      setGridRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const startCommissioningProcess = async (nodeId: string) => {
    setLoading(true);
    setServerError(null);
    try {
      const commRecord = await commissioningService.startCommissioning(nodeId);
      setRecord(commRecord);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setServerError(apiError?.error?.details || apiError?.message || 'Error starting commissioning.');
    } finally {
      setLoading(false);
    }
  };

  const updateCommissionedQty = (index: number, qty: number) => {
    setGridRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index] };
      row.commissionedQty = Math.max(0, qty);
      row.status = row.commissionedQty === row.requiredQty ? 'ACCEPTED' : 'PENDING';
      updated[index] = row;
      return updated;
    });
    setIsValidatedSuccess(false);
  };

  const validateAcceptance = (): boolean => {
    const results: ValidationErrorItem[] = [];
    if (!sensorPackage || !sensorPackage.items || sensorPackage.items.length === 0) {
      results.push({
        rule: 'SENSOR_PACKAGE_REQUIRED',
        message: 'No saved Sensor Package found for this Engineering Node.',
        severity: 'ERROR',
      });
      setValidationResults(results);
      setIsValidatedSuccess(false);
      return false;
    }

    let hasErrors = false;

    for (let i = 0; i < gridRows.length; i++) {
      const row = gridRows[i];
      if (row.commissionedQty < row.requiredQty) {
        results.push({
          rule: 'QUANTITY_MISMATCH',
          message: `Sensor type "${row.sensorType}" commissioned quantity (${row.commissionedQty}) is less than required quantity (${row.requiredQty}).`,
          severity: 'ERROR',
        });
        hasErrors = true;
      } else {
        results.push({
          rule: 'ACCEPTANCE_PASSED',
          message: `Sensor type "${row.sensorType}" 100% accepted (${row.commissionedQty} / ${row.requiredQty}).`,
          severity: 'SUCCESS',
        });
      }
    }

    if (!hasErrors) {
      results.push({
        rule: 'ALL_SENSORS_ACCEPTED',
        message: 'All required sensor types fully accepted and ready for Runtime Sensor generation.',
        severity: 'SUCCESS',
      });
    }

    setValidationResults(results);
    const success = !hasErrors;
    setIsValidatedSuccess(success);

    return success;
  };

  const completeCommissioningProcess = async (nodeId: string, remarks?: string) => {
    if (!isValidatedSuccess) return;
    setSaving(true);
    setServerError(null);
    try {
      const commRecord = await commissioningService.completeCommissioning({
        engineeringNodeId: nodeId,
        remarks,
      });
      setRecord(commRecord);
      await loadCommissioningState(nodeId);
      return commRecord;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setServerError(apiError?.error?.details || apiError?.message || 'Error completing commissioning.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    record,
    sensorPackage,
    gridRows,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadCommissioningState,
    startCommissioningProcess,
    updateCommissionedQty,
    validateAcceptance,
    completeCommissioningProcess,
  };
};
