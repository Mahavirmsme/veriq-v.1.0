import React, { useEffect, useState, useMemo } from 'react';
import { roleService, RoleDTO } from '../../../services/roleService';
import { permissionService, RolePermissionDTO, UserRoleDTO } from '../../../services/permissionService';
import { userService, UserDTO } from '../../../services/userService';
import { 
  WORKSPACE_PERMISSIONS, 
  resolveInternalTokensFromBusinessActions, 
  resolveBusinessActionsFromInternalTokens 
} from '../services/workspacePermissionMapper';

// Recognized Predefined System Role Codes (Protected Metadata Architecture)
const PREDEFINED_SYSTEM_ROLE_CODES = new Set([
  'ROLE_ORG_ADMIN',
  'ADMIN',
  'ROLE_DEPT_MANAGER',
  'ROLE_ENGINEER',
  'CHIEF_ENGINEER',
  'REGIONAL_ENGINEER',
  'FIELD_ENGINEER',
  'ASSET_MANAGER',
  'CONFIG_ENGINEER',
  'ROLE_SYSTEM_DEVELOPER',
  'ROLE_OPERATOR',
  'ROLE_VIEWER'
]);

// Helper to determine if a role is a predefined System Role
const checkIsSystemRole = (r: RoleDTO | null | undefined): boolean => {
  if (!r) return false;
  if (r.isSystemRole === true) return true;
  const code = (r.roleCode || '').toUpperCase().trim();
  return PREDEFINED_SYSTEM_ROLE_CODES.has(code);
};

// Standard Predefined System Roles Registry
const DEFAULT_SYSTEM_ROLES: RoleDTO[] = [
  { id: 'role-org-admin', roleCode: 'ROLE_ORG_ADMIN', roleName: 'Organization Administrator', description: 'Full Org Admin Rights', isSystemRole: true },
  { id: 'role-dept-manager', roleCode: 'ROLE_DEPT_MANAGER', roleName: 'Department Manager', description: 'Department Level Admin', isSystemRole: true },
  { id: 'role-chief-engineer', roleCode: 'CHIEF_ENGINEER', roleName: 'Chief Engineer', description: 'Chief Infrastructure Operations', isSystemRole: true },
  { id: 'role-regional-engineer', roleCode: 'REGIONAL_ENGINEER', roleName: 'Regional Engineer', description: 'Regional Infrastructure Operations', isSystemRole: true },
  { id: 'role-field-engineer', roleCode: 'FIELD_ENGINEER', roleName: 'Field Engineer', description: 'Field Diagnostics & Telemetry', isSystemRole: true },
  { id: 'role-asset-manager', roleCode: 'ASSET_MANAGER', roleName: 'Asset Manager', description: 'Corridor & Asset Lifecycle Management', isSystemRole: true },
  { id: 'role-config-engineer', roleCode: 'CONFIG_ENGINEER', roleName: 'Configuration Engineer', description: 'Digital Infrastructure Modeling', isSystemRole: true },
  { id: 'role-operator', roleCode: 'ROLE_OPERATOR', roleName: 'System Operator', description: 'Runtime Operations & Telemetry', isSystemRole: true },
  { id: 'role-viewer', roleCode: 'ROLE_VIEWER', roleName: 'Read-Only Viewer', description: 'Directory & Dashboard Viewer', isSystemRole: true }
];

export const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [userRoleMap, setUserRoleMap] = useState<{ [userId: string]: UserRoleDTO[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Role Creation Form State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRoleCode, setNewRoleCode] = useState<string>('');
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [assignInitialUserId, setAssignInitialUserId] = useState<string>('');

  // Selected Role & Business Action Matrix Workspace State
  const [selectedRole, setSelectedRole] = useState<RoleDTO | null>(null);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [permLoading, setPermLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // User Assignment Modal State
  const [userAssignRole, setUserAssignRole] = useState<RoleDTO | null>(null);
  const [userAssignSearch, setUserAssignSearch] = useState<string>('');

  useEffect(() => {
    fetchRolesPermissionsAndUsers();
  }, []);

  const fetchRolesPermissionsAndUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, usersData] = await Promise.all([
        roleService.getAllRoles().catch(() => []),
        userService.getAllUsers().catch(() => [])
      ]);

      const safeRoles = Array.isArray(rolesData) ? rolesData : [];
      const safeUsers = Array.isArray(usersData) ? usersData : [];

      // Merge backend roles with system roles ensuring correct system role flag
      const mergedRolesMap = new Map<string, RoleDTO>();

      // 1. Add Default Predefined System Roles first
      DEFAULT_SYSTEM_ROLES.forEach(sysR => {
        mergedRolesMap.set(sysR.roleCode.toUpperCase(), { ...sysR, isSystemRole: true });
      });

      // 2. Merge Backend Roles
      safeRoles.forEach(r => {
        const codeUpper = (r.roleCode || '').toUpperCase().trim();
        const sysFlag = checkIsSystemRole(r);
        mergedRolesMap.set(codeUpper, {
          ...r,
          isSystemRole: sysFlag
        });
      });

      const mergedRoles = Array.from(mergedRolesMap.values());

      setRoles(mergedRoles);
      setUsers(safeUsers);

      // Select first role by default if none selected
      if (mergedRoles.length > 0 && !selectedRole) {
        handleSelectRole(mergedRoles[0]);
      }

      // Load user role assignments using existing User-Role mapping service
      const urMap: { [userId: string]: UserRoleDTO[] } = {};
      if (safeUsers.length > 0) {
        await Promise.all(safeUsers.map(async (u) => {
          try {
            const uRoles = await permissionService.getUserRoles(u.id);
            urMap[u.id] = Array.isArray(uRoles) ? uRoles : [];
          } catch (e) {
            urMap[u.id] = [];
          }
        }));
      }
      setUserRoleMap(urMap);

    } catch (err: any) {
      setError(err?.message || 'Failed to load roles or users');
    } finally {
      setLoading(false);
    }
  };

  // Split Roles into System Roles vs Custom Roles
  const systemRolesList = useMemo(() => {
    return (Array.isArray(roles) ? roles : []).filter(r => checkIsSystemRole(r));
  }, [roles]);

  const customRolesList = useMemo(() => {
    return (Array.isArray(roles) ? roles : []).filter(r => !checkIsSystemRole(r));
  }, [roles]);

  // Select Role & Load Assigned Business Actions via Role Mapping Engine
  const handleSelectRole = async (role: RoleDTO) => {
    setSelectedRole(role);
    setPermLoading(true);
    setError(null);
    try {
      const rolePerms = await permissionService.getRolePermissions(role.id).catch(() => []);
      const safeRolePerms = Array.isArray(rolePerms) ? rolePerms : [];
      const internalTokens = safeRolePerms.map((rp: RolePermissionDTO) => rp.permissionCode);
      
      // Role Mapping Engine: Resolve Internal Permission Tokens -> Human-Readable Business Actions
      const businessActions = resolveBusinessActionsFromInternalTokens(internalTokens);
      setSelectedActionIds(businessActions);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch workspace permissions for selected role');
    } finally {
      setPermLoading(false);
    }
  };

  // Toggle individual business action checkbox
  const handleToggleBusinessAction = (actionId: string) => {
    setSelectedActionIds(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(actionId) ? safePrev.filter(a => a !== actionId) : [...safePrev, actionId];
    });
  };

  // Workspace Level Select All / Deselect All Toggle
  const handleToggleWorkspaceGroup = (groupId: string) => {
    const group = WORKSPACE_PERMISSIONS.find(g => g.id === groupId);
    if (!group) return;

    const groupActionIds = group.actions.map(a => a.id);
    const safeSelected = Array.isArray(selectedActionIds) ? selectedActionIds : [];
    const allSelected = groupActionIds.every(id => safeSelected.includes(id));

    if (allSelected) {
      setSelectedActionIds(prev => (Array.isArray(prev) ? prev : []).filter(id => !groupActionIds.includes(id)));
    } else {
      setSelectedActionIds(prev => Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...groupActionIds])));
    }
  };

  // Save Role Permissions Matrix Persistence (Role Mapping Engine -> Internal Tokens)
  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setSaveLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // Role Mapping Engine: Resolve Human-Readable Business Actions -> System Internal Permission Tokens
      const resolvedTokens = resolveInternalTokensFromBusinessActions(selectedActionIds);
      await permissionService.assignPermissionsToRole(selectedRole.id, resolvedTokens);
      setSuccessMsg(`Workspace Permission Matrix updated successfully for role ${selectedRole.roleName}`);
      fetchRolesPermissionsAndUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to save workspace permission matrix');
    } finally {
      setSaveLoading(false);
    }
  };

  // Compute assigned users for each role
  const getAssignedUsersForRole = (role: RoleDTO): UserDTO[] => {
    const targetCode = (role.roleCode || '').toUpperCase();
    const targetId = (role.id || '').toLowerCase();
    const targetName = (role.roleName || '').toLowerCase();
    const safeUsers = Array.isArray(users) ? users : [];

    return safeUsers.filter(u => {
      const userRoles = Array.isArray(userRoleMap[u.id]) ? userRoleMap[u.id] : [];
      const hasDirectRole = userRoles.some(ur => {
        const urCode = (ur.roleCode || '').toUpperCase();
        const urId = (ur.roleId || '').toLowerCase();
        const urName = (ur.roleName || '').toLowerCase();
        return (targetCode && urCode === targetCode) || 
               (targetId && urId === targetId) || 
               (targetName && urName === targetName);
      });

      const userDefault = (u.defaultRole || '').toUpperCase();
      const hasDefaultRole = targetCode && userDefault === targetCode;

      const hasAssignedRoleList = Array.isArray(u.assignedRoles) && u.assignedRoles.some(ar => {
        const arUpper = (ar || '').toUpperCase();
        return targetCode && arUpper === targetCode;
      });

      return hasDirectRole || hasDefaultRole || hasAssignedRoleList;
    });
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const createdRole = await roleService.createRole({
        roleCode: newRoleCode.toUpperCase(),
        roleName: newRoleName,
        description: newDescription
      });

      if (assignInitialUserId && createdRole) {
        const roleIdent = createdRole.roleCode || createdRole.id;
        await permissionService.assignRolesToUser(assignInitialUserId, [roleIdent]).catch(() => null);
      }

      setSuccessMsg(`Custom role ${newRoleName} created successfully`);
      setShowCreateModal(false);
      setNewRoleCode('');
      setNewRoleName('');
      setNewDescription('');
      setAssignInitialUserId('');
      fetchRolesPermissionsAndUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to create custom role');
    }
  };

  const handleAssignUserToRole = async (userId: string, role: RoleDTO) => {
    setError(null);
    try {
      const roleIdent = role.roleCode || role.id;
      await permissionService.assignRolesToUser(userId, [roleIdent]);
      setSuccessMsg(`User assigned to ${role.roleName} successfully`);
      fetchRolesPermissionsAndUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to assign user to role');
    }
  };

  const handleRemoveUserFromRole = async (userId: string, role: RoleDTO) => {
    setError(null);
    try {
      const roleIdent = role.roleCode || role.id;
      await permissionService.removeRoleFromUser(userId, roleIdent);
      setSuccessMsg(`User removed from ${role.roleName} successfully`);
      fetchRolesPermissionsAndUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to remove user from role');
    }
  };

  const handleDeleteRole = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete custom role ${code}?`)) return;
    setError(null);
    try {
      await roleService.deleteRole(id);
      setSuccessMsg(`Custom role ${code} deleted successfully`);
      fetchRolesPermissionsAndUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete role');
    }
  };

  const isSelectedRoleSystem = checkIsSystemRole(selectedRole);
  const selectedRoleAssignedUsers = selectedRole ? getAssignedUsersForRole(selectedRole) : [];

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Role & Workspace Permission Matrix
            </h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
              Manage business workspace permissions using engineering language and domain capabilities
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + Create Custom Role
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div style={{ padding: '12px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}
        {error && (
          <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
            Loading roles directory and workspace permission matrix...
          </div>
        )}

        {/* ================= TWO-COLUMN WORKSPACE (ROLES DIRECTORY & WORKSPACE PERMISSION MATRIX) ================= */}
        {!loading && (Array.isArray(roles) ? roles : []).length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: SEPARATE SYSTEM ROLES VS CUSTOM ROLES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* SECTION 1: SYSTEM ROLES (PROTECTED METADATA) */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>SYSTEM ROLES ({systemRolesList.length})</span>
                  <span style={{ fontSize: '9px', background: '#F3E8FF', color: '#6B21A8', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>PROTECTED METADATA</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflowY: 'auto' }}>
                  {systemRolesList.map(r => {
                    const isSelected = selectedRole?.id === r.id || selectedRole?.roleCode === r.roleCode;
                    const assignedUsers = getAssignedUsersForRole(r);

                    return (
                      <div
                        key={r.id || r.roleCode}
                        onClick={() => handleSelectRole(r)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          background: isSelected ? '#EFF6FF' : '#FFFFFF',
                          border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          transition: 'all 100ms ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: isSelected ? '#1E40AF' : '#2563EB', fontSize: '12px' }}>
                            {r.roleCode}
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 800,
                            background: '#F3E8FF',
                            color: '#6B21A8'
                          }}>
                            SYSTEM
                          </span>
                        </div>

                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px' }}>
                          {r.roleName}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#64748B' }}>
                          <span>Assigned Users: <strong>{assignedUsers.length}</strong></span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setUserAssignRole(r); }}
                            style={{ padding: '2px 6px', fontSize: '10px', fontWeight: 700, color: '#1D4ED8', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Users
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: CUSTOM ROLES (FULL EDITABLE ROLES) */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>CUSTOM ROLES ({customRolesList.length})</span>
                  <span style={{ fontSize: '9px', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>EDITABLE</span>
                </div>

                {customRolesList.length === 0 ? (
                  <div style={{ padding: '12px', fontSize: '11px', color: '#94A3B8', textAlign: 'center', fontStyle: 'italic' }}>
                    No custom roles created. Click "+ Create Custom Role" to define one.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                    {customRolesList.map(r => {
                      const isSelected = selectedRole?.id === r.id || selectedRole?.roleCode === r.roleCode;
                      const assignedUsers = getAssignedUsersForRole(r);

                      return (
                        <div
                          key={r.id || r.roleCode}
                          onClick={() => handleSelectRole(r)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '6px',
                            background: isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                            transition: 'all 100ms ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: isSelected ? '#1E40AF' : '#2563EB', fontSize: '12px' }}>
                              {r.roleCode}
                            </span>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 800,
                              background: '#E0F2FE',
                              color: '#0369A1'
                            }}>
                              CUSTOM
                            </span>
                          </div>

                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px' }}>
                            {r.roleName}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#64748B' }}>
                            <span>Assigned Users: <strong>{assignedUsers.length}</strong></span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setUserAssignRole(r); }}
                                style={{ padding: '2px 6px', fontSize: '10px', fontWeight: 700, color: '#1D4ED8', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Users
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteRole(r.id, r.roleCode); }}
                                style={{ padding: '2px 6px', fontSize: '10px', fontWeight: 700, color: '#991B1B', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: ROLE DETAILS WORKSPACE & WORKSPACE PERMISSION MATRIX */}
            {selectedRole ? (
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' }}>
                
                {/* SYSTEM ROLE INFORMATIONAL BANNER */}
                {isSelectedRoleSystem && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '6px',
                    color: '#1E40AF',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>ℹ️ System Role Metadata (Name, Code) is Protected. Workspace Permission Matrix is fully editable below.</span>
                    <span style={{ fontSize: '10px', background: '#DBEAFE', padding: '2px 8px', borderRadius: '4px', border: '1px solid #93C5FD' }}>
                      PROTECTED TEMPLATE
                    </span>
                  </div>
                )}

                {/* ROLE DETAILS HEADER & METADATA */}
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ROLE DETAILS WORKSPACE
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        background: isSelectedRoleSystem ? '#F3E8FF' : '#E0F2FE',
                        color: isSelectedRoleSystem ? '#6B21A8' : '#0369A1'
                      }}>
                        {isSelectedRoleSystem ? 'SYSTEM ROLE (PROTECTED METADATA)' : 'CUSTOM ROLE (FULLY EDITABLE)'}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
                      {selectedRole.roleName} ({selectedRole.roleCode})
                    </h2>
                    
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px' }}>
                      {selectedRole.description || 'No role description provided.'}
                    </p>

                    <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700 }}>
                      Assigned Users ({selectedRoleAssignedUsers.length}): {' '}
                      <span style={{ fontWeight: 500, color: '#64748B' }}>
                        {selectedRoleAssignedUsers.length === 0 
                          ? 'No users currently assigned' 
                          : selectedRoleAssignedUsers.map(u => `${u.firstName} ${u.lastName || ''}`).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectRole(selectedRole)}
                      style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saveLoading}
                      onClick={handleSaveRolePermissions}
                      style={{ padding: '7px 18px', fontSize: '12px', fontWeight: 800, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: saveLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {saveLoading ? 'Saving Matrix...' : 'Save Role Permissions'}
                    </button>
                  </div>
                </div>

                {/* ================= RULE-3 & RULE-4: WORKSPACE PERMISSION MATRIX (HUMAN READABLE BUSINESS ACTIONS) ================= */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Workspace Permission Matrix ({selectedActionIds.length} Business Actions Granted)
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
                      Human-Readable Business Capabilities • System Tokens Hidden
                    </span>
                  </div>

                  {permLoading ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                      Loading workspace permission matrix for {selectedRole.roleName}...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '540px', overflowY: 'auto', paddingRight: '6px' }}>
                      {WORKSPACE_PERMISSIONS.map(group => {
                        const groupActionIds = group.actions.map(a => a.id);
                        const safeSelected = Array.isArray(selectedActionIds) ? selectedActionIds : [];
                        const selectedInGroup = groupActionIds.filter(id => safeSelected.includes(id)).length;
                        const allGroupSelected = selectedInGroup === groupActionIds.length && groupActionIds.length > 0;

                        return (
                          <div key={group.id} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '14px' }}>
                            
                            {/* WORKSPACE GROUP HEADER */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>
                                    {group.title}
                                  </span>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: selectedInGroup > 0 ? '#2563EB' : '#64748B', background: selectedInGroup > 0 ? '#EFF6FF' : '#E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
                                    {selectedInGroup} / {groupActionIds.length} Actions
                                  </span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                                  {group.description}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleWorkspaceGroup(group.id)}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: allGroupSelected ? '#DC2626' : '#2563EB',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                {allGroupSelected ? 'Deselect Workspace' : 'Select Workspace All'}
                              </button>
                            </div>

                            {/* BUSINESS ACTIONS CHECKBOX MATRIX */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                              {group.actions.map(act => {
                                const isChecked = safeSelected.includes(act.id);

                                return (
                                  <label
                                    key={act.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '8px',
                                      padding: '8px 10px',
                                      background: isChecked ? '#EFF6FF' : '#FFFFFF',
                                      border: isChecked ? '1px solid #93C5FD' : '1px solid #CBD5E1',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      transition: 'all 100ms ease'
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleBusinessAction(act.id)}
                                      style={{ marginTop: '2px', cursor: 'pointer' }}
                                    />
                                    <div>
                                      <div style={{ fontSize: '12px', fontWeight: 800, color: isChecked ? '#1E40AF' : '#0F172A' }}>
                                        {act.name}
                                      </div>
                                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', lineHeight: 1.2 }}>
                                        {act.description}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectRole(selectedRole)}
                      style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Cancel Changes
                    </button>
                    <button
                      type="button"
                      disabled={saveLoading}
                      onClick={handleSaveRolePermissions}
                      style={{ padding: '8px 20px', fontSize: '12px', fontWeight: 800, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: saveLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {saveLoading ? 'Saving Matrix...' : 'Save Role Permissions'}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px' }}>
                Select a role from the left directory to configure its workspace permission matrix.
              </div>
            )}

          </div>
        )}
      </div>

      {/* CREATE ROLE MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '420px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800 }}>Create New Custom Role</h3>
            <form onSubmit={handleCreateRole}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Role Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROLE_ANALYST"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Analyst"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea
                  placeholder="Role responsibilities description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '13px', height: '50px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assign User (Optional)</label>
                <select
                  value={assignInitialUserId}
                  onChange={(e) => setAssignInitialUserId(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="">-- None (Unassigned) --</option>
                  {(Array.isArray(users) ? users : []).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName || ''} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '8px 14px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>Create Custom Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN USER & REMOVE USER MODAL */}
      {userAssignRole && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '560px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Manage Users for Role: <span style={{ color: '#1E40AF' }}>{userAssignRole.roleName} ({userAssignRole.roleCode})</span>
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>User assignments use existing User–Role mappings</span>
              </div>
              <button onClick={() => setUserAssignRole(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            {/* Currently Assigned Users */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Currently Assigned Users ({getAssignedUsersForRole(userAssignRole).length})
              </h4>
              {getAssignedUsersForRole(userAssignRole).length === 0 ? (
                <div style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  No users currently assigned to this role.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {getAssignedUsersForRole(userAssignRole).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF' }}>{u.firstName} {u.lastName || ''}</div>
                        <div style={{ fontSize: '11px', color: '#475569' }}>{u.email}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveUserFromRole(u.id, userAssignRole)}
                        style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Remove User
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assign New Users Section */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Assign Available Users
              </h4>
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userAssignSearch}
                onChange={(e) => setUserAssignSearch(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {(Array.isArray(users) ? users : [])
                  .filter(u => {
                    const assigned = getAssignedUsersForRole(userAssignRole).some(au => au.id === u.id);
                    if (assigned) return false;
                    const nameMatch = `${u.firstName} ${u.lastName || ''}`.toLowerCase().includes(userAssignSearch.toLowerCase());
                    const emailMatch = u.email.toLowerCase().includes(userAssignSearch.toLowerCase());
                    return nameMatch || emailMatch;
                  })
                  .map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{u.firstName} {u.lastName || ''}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{u.email}</div>
                      </div>
                      <button
                        onClick={() => handleAssignUserToRole(u.id, userAssignRole)}
                        style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700, background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Assign User
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button onClick={() => setUserAssignRole(null)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminRolesPage;
