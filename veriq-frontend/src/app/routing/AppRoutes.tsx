import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlatformShell } from '../shell/PlatformShell';
import { ApplicationShell } from '../shell/ApplicationShell';
import { LoginPage } from '../../pages/LoginPage';
import { BootstrapWizardPage } from '../../pages/BootstrapWizardPage';
import { WorkspaceSelectorPage } from '../../pages/WorkspaceSelectorPage';
import { Workspace } from '../workspace/Workspace';
import { RoleRedirector } from './RoleRedirector';
import { AdminOrganizationsPage } from '../../modules/administration/pages/AdminOrganizationsPage';
import { AdminUsersPage } from '../../modules/administration/pages/AdminUsersPage';
import { AdminRolesPage } from '../../modules/administration/pages/AdminRolesPage';
import { AdminPermissionsPage } from '../../modules/administration/pages/AdminPermissionsPage';
import { AdminAuditLogsPage } from '../../modules/administration/pages/AdminAuditLogsPage';
import { AdminSettingsPage } from '../../modules/administration/pages/AdminSettingsPage';
import { DigitalInfrastructureWizard } from '../../modules/configuration/DigitalInfrastructureWizard';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceProvider } from '../workspace/WorkspaceContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Stage-0 Platform Bootstrap Route */}
      <Route path="/bootstrap" element={<BootstrapWizardPage />} />

      {/* Direct Authentication Entry Point */}
      <Route path="/login" element={<LoginPage />} />

      {/* Workspace Selector Screen for Authenticated Users */}
      <Route
        path="/workspace-selector"
        element={
          <ProtectedRoute>
            <WorkspaceSelectorPage />
          </ProtectedRoute>
        }
      />

      {/* Permanent Application Shell Route */}
      <Route
        path="/shell"
        element={
          <ProtectedRoute>
            <ApplicationShell />
          </ProtectedRoute>
        }
      />

      {/* Operations Command Center Workspace (Standalone Single-Navigation Workspace) */}
      <Route
        path="/ops"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ops/*"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />

      {/* Permanent Engineering Workspace Foundation Route */}
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />

      {/* Role-Based Redirector at Root */}
      <Route path="/" element={<RoleRedirector />} />

      {/* Enterprise Platform Shell Workspaces (Administration & Configuration) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WorkspaceProvider>
              <PlatformShell />
            </WorkspaceProvider>
          </ProtectedRoute>
        }
      >
        {/* WORKSPACE-1: ADMINISTRATION */}
        <Route path="admin" element={<Navigate to="/admin/organizations" replace />} />
        <Route path="admin/organizations" element={<AdminOrganizationsPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/roles" element={<AdminRolesPage />} />
        <Route path="admin/permissions" element={<AdminPermissionsPage />} />
        <Route path="admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="admin/settings" element={<AdminSettingsPage />} />

        {/* WORKSPACE-2: PROJECT CONFIGURATION */}
        <Route path="config" element={<Navigate to="/config/wizard" replace />} />
        <Route path="config/wizard" element={<DigitalInfrastructureWizard />} />
      </Route>

      {/* Catch-All Direct Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
