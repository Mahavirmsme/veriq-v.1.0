import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WorkspaceType, UserRole } from '../authentication/RoleResolver';
import { useAuth } from '../../context/AuthContext';

interface WorkspaceContextType {
  activeWorkspace: WorkspaceType;
  setActiveWorkspace: (ws: WorkspaceType) => void;
  userRole: UserRole;
  allowedWorkspaces: WorkspaceType[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const userRole: UserRole = (user as any)?.role || 'ADMIN';
  
  // Dynamic location-based workspace resolution
  const getWorkspaceFromPath = (path: string): WorkspaceType => {
    if (path.startsWith('/admin')) return 'administration';
    if (path.startsWith('/config')) return 'configuration';
    if (path.startsWith('/ops')) return 'operations';
    return 'administration';
  };

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>(() => {
    return getWorkspaceFromPath(location.pathname);
  });

  useEffect(() => {
    setActiveWorkspace(getWorkspaceFromPath(location.pathname));
  }, [location.pathname]);

  // Allowed workspaces loaded from authenticated user session
  const allowedWorkspaces: WorkspaceType[] = (user as any)?.allowedWorkspaces 
    ? (user as any).allowedWorkspaces as WorkspaceType[]
    : ['administration', 'configuration', 'operations'];

  return (
    <WorkspaceContext.Provider value={{
      activeWorkspace,
      setActiveWorkspace,
      userRole,
      allowedWorkspaces
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
