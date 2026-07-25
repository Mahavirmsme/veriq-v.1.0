import { useState, useEffect, useCallback } from 'react';
import { assetService, Asset, CreateAssetPayload, UpdateAssetPayload } from '../services/assetService';

export const useAssetState = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setError(apiError?.error?.details || apiError?.message || 'Failed to connect to backend asset service.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const createAsset = async (payload: CreateAssetPayload) => {
    setError(null);
    try {
      const created = await assetService.create(payload);
      setAssets((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to create asset record.';
      setError(errorMsg);
      throw err;
    }
  };

  const updateAsset = async (id: string, payload: UpdateAssetPayload) => {
    setError(null);
    try {
      const updated = await assetService.update(id, payload);
      setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to update asset record.';
      setError(errorMsg);
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    setError(null);
    try {
      await assetService.delete(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to delete asset record.';
      setError(errorMsg);
      throw err;
    }
  };

  return {
    assets,
    loading,
    error,
    refresh: fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
};
