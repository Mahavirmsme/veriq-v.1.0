import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bootstrapService } from '../../services/bootstrapService';
import { getDefaultWorkspaceForRole, UserRole } from '../authentication/RoleResolver';

export const RoleRedirector: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [checkingBootstrap, setCheckingBootstrap] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    bootstrapService.getBootstrapStatus()
      .then((status) => {
        if (isMounted) {
          setIsInitialized(status.initialized);
          setCheckingBootstrap(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsInitialized(false);
          setCheckingBootstrap(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  if (checkingBootstrap) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F172A',
        color: '#60A5FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: 700
      }}>
        VERIQ PLATFORM BOOTSTRAP CHECK...
      </div>
    );
  }

  // IF platform is NOT initialized -> Open Bootstrap Wizard
  if (!isInitialized) {
    return <Navigate to="/bootstrap" replace />;
  }

  // ELSE IF not authenticated -> Open Login Screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check persisted active workspace selected by user
  const activeWs = localStorage.getItem('veriq_active_workspace');
  if (activeWs === 'portfolio') return <Navigate to="/portfolio" replace />;
  if (activeWs === 'administration') return <Navigate to="/admin" replace />;
  if (activeWs === 'configuration') return <Navigate to="/config/projects" replace />;
  if (activeWs === 'operations') return <Navigate to="/ops" replace />;

  // Default fallback workspace for assigned primary role
  const role: UserRole = (user as any)?.role || (user?.roles && user.roles[0]) || 'ROLE_ORG_ADMIN';
  const defaultWs = getDefaultWorkspaceForRole(role);

  switch (defaultWs) {
    case 'portfolio':
      return <Navigate to="/portfolio" replace />;
    case 'administration':
      return <Navigate to="/admin" replace />;
    case 'configuration':
      return <Navigate to="/config/projects" replace />;
    case 'operations':
      return <Navigate to="/ops" replace />;
    default:
      return <Navigate to="/portfolio" replace />;
  }
};
