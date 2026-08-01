import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { PlatformShell } from '../shell/PlatformShell';
import { ApplicationShell } from '../shell/ApplicationShell';
import { LoginPage } from '../../pages/LoginPage';
import { BootstrapWizardPage } from '../../pages/BootstrapWizardPage';
import { WorkspaceSelectorPage } from '../../pages/WorkspaceSelectorPage';
import { Workspace } from '../workspace/Workspace';
import { EngineeringContextProvider } from '../workspace/context/EngineeringContextProvider';
import { RoleRedirector } from './RoleRedirector';
import { AdminOrganizationsPage } from '../../modules/administration/pages/AdminOrganizationsPage';
import { AdminDepartmentsPage } from '../../modules/administration/pages/AdminDepartmentsPage';
import { AdminDesignationsPage } from '../../modules/administration/pages/AdminDesignationsPage';
import { AdminUsersPage } from '../../modules/administration/pages/AdminUsersPage';
import { AdminRolesPage } from '../../modules/administration/pages/AdminRolesPage';
import { AdminPermissionsPage } from '../../modules/administration/pages/AdminPermissionsPage';
import { AdminAuditLogsPage } from '../../modules/administration/pages/AdminAuditLogsPage';
import { AdminSettingsPage } from '../../modules/administration/pages/AdminSettingsPage';
import { EnterpriseInfrastructureOverviewPage } from '../../modules/infrastructure/pages/EnterpriseInfrastructureOverviewPage';
import { OperationsNodeExplorerPage } from '../../modules/operations/pages/OperationsNodeExplorerPage';
import { DigitalInfrastructureWizard } from '../../modules/configuration/DigitalInfrastructureWizard';
import { ProjectPage } from '../../pages/ProjectPage';
import { AssetPage } from '../../pages/AssetPage';
import { RegionWorkspacePage } from '../../pages/RegionWorkspacePage';
import { DeploymentZoneWorkspacePage } from '../../pages/DeploymentZoneWorkspacePage';
import { EngineeringNodeWorkspacePage } from '../../pages/EngineeringNodeWorkspacePage';
import { SensorPackageWorkspacePage } from '../../pages/SensorPackageWorkspacePage';
import { CommissioningWorkspacePage } from '../../pages/CommissioningWorkspacePage';
import { EngineeringReleaseReviewPage } from '../../pages/EngineeringReleaseReviewPage';
import { RuntimeSensorRegistryPage } from '../../pages/RuntimeSensorRegistryPage';
import { RuntimeServiceManagerPage } from '../../pages/RuntimeServiceManagerPage';
import { CommandCenterPage } from '../../pages/CommandCenterPage';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceProvider } from '../workspace/WorkspaceContext';
import { hasDeveloperPermission, isRouteAuthorizedForRole } from '../authentication/RoleResolver';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RoleProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user as any)?.role || (user?.roles && user.roles[0]) || 'ROLE_ORG_ADMIN';

  if (!isRouteAuthorizedForRole(user, location.pathname)) {
    return (
      <div style={{
        padding: '60px 40px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        background: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: '8px',
        margin: '40px auto',
        maxWidth: '560px',
        color: '#991B1B'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 8px' }}>
          403 - Access Denied: Route Protection Active
        </h2>
        <p style={{ fontSize: '13px', color: '#7F1D1D', margin: '0 0 16px' }}>
          Your assigned primary role <strong>({userRole})</strong> does not possess authorization for target path: <code>{location.pathname}</code>.
        </p>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#B91C1C', background: '#FEE2E2', padding: '6px 12px', borderRadius: '4px', border: '1px solid #F87171' }}>
          RBAC Protection Chain Enforced • Access Denied
        </span>
      </div>
    );
  }

  return <>{children}</>;
};

export const DeveloperRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const userRole = (user as any)?.role || (user?.roles && user.roles[0]);
  if (!hasDeveloperPermission(userRole)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h2 style={{ color: '#B91C1C', fontSize: '20px', fontWeight: 800 }}>403 - Access Forbidden</h2>
        <p style={{ color: '#64748B', fontSize: '13px' }}>
          You do not have developer or engineering permissions to access internal diagnostic tools.
        </p>
      </div>
    );
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

      {/* Standalone Single-Viewport Workspace Foundation Route */}
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />

      {/* Direct Lifecycle Component Access Route Redirects */}
      <Route path="/organization" element={<Navigate to="/admin/organizations" replace />} />
      <Route path="/project" element={<Navigate to="/config/projects" replace />} />
      <Route path="/asset" element={<Navigate to="/config/assets" replace />} />
      <Route path="/region" element={<Navigate to="/config/regions" replace />} />
      <Route path="/deployment-zone" element={<Navigate to="/config/deployment-zones" replace />} />
      <Route path="/node" element={<Navigate to="/config/nodes" replace />} />
      <Route path="/sensor-package" element={<Navigate to="/config/sensors" replace />} />
      <Route path="/commissioning" element={<Navigate to="/config/commissioning" replace />} />
      <Route path="/dashboard" element={<Navigate to="/ops/dashboard" replace />} />
      <Route path="/command-center" element={<Navigate to="/ops/dashboard" replace />} />
      <Route path="/runtime-sensors" element={<Navigate to="/ops/runtime-sensors" replace />} />
      <Route path="/runtime-services" element={<Navigate to="/ops/runtime-services" replace />} />

      {/* Role-Based Redirector at Root */}
      <Route path="/" element={<RoleRedirector />} />

      {/* Enterprise Platform Shell Workspaces */}
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
        {/* WORKSPACE-0: PORTFOLIO CENTER (Executive Portfolio Landing Page) */}
        <Route path="portfolio" element={<RoleProtectedRoute><EnterpriseInfrastructureOverviewPage /></RoleProtectedRoute>} />

        {/* WORKSPACE-1: ADMINISTRATION (Default Module: Organizations) */}
        <Route path="admin" element={<Navigate to="/admin/organizations" replace />} />
        <Route path="admin/organizations" element={<RoleProtectedRoute><AdminOrganizationsPage /></RoleProtectedRoute>} />
        <Route path="admin/departments" element={<RoleProtectedRoute><AdminDepartmentsPage /></RoleProtectedRoute>} />
        <Route path="admin/designations" element={<RoleProtectedRoute><AdminDesignationsPage /></RoleProtectedRoute>} />
        <Route path="admin/users" element={<RoleProtectedRoute><AdminUsersPage /></RoleProtectedRoute>} />
        <Route path="admin/roles" element={<RoleProtectedRoute><AdminRolesPage /></RoleProtectedRoute>} />
        <Route path="admin/permissions" element={<RoleProtectedRoute><AdminPermissionsPage /></RoleProtectedRoute>} />
        <Route path="admin/audit-logs" element={<RoleProtectedRoute><AdminAuditLogsPage /></RoleProtectedRoute>} />
        <Route path="admin/settings" element={<RoleProtectedRoute><AdminSettingsPage /></RoleProtectedRoute>} />

        {/* WORKSPACE-2: PROJECT CONFIGURATION LIFECYCLE */}
        <Route path="config" element={<Navigate to="/config/projects" replace />} />
        <Route path="config/projects" element={<RoleProtectedRoute><ProjectPage /></RoleProtectedRoute>} />
        <Route path="config/assets" element={<RoleProtectedRoute><AssetPage /></RoleProtectedRoute>} />
        <Route path="config/regions" element={<RoleProtectedRoute><RegionWorkspacePage /></RoleProtectedRoute>} />
        <Route path="config/deployment-zones" element={<RoleProtectedRoute><DeploymentZoneWorkspacePage /></RoleProtectedRoute>} />
        <Route path="config/nodes" element={<RoleProtectedRoute><EngineeringNodeWorkspacePage /></RoleProtectedRoute>} />
        <Route path="config/sensors" element={<RoleProtectedRoute><SensorPackageWorkspacePage /></RoleProtectedRoute>} />
        <Route path="config/commissioning" element={<RoleProtectedRoute><CommissioningWorkspacePage /></RoleProtectedRoute>} />
        <Route path="config/release-review" element={<RoleProtectedRoute><EngineeringReleaseReviewPage /></RoleProtectedRoute>} />
        <Route path="config/wizard" element={<RoleProtectedRoute><DigitalInfrastructureWizard /></RoleProtectedRoute>} />

        {/* WORKSPACE-3: OPERATIONS COMMAND CENTER HIERARCHY (UNIFIED ENGINEERING CONTEXT BOUNDARY) */}
        <Route path="ops" element={<EngineeringContextProvider><Outlet /></EngineeringContextProvider>}>
          <Route index element={<Navigate to="/ops/dashboard" replace />} />
          <Route path="dashboard" element={<RoleProtectedRoute><Workspace /></RoleProtectedRoute>} />
          <Route path="assets" element={<RoleProtectedRoute><CommandCenterPage /></RoleProtectedRoute>} />
          <Route path="assets/:assetId" element={<RoleProtectedRoute><CommandCenterPage /></RoleProtectedRoute>} />
          <Route path="assets/:assetId/zones" element={<RoleProtectedRoute><CommandCenterPage /></RoleProtectedRoute>} />
          <Route path="nodes" element={<RoleProtectedRoute><OperationsNodeExplorerPage /></RoleProtectedRoute>} />
          <Route path="runtime-sensors" element={<RoleProtectedRoute><RuntimeSensorRegistryPage /></RoleProtectedRoute>} />
          <Route path="runtime-services" element={<RoleProtectedRoute><RuntimeServiceManagerPage /></RoleProtectedRoute>} />
          <Route path="command-center" element={<Navigate to="/ops/dashboard" replace />} />
        </Route>
        <Route path="operations" element={<Navigate to="/ops/dashboard" replace />} />
        <Route path="configuration" element={<Navigate to="/config/projects" replace />} />
      </Route>

      {/* Catch-All Direct Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
