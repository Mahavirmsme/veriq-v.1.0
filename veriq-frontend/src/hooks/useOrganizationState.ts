import { useState, useEffect, useCallback } from 'react';
import { organizationService, Organization, CreateOrganizationPayload, UpdateOrganizationPayload } from '../services/organizationService';

export const useOrganizationState = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await organizationService.getAll();
      setOrganizations(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setError(apiError?.error?.details || apiError?.message || 'Failed to connect to backend database service.');
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const createOrganization = async (payload: CreateOrganizationPayload) => {
    setError(null);
    try {
      const created = await organizationService.create(payload);
      setOrganizations((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to create organization in database.';
      setError(errorMsg);
      throw err;
    }
  };

  const updateOrganization = async (id: string, payload: UpdateOrganizationPayload) => {
    setError(null);
    try {
      const updated = await organizationService.update(id, payload);
      setOrganizations((prev) => prev.map((o) => (o.id === id ? updated : o)));
      return updated;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to update organization in database.';
      setError(errorMsg);
      throw err;
    }
  };

  const deleteOrganization = async (id: string) => {
    setError(null);
    try {
      await organizationService.delete(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to delete organization from database.';
      setError(errorMsg);
      throw err;
    }
  };

  return {
    organizations,
    loading,
    error,
    refresh: fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
