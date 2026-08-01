import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WorkspaceType, UserRole, getAllowedWorkspacesForRole } from '../authentication/RoleResolver';
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

  const userRole: UserRole = (user as any)?.role || (user?.roles && user.roles[0]) || 'ROLE_ORG_ADMIN';

  // Dynamic location-based workspace resolution
  const getWorkspaceFromPath = (path: string): WorkspaceType => {
    if (path.startsWith('/portfolio')) return 'portfolio';
    if (path.startsWith('/admin')) return 'administration';
    if (path.startsWith('/config')) return 'configuration';
    if (path.startsWith('/ops')) return 'operations';
    return 'portfolio';
  };

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>(() => {
    return getWorkspaceFromPath(location.pathname);
  });

  useEffect(() => {
    setActiveWorkspace(getWorkspaceFromPath(location.pathname));
  }, [location.pathname]);

  // Allowed workspaces dynamically resolved from authenticated user's primary assigned role
  const allowedWorkspaces: WorkspaceType[] = (user as any)?.allowedWorkspaces && (user as any).allowedWorkspaces.length > 0
    ? (user as any).allowedWorkspaces as WorkspaceType[]
    : getAllowedWorkspacesForRole(userRole);

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
