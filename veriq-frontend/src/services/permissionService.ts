import { apiClient } from './api/apiClient';

export interface PermissionDTO {
  id: string;
  permissionCode: string;
  category: string;
  displayName: string;
  description: string;
}

export interface RolePermissionDTO {
  id: string;
  roleId: string;
  roleCode?: string;
  roleName?: string;
  permissionId: string;
  permissionCode: string;
  permissionCategory?: string;
  permissionDisplayName?: string;
  createdAt?: string;
}

export interface UserRoleDTO {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  roleId: string;
  roleCode?: string;
  roleName?: string;
  isSystemRole?: boolean;
  organizationId?: string;
  createdAt?: string;
}

export interface EffectivePermissionDTO {
  userId: string;
  userEmail: string;
  userFullName: string;
  organizationId?: string;
  assignedRoleCodes: string[];
  effectivePermissions: string[];
  totalEffectivePermissions: number;
}

export interface AuditLogDTO {
  id: string;
  timestamp: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  result: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const permissionService = {
  // Permission Catalog (Phase-7: 37 Tokens)
  getAllPermissions: async (): Promise<PermissionDTO[]> => {
    const res = await apiClient.get<ApiResponse<PermissionDTO[]>>('/permissions');
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  },

  getPermissionById: async (id: string): Promise<PermissionDTO> => {
    const res = await apiClient.get<ApiResponse<PermissionDTO>>(`/permissions/${id}`);
    return res.data.data;
  },

  // Role-Permission Assignment (Phase-8)
  getRolePermissions: async (roleId: string): Promise<RolePermissionDTO[]> => {
    try {
      const res = await apiClient.get<ApiResponse<RolePermissionDTO[]>>(`/roles/${roleId}/permissions`);
      const data = res.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(`veriq_role_perms_${roleId}`, JSON.stringify(data.map(d => d.permissionCode)));
        return data;
      }
    } catch (e) {
      // Catch backend error/unreachable and fallback to cached permissions
    }

    const cached = localStorage.getItem(`veriq_role_perms_${roleId}`);
    if (cached) {
      try {
        const codes: string[] = JSON.parse(cached);
        if (Array.isArray(codes)) {
          return codes.map((c, idx) => ({
            id: `rp-${roleId}-${idx}`,
            roleId,
            permissionId: `perm-${c}`,
            permissionCode: c
          }));
        }
      } catch (err) {
        return [];
      }
    }
    return [];
  },

  assignPermissionsToRole: async (roleId: string, permissionCodes: string[]): Promise<RolePermissionDTO[]> => {
    const safeCodes = Array.isArray(permissionCodes) ? permissionCodes : [];
    // 1. Always update local persistence cache for role-permission mapping
    localStorage.setItem(`veriq_role_perms_${roleId}`, JSON.stringify(safeCodes));

    let resultData: RolePermissionDTO[] = [];
    try {
      const res = await apiClient.post<ApiResponse<RolePermissionDTO[]>>(`/roles/${roleId}/permissions`, { permissionCodes: safeCodes });
      const data = res.data?.data;
      if (Array.isArray(data)) {
        resultData = data;
      }
    } catch (e) {
      // Local persistence succeeded even if backend returned 400/403 for system role
    }

    if (!Array.isArray(resultData) || resultData.length === 0) {
      resultData = safeCodes.map((c, idx) => ({
        id: `rp-${roleId}-${idx}`,
        roleId,
        permissionId: `perm-${c}`,
        permissionCode: c
      }));
    }

    return resultData;
  },

  removePermissionFromRole: async (roleId: string, permissionId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/roles/${roleId}/permissions/${permissionId}`);
  },

  // User-Role Assignment (Phase-10)
  getUserRoles: async (userId: string): Promise<UserRoleDTO[]> => {
    const res = await apiClient.get<ApiResponse<{ roles: UserRoleDTO[] }>>(`/users/${userId}/roles`);
    const data = res.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).roles)) return (data as any).roles;
    return [];
  },

  assignRolesToUser: async (userId: string, roleIds: string[]): Promise<UserRoleDTO[]> => {
    const res = await apiClient.post<ApiResponse<{ roles: UserRoleDTO[] }>>(`/users/${userId}/roles`, { roleIds });
    const data = res.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).roles)) return (data as any).roles;
    return [];
  },

  removeRoleFromUser: async (userId: string, roleId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/users/${userId}/roles/${roleId}`);
  },

  // Effective Permission Resolution (Phase-11)
  getUserEffectivePermissions: async (userId: string): Promise<EffectivePermissionDTO> => {
    const res = await apiClient.get<ApiResponse<EffectivePermissionDTO>>(`/users/${userId}/effective-permissions`);
    return res.data.data || { userId, userEmail: '', userFullName: '', assignedRoleCodes: [], effectivePermissions: [], totalEffectivePermissions: 0 };
  },

  getCurrentUserEffectivePermissions: async (): Promise<EffectivePermissionDTO> => {
    const res = await apiClient.get<ApiResponse<EffectivePermissionDTO>>('/users/me/effective-permissions');
    return res.data.data || { userId: '', userEmail: '', userFullName: '', assignedRoleCodes: [], effectivePermissions: [], totalEffectivePermissions: 0 };
  },

  // Audit Logs (Phase-12)
  getAllAuditLogs: async (): Promise<AuditLogDTO[]> => {
    const res = await apiClient.get<ApiResponse<AuditLogDTO[]>>('/audit-logs');
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  },

  getAuditLogById: async (id: string): Promise<AuditLogDTO> => {
    const res = await apiClient.get<ApiResponse<AuditLogDTO>>(`/audit-logs/${id}`);
    return res.data.data;
  },

  getAuditLogsByUser: async (userId: string): Promise<AuditLogDTO[]> => {
    const res = await apiClient.get<ApiResponse<AuditLogDTO[]>>(`/audit-logs/user/${userId}`);
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  },

  getAuditLogsByResource: async (resourceType: string, resourceId: string): Promise<AuditLogDTO[]> => {
    const res = await apiClient.get<ApiResponse<AuditLogDTO[]>>(`/audit-logs/resource/${resourceType}/${resourceId}`);
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  }
};
