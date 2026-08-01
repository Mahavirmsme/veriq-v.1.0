export type UserRole = 
  | 'ADMIN' 
  | 'CONFIG_ENGINEER' 
  | 'CHIEF_ENGINEER' 
  | 'ASSET_MANAGER' 
  | 'REGIONAL_ENGINEER' 
  | 'FIELD_ENGINEER'
  | 'ROLE_ORG_ADMIN'
  | 'ROLE_DEPT_MANAGER'
  | 'ROLE_ENGINEER'
  | 'ROLE_OPERATOR'
  | 'ROLE_VIEWER'
  | 'ROLE_PLATFORM_ADMIN'
  | 'ROLE_RUNTIME_ENGINEER'
  | 'ROLE_BACKEND_ENGINEER'
  | 'ROLE_SYSTEM_DEVELOPER'
  | string;

export type WorkspaceType = 'portfolio' | 'administration' | 'configuration' | 'operations';

export interface UserSession {
  userId?: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
  allowedWorkspaces?: WorkspaceType[];
}

export const getDefaultWorkspaceForRole = (role: UserRole): WorkspaceType => {
  const norm = String(role || '').toUpperCase().trim();
  if (norm.includes('ADMIN') || norm.includes('ORG_ADMIN') || norm === 'ADMIN') {
    return 'administration';
  }
  if (norm.includes('CONFIG') || norm.includes('SYSTEM_DEVELOPER')) {
    return 'configuration';
  }
  if (norm.includes('CHIEF') || norm.includes('DEPT_MANAGER') || norm.includes('ENGINEER') || norm.includes('OPERATOR') || norm.includes('FIELD')) {
    return 'operations';
  }
  if (norm.includes('VIEWER')) {
    return 'portfolio';
  }
  return 'operations';
};

export const getAllowedWorkspacesForRole = (role: UserRole): WorkspaceType[] => {
  const norm = String(role || '').toUpperCase().trim();
  
  // Organization Admin / Platform Admin -> Access to All Workspaces
  if (norm.includes('ADMIN') || norm === 'ROLE_ORG_ADMIN') {
    return ['portfolio', 'administration', 'configuration', 'operations'];
  }

  // Field Engineer -> Access to Operations Command Center ONLY
  if (norm.includes('FIELD') || norm === 'FIELD_ENGINEER') {
    return ['operations'];
  }

  // Configuration Engineer -> Access to Project Configuration ONLY
  if (norm === 'CONFIG_ENGINEER' || norm === 'ROLE_CONFIG_ENGINEER') {
    return ['configuration'];
  }
  
  // Chief Engineer / Dept Manager / Lead Engineer -> Access to Portfolio, Configuration & Operations (No Admin)
  if (norm.includes('CHIEF') || norm.includes('DEPT_MANAGER') || norm === 'ROLE_ENGINEER') {
    return ['portfolio', 'configuration', 'operations'];
  }

  // Regional Engineer / System Operator -> Access to Portfolio & Operations
  if (norm.includes('REGIONAL') || norm.includes('OPERATOR') || norm === 'ROLE_OPERATOR') {
    return ['portfolio', 'operations'];
  }

  // Read-Only Viewer -> Portfolio Center Only
  if (norm.includes('VIEWER') || norm === 'ROLE_VIEWER') {
    return ['portfolio'];
  }

  // Default Fallback
  return ['portfolio', 'operations'];
};

export const isRouteAuthorizedForRole = (userOrRole: any, path: string): boolean => {
  let allowed: WorkspaceType[] = [];

  if (userOrRole && typeof userOrRole === 'object') {
    if (Array.isArray(userOrRole.allowedWorkspaces) && userOrRole.allowedWorkspaces.length > 0) {
      allowed = userOrRole.allowedWorkspaces;
    } else {
      const roleStr = userOrRole.role || (userOrRole.roles && userOrRole.roles[0]) || 'ROLE_ORG_ADMIN';
      allowed = getAllowedWorkspacesForRole(roleStr);
    }
  } else {
    allowed = getAllowedWorkspacesForRole(userOrRole || 'ROLE_ORG_ADMIN');
  }

  if (path.startsWith('/admin')) {
    return allowed.includes('administration');
  }
  if (path.startsWith('/config')) {
    return allowed.includes('configuration');
  }
  if (path.startsWith('/ops')) {
    return allowed.includes('operations');
  }
  if (path.startsWith('/portfolio')) {
    return allowed.includes('portfolio');
  }
  return true;
};

/**
 * RBAC Helper: Determines if authenticated user role possesses internal developer / engineering permissions.
 */
export const hasDeveloperPermission = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  const normalized = role.toUpperCase().trim();
  return (
    normalized === 'ADMIN' ||
    normalized === 'CONFIG_ENGINEER' ||
    normalized === 'ROLE_PLATFORM_ADMIN' ||
    normalized === 'ROLE_RUNTIME_ENGINEER' ||
    normalized === 'ROLE_BACKEND_ENGINEER' ||
    normalized === 'ROLE_SYSTEM_DEVELOPER' ||
    normalized === 'ROLE_ORG_ADMIN' ||
    normalized === 'CHIEF_ENGINEER' ||
    normalized === 'PLATFORM_ADMIN'
  );
};
