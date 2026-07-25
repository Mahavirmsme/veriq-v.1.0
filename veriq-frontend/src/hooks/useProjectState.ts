import { useState, useEffect, useCallback } from 'react';
import { projectService, Project, CreateProjectPayload, UpdateProjectPayload } from '../services/projectService';

export const useProjectState = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setError(apiError?.error?.details || apiError?.message || 'Failed to connect to backend project service.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (payload: CreateProjectPayload) => {
    setError(null);
    try {
      const created = await projectService.create(payload);
      setProjects((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to create project record.';
      setError(errorMsg);
      throw err;
    }
  };

  const updateProject = async (id: string, payload: UpdateProjectPayload) => {
    setError(null);
    try {
      const updated = await projectService.update(id, payload);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to update project record.';
      setError(errorMsg);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    setError(null);
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      const errorMsg = apiError?.error?.details || apiError?.message || 'Failed to delete project record.';
      setError(errorMsg);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
