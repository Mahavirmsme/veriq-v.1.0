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

  // ELSE authenticated -> Role Resolution -> Open Administration Workspace (/admin)
  const role: UserRole = (user as any)?.role || 'ADMIN';
  const defaultWs = getDefaultWorkspaceForRole(role);

  switch (defaultWs) {
    case 'administration':
      return <Navigate to="/admin" replace />;
    case 'configuration':
      return <Navigate to="/config" replace />;
    case 'operations':
    default:
      return <Navigate to="/ops" replace />;
  }
};
