import { useState, useCallback } from 'react';
import { sensorPackageService, SensorPackage, SaveSensorPackagePayload, SENSOR_MASTER_LIST } from '../services/sensorPackageService';

export interface EditableSensorRow {
  sensorType: string;
  quantity: number;
  measurementParameter: string;
  engineeringPurpose: string;
  remarks: string;
  status: 'PENDING' | 'VALIDATED' | 'INVALID';
}

export interface ValidationErrorItem {
  rule: string;
  message: string;
  severity: 'ERROR' | 'SUCCESS';
}

export const useSensorPackageWorkspace = () => {
  const [items, setItems] = useState<EditableSensorRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationErrorItem[]>([]);
  const [isValidatedSuccess, setIsValidatedSuccess] = useState<boolean>(false);

  const loadExistingPackage = useCallback(async (nodeId: string): Promise<SensorPackage | null> => {
    setLoading(true);
    setServerError(null);
    setIsValidatedSuccess(false);
    setValidationResults([]);
    try {
      const data = await sensorPackageService.getByEngineeringNodeId(nodeId);
      if (data && data.items && data.items.length > 0) {
        const rows: EditableSensorRow[] = data.items.map((i) => ({
          sensorType: i.sensorType,
          quantity: i.quantity,
          measurementParameter: i.measurementParameter || '',
          engineeringPurpose: i.engineeringPurpose || '',
          remarks: i.remarks || '',
          status: 'VALIDATED',
        }));
        setItems(rows);
      } else {
        setItems([]);
      }
      return data;
    } catch {
      setItems([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSensorType = (sensorType: string) => {
    if (!sensorType) return;
    if (items.some((i) => i.sensorType.toLowerCase() === sensorType.toLowerCase())) {
      setServerError(`Sensor type "${sensorType}" is already added to this package.`);
      return;
    }

    const master = SENSOR_MASTER_LIST.find((m) => m.type.toLowerCase() === sensorType.toLowerCase());
    const param = master ? master.parameter : 'Custom Parameter';

    setItems((prev) => [
      ...prev,
      {
        sensorType,
        quantity: 1,
        measurementParameter: param,
        engineeringPurpose: `${sensorType} monitoring`,
        remarks: '',
        status: 'PENDING',
      },
    ]);
    setServerError(null);
    setIsValidatedSuccess(false);
  };

  const removeSensorRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setIsValidatedSuccess(false);
  };

  const updateSensorRow = (index: number, field: keyof EditableSensorRow, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };
      row.status = 'PENDING';
      updated[index] = row;
      return updated;
    });
    setIsValidatedSuccess(false);
  };

  const validateDesign = (): boolean => {
    const results: ValidationErrorItem[] = [];
    if (!items || items.length === 0) {
      results.push({
        rule: 'SENSOR_TYPE_REQUIRED',
        message: 'No sensor types included. At least one sensor type is required in the package.',
        severity: 'ERROR',
      });
      setValidationResults(results);
      setIsValidatedSuccess(false);
      return false;
    }

    let hasErrors = false;
    const typeSet = new Set<string>();

    for (let i = 0; i < items.length; i++) {
      const row = items[i];

      if (!row.sensorType || row.sensorType.trim() === '') {
        results.push({
          rule: 'INVALID_SENSOR_TYPE',
          message: `Row #${i + 1} has an empty sensor type.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }

      const normalized = row.sensorType.trim().toLowerCase();
      if (typeSet.has(normalized)) {
        results.push({
          rule: 'DUPLICATE_SENSOR_TYPE',
          message: `Duplicate sensor type "${row.sensorType}" detected in package.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }
      typeSet.add(normalized);

      if (row.quantity <= 0) {
        results.push({
          rule: 'POSITIVE_QUANTITY',
          message: `Quantity for "${row.sensorType}" must be greater than zero.`,
          severity: 'ERROR',
        });
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
      results.push({
        rule: 'PACKAGE_VALIDATED',
        message: `Sensor package correctly configured with ${items.length} sensor types (${totalCount} total sensors).`,
        severity: 'SUCCESS',
      });
    }

    setValidationResults(results);
    const success = !hasErrors;
    setIsValidatedSuccess(success);

    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        status: success ? 'VALIDATED' : 'INVALID',
      }))
    );

    return success;
  };

  const saveEngineeringDesign = async (nodeId: string) => {
    if (!isValidatedSuccess) return;
    setSaving(true);
    setServerError(null);
    try {
      const payload: SaveSensorPackagePayload = {
        engineeringNodeId: nodeId,
        items: items.map((i) => ({
          sensorType: i.sensorType,
          quantity: i.quantity,
          measurementParameter: i.measurementParameter,
          engineeringPurpose: i.engineeringPurpose,
          remarks: i.remarks,
        })),
      };
      const savedData = await sensorPackageService.savePackage(payload);
      if (savedData && savedData.items) {
        const savedRows: EditableSensorRow[] = savedData.items.map((i) => ({
          sensorType: i.sensorType,
          quantity: i.quantity,
          measurementParameter: i.measurementParameter || '',
          engineeringPurpose: i.engineeringPurpose || '',
          remarks: i.remarks || '',
          status: 'VALIDATED',
        }));
        setItems(savedRows);
      }
      return savedData;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Error saving sensor package engineering design.';
      setServerError(errorMsg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingPackage,
    addSensorType,
    removeSensorRow,
    updateSensorRow,
    validateDesign,
    saveEngineeringDesign,
  };
};
