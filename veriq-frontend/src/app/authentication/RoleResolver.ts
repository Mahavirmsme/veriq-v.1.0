export type UserRole = 
  | 'ADMIN' 
  | 'CONFIG_ENGINEER' 
  | 'CHIEF_ENGINEER' 
  | 'ASSET_MANAGER' 
  | 'REGIONAL_ENGINEER' 
  | 'FIELD_ENGINEER';

export type WorkspaceType = 'administration' | 'configuration' | 'operations';

export interface UserSession {
  username: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
}

export const getDefaultWorkspaceForRole = (role: UserRole): WorkspaceType => {
  switch (role) {
    case 'ADMIN':
      return 'administration';
    case 'CONFIG_ENGINEER':
      return 'configuration';
    case 'CHIEF_ENGINEER':
    case 'ASSET_MANAGER':
    case 'REGIONAL_ENGINEER':
    case 'FIELD_ENGINEER':
    default:
      return 'operations';
  }
};
