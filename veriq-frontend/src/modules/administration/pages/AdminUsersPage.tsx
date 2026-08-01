import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, RefreshCw, 
  ChevronLeft, ChevronRight, UserPlus
} from 'lucide-react';
import { userService, UserDTO, CreateUserPayloadDTO } from '../../../services/userService';
import { roleService, RoleDTO } from '../../../services/roleService';
import { departmentService, DepartmentDTO } from '../../../services/departmentService';
import { designationService, DesignationDTO } from '../../../services/designationService';
import { permissionService, EffectivePermissionDTO, UserRoleDTO } from '../../../services/permissionService';

// Standard System Roles Registry
const DEFAULT_SYSTEM_ROLES: RoleDTO[] = [
  { id: 'role-org-admin', roleCode: 'ROLE_ORG_ADMIN', roleName: 'Organization Administrator', description: 'Full Org Admin Rights', isSystemRole: true },
  { id: 'role-dept-manager', roleCode: 'ROLE_DEPT_MANAGER', roleName: 'Department Manager', description: 'Department Level Admin', isSystemRole: true },
  { id: 'role-engineer', roleCode: 'ROLE_ENGINEER', roleName: 'Lead Engineer', description: 'Engineering Node Operations', isSystemRole: true },
  { id: 'role-operator', roleCode: 'ROLE_OPERATOR', roleName: 'System Operator', description: 'Runtime Operations & Telemetry', isSystemRole: true },
  { id: 'role-viewer', roleCode: 'ROLE_VIEWER', roleName: 'Read-Only Viewer', description: 'Directory & Dashboard Viewer', isSystemRole: true }
];

interface MasterOption {
  id: string;
  name: string;
  code?: string;
}

// Searchable Master Data Select Component (With Navigation Action for Empty Master Datasets)
const SearchableMasterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: MasterOption[];
  placeholder: string;
  emptyMessage: string;
  createAction?: { label: string; onClick: () => void };
}> = ({ label, value, onChange, options, placeholder, emptyMessage, createAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(() => options.find(o => o.id === value), [options, value]);

  const filteredOptions = useMemo(() => {
    return options.filter(o => 
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.code && o.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{label}</label>
      {options.length === 0 ? (
        <div style={{ padding: '10px 12px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '6px', color: '#B45309', fontSize: '11px', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚠️ {emptyMessage}
          </div>
          {createAction && (
            <button
              type="button"
              onClick={createAction.onClick}
              style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, color: '#FFFFFF', background: '#D97706', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              + {createAction.label}
            </button>
          )}
        </div>
      ) : (
        <div>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', background: '#FFFFFF', color: selectedOption ? '#0F172A' : '#94A3B8', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}
          >
            <span>{selectedOption ? `${selectedOption.name} ${selectedOption.code ? `(${selectedOption.code})` : ''}` : placeholder}</span>
            <span style={{ fontSize: '10px', color: '#64748B' }}>▼</span>
          </div>

          {isOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1100, maxHeight: '200px', overflowY: 'auto', padding: '6px' }}>
              <input
                type="text"
                placeholder="Search master dataset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '11px', border: '1px solid #E2E8F0', borderRadius: '4px', marginBottom: '6px', boxSizing: 'border-box' }}
              />
              <div 
                onClick={() => { onChange(''); setIsOpen(false); }}
                style={{ padding: '6px 8px', fontSize: '11px', color: '#64748B', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
              >
                -- None Selected --
              </div>
              {filteredOptions.length === 0 ? (
                <div style={{ padding: '8px', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>No matching records found</div>
              ) : (
                filteredOptions.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => { onChange(opt.id); setIsOpen(false); }}
                    style={{ padding: '6px 8px', fontSize: '11px', color: value === opt.id ? '#2563EB' : '#0F172A', fontWeight: value === opt.id ? 700 : 400, background: value === opt.id ? '#EFF6FF' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {opt.name} {opt.code ? `(${opt.code})` : ''}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleDTO[]>(DEFAULT_SYSTEM_ROLES);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [designations, setDesignations] = useState<DesignationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search, Filter, Sort, Pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'status'>('name');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Modals & Drawers State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'roles' | 'permissions' | 'lifecycle'>('details');

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [editFormData, setEditFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    designationId: string;
    status: string;
    primaryRole: string;
    additionalRoles: string[];
  }>({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    designationId: '',
    status: 'ACTIVE',
    primaryRole: '',
    additionalRoles: []
  });

  // User Roles & Effective Permissions for Selected User
  const [userRoles, setUserRoles] = useState<UserRoleDTO[]>([]);
  const [effectivePerms, setEffectivePerms] = useState<EffectivePermissionDTO | null>(null);
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false);

  // Simplified Form State for User Creation (Single Primary Role Selection)
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    departmentId: string;
    designationId: string;
    status: string;
    primaryRole: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    departmentId: '',
    designationId: '',
    status: 'ACTIVE',
    primaryRole: 'ROLE_ORG_ADMIN'
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fetchUsersAndMasters = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [uData, rData, dData, desData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        roleService.getAllRoles().catch(() => []),
        departmentService.getAllDepartments().catch(() => []),
        designationService.getAllDesignations().catch(() => [])
      ]);

      setUsers(uData || []);
      
      if (rData && rData.length > 0) {
        const mergedRoles = [...rData];
        DEFAULT_SYSTEM_ROLES.forEach(sysR => {
          if (!mergedRoles.some(r => r.roleCode === sysR.roleCode)) {
            mergedRoles.push(sysR);
          }
        });
        setAvailableRoles(mergedRoles);
      } else {
        setAvailableRoles(DEFAULT_SYSTEM_ROLES);
      }

      // Department & Designation Master Data strictly consumed from Backend APIs
      setDepartments(dData || []);
      setDesignations(desData || []);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load user directory from backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndMasters();
  }, []);

  const handleSelectUser = async (user: UserDTO) => {
    setSelectedUser(user);
    setDrawerLoading(true);
    try {
      const [rolesData, effData] = await Promise.all([
        permissionService.getUserRoles(user.id).catch(() => []),
        permissionService.getUserEffectivePermissions(user.id).catch(() => null)
      ]);
      setUserRoles(rolesData);
      setEffectivePerms(effData);
    } catch (err: any) {
      console.error('Failed to load user roles/permissions:', err);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      } else {
        return a.status.localeCompare(b.status);
      }
    });
  }, [users, searchTerm, statusFilter, sortBy]);

  // Paginated Users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  // Form Validation & Creation (Single Primary Role Assigned Automatically)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email address is required.';
    if (!formData.password) errors.password = 'Initial password is required.';
    if (!formData.primaryRole) errors.primaryRole = 'Primary Role selection is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const selectedRoleCode = formData.primaryRole;
      const payload: CreateUserPayloadDTO = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim() || undefined,
        email: formData.email.trim().toLowerCase(),
        passwordHash: formData.password,
        departmentId: formData.departmentId || undefined,
        designationId: formData.designationId || undefined,
        status: formData.status || 'ACTIVE',
        assignedRoles: [selectedRoleCode],
        defaultRole: selectedRoleCode
      };

      const createdUser = await userService.createUser(payload);

      // Ensure explicit User-Role persistence mapping in backend user_roles table
      if (createdUser && createdUser.id && selectedRoleCode) {
        await permissionService.assignRolesToUser(createdUser.id, [selectedRoleCode]).catch(() => null);
      }

      setShowCreateModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        departmentId: '',
        designationId: '',
        status: 'ACTIVE',
        primaryRole: availableRoles.length > 0 ? availableRoles[0].roleCode : ''
      });
      setFormErrors({});
      fetchUsersAndMasters();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user account.');
    }
  };

  const handleOpenEditModal = async (u: UserDTO) => {
    setEditingUser(u);
    let currentRoles: UserRoleDTO[] = [];
    try {
      currentRoles = await permissionService.getUserRoles(u.id);
    } catch (e) {
      currentRoles = [];
    }

    const currentPrimary: string = u.defaultRole || (currentRoles.length > 0 ? (currentRoles[0].roleCode || '') : (availableRoles[0]?.roleCode || ''));
    const addRoles: string[] = currentRoles
      .map(r => r.roleCode)
      .filter((rc): rc is string => Boolean(rc) && rc !== currentPrimary);

    setEditFormData({
      firstName: u.firstName,
      lastName: u.lastName || '',
      email: u.email,
      departmentId: u.departmentId || '',
      designationId: u.designationId || '',
      status: u.status || 'ACTIVE',
      primaryRole: currentPrimary,
      additionalRoles: addRoles
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const allRoles = Array.from(new Set([editFormData.primaryRole, ...editFormData.additionalRoles].filter(Boolean)));

      await userService.updateUser(editingUser.id, {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim() || undefined,
        departmentId: editFormData.departmentId || undefined,
        designationId: editFormData.designationId || undefined,
        status: editFormData.status,
        defaultRole: editFormData.primaryRole,
        assignedRoles: allRoles
      });

      await permissionService.assignRolesToUser(editingUser.id, allRoles).catch(() => null);

      setEditingUser(null);
      await fetchUsersAndMasters();
      if (selectedUser?.id === editingUser.id) {
        handleSelectUser({
          ...selectedUser,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          status: editFormData.status as any,
          departmentId: editFormData.departmentId,
          designationId: editFormData.designationId,
          defaultRole: editFormData.primaryRole,
          assignedRoles: allRoles
        });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update user profile and roles.');
    }
  };

  const handleAssignRoleToUser = async (roleId: string) => {
    if (!selectedUser) return;
    try {
      await permissionService.assignRolesToUser(selectedUser.id, [roleId]);
      handleSelectUser(selectedUser);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to assign role');
    }
  };

  const handleRemoveRoleFromUser = async (roleId: string) => {
    if (!selectedUser) return;
    try {
      await permissionService.removeRoleFromUser(selectedUser.id, roleId);
      handleSelectUser(selectedUser);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to remove role');
    }
  };

  const handleToggleStatus = async (user: UserDTO) => {
    const nextStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await userService.updateUser(user.id, { status: nextStatus });
      fetchUsersAndMasters();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, status: nextStatus });
      }
    } catch (err) {
      setErrorMsg('Failed to update user status.');
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      if (selectedUser?.id === id) setSelectedUser(null);
      fetchUsersAndMasters();
    } catch (err: any) {
      setErrorMsg('Failed to delete user.');
    }
  };

  // Convert Departments & Designations to MasterOption structure for Searchable Selectors
  const departmentOptions: MasterOption[] = useMemo(() => {
    return departments.map(d => ({ id: d.id, name: d.name, code: d.code }));
  }, [departments]);

  const designationOptions: MasterOption[] = useMemo(() => {
    return designations.map(des => ({ id: des.id, name: des.title, code: des.code }));
  }, [designations]);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Workspace Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', borderLeft: '4px solid #0F172A' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>WORKSPACE: ADMINISTRATION</span>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>User Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchUsersAndMasters}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => {
              setFormErrors({});
              fetchUsersAndMasters();
              setFormData(prev => ({
                ...prev,
                primaryRole: prev.primaryRole || (availableRoles.length > 0 ? availableRoles[0].roleCode : '')
              }));
              setShowCreateModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            <UserPlus size={14} />
            Create User
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', color: '#991B1B', fontSize: '12px', fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      {/* Search, Filter & Sort Bar */}
      <div style={{ display: 'flex', gap: '12px', background: '#FFFFFF', padding: '12px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '6px 12px 6px 32px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#64748B" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DISABLED">DISABLED</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A' }}
          >
            <option value="name">User Name</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Main Directory Table & Drawer Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 380px' : '1fr', gap: '16px' }}>
        
        {/* User Directory Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              User Accounts Directory ({filteredUsers.length})
            </h2>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Page {currentPage} of {totalPages}</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>Loading user directory...</div>
          ) : paginatedUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>No users match the search criteria.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>User Name</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Official Email</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Department</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Primary Role</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const dept = departments.find(d => d.id === u.departmentId);
                  const isSelected = selectedUser?.id === u.id;
                  const roleCodeOrId = u.defaultRole || (u.assignedRoles && u.assignedRoles.length > 0 ? u.assignedRoles[0] : '');
                  const matchedRole = availableRoles.find(r => r.roleCode === roleCodeOrId || r.id === roleCodeOrId);
                  const roleDisplayName = matchedRole ? matchedRole.roleName : (roleCodeOrId || 'Organization Administrator');
                  return (
                    <tr
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      style={{
                        borderBottom: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        background: isSelected ? '#EFF6FF' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{u.firstName} {u.lastName || ''}</div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#334155' }}>{u.email}</td>
                      <td style={{ padding: '10px 14px', color: '#64748B' }}>{dept ? dept.name : '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: '#EFF6FF',
                          color: '#1E40AF',
                          border: '1px solid #BFDBFE',
                          display: 'inline-block'
                        }}>
                          {roleDisplayName}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 800,
                          background: u.status === 'ACTIVE' ? '#DCFCE7' : '#FEE2E2',
                          color: u.status === 'ACTIVE' ? '#15803D' : '#B91C1C'
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleSelectUser(u)}
                            style={{ padding: '3px 8px', fontSize: '10px', border: '1px solid #BFDBFE', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', cursor: 'pointer', fontWeight: 700 }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            style={{ padding: '3px 8px', fontSize: '10px', border: '1px solid #CBD5E1', borderRadius: '4px', background: '#F8FAFC', color: '#0F172A', cursor: 'pointer', fontWeight: 700 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            style={{ padding: '3px 8px', fontSize: '10px', border: '1px solid #CBD5E1', borderRadius: '4px', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleSoftDelete(u.id)}
                            style={{ padding: '3px 8px', fontSize: '10px', border: '1px solid #FCA5A5', borderRadius: '4px', background: '#FEF2F2', color: '#991B1B', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ padding: '4px 8px', fontSize: '11px', border: '1px solid #CBD5E1', borderRadius: '4px', background: '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={12} />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ padding: '4px 8px', fontSize: '11px', border: '1px solid #CBD5E1', borderRadius: '4px', background: '#FFFFFF', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Selected User Detail & IAM Drawer */}
        {selectedUser && (
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0 }}>{selectedUser.firstName} {selectedUser.lastName || ''}</h3>
                <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{selectedUser.email}</span>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>

            {/* IAM Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #CBD5E1', background: '#F8FAFC' }}>
              {[
                { id: 'details', label: 'Profile' },
                { id: 'roles', label: 'User Roles' },
                { id: 'permissions', label: 'Effective Perms' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '10px',
                    fontWeight: activeTab === t.id ? 800 : 600,
                    border: 'none',
                    borderBottom: activeTab === t.id ? '2px solid #2563EB' : 'none',
                    background: activeTab === t.id ? '#FFFFFF' : 'transparent',
                    color: activeTab === t.id ? '#2563EB' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              {drawerLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#64748B' }}>Loading user details...</div>
              ) : (
                <>
                  {/* TAB 1: Profile */}
                  {activeTab === 'details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>User UUID:</span> <span style={{ fontFamily: 'monospace' }}>{selectedUser.id}</span></div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>First Name:</span> {selectedUser.firstName}</div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>Last Name:</span> {selectedUser.lastName || '—'}</div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>Email:</span> {selectedUser.email}</div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>Department:</span> {departments.find(d => d.id === selectedUser.departmentId)?.name || '—'}</div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>Designation:</span> {designations.find(d => d.id === selectedUser.designationId)?.title || '—'}</div>
                      <div><span style={{ color: '#64748B', fontWeight: 600 }}>Status:</span> <strong style={{ color: selectedUser.status === 'ACTIVE' ? '#059669' : '#DC2626' }}>{selectedUser.status}</strong></div>
                    </div>
                  )}

                  {/* TAB 2: User Roles (Additional Role Management) */}
                  {activeTab === 'roles' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                        Assigned Roles ({userRoles.length})
                      </div>
                      {userRoles.map(ur => (
                        <div key={ur.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{ur.roleCode}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{ur.roleName}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveRoleFromUser(ur.roleId)}
                            style={{ padding: '2px 8px', fontSize: '10px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      <div style={{ marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Assign Additional Role:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {availableRoles
                            .filter(r => !userRoles.some(ur => ur.roleId === r.id))
                            .map(r => (
                              <button
                                key={r.id}
                                onClick={() => handleAssignRoleToUser(r.id)}
                                style={{ padding: '4px 8px', fontSize: '11px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                + {r.roleCode}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Effective Permissions (Clean Production UI) */}
                  {activeTab === 'permissions' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
                        Effective Permissions
                      </div>
                      {effectivePerms?.effectivePermissions && effectivePerms.effectivePermissions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                          {effectivePerms.effectivePermissions.map(permCode => (
                            <div key={permCode} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E293B' }}>
                              <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>
                              <span style={{ fontFamily: 'monospace' }}>{permCode}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', padding: '8px 0' }}>
                          No permissions granted.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CREATE USER DIALOG (Simplified UX with Single Primary Role *) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px', width: '540px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Create Enterprise User Account</h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Assign initial Primary Role for user creation</span>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              
              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  {formErrors.firstName && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.firstName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@organization.com"
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  {formErrors.email && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.email}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Initial Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter account password"
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  {formErrors.password && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.password}</span>}
                </div>
              </div>

              {/* Searchable Master Data Selectors: Department & Designation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <SearchableMasterSelect
                  label="Department Master"
                  value={formData.departmentId}
                  onChange={(val) => setFormData({ ...formData, departmentId: val })}
                  options={departmentOptions}
                  placeholder="-- Search & Select Department --"
                  emptyMessage="No Departments Available"
                  createAction={{
                    label: 'Create Department',
                    onClick: () => navigate('/admin/departments')
                  }}
                />

                <SearchableMasterSelect
                  label="Designation Master"
                  value={formData.designationId}
                  onChange={(val) => setFormData({ ...formData, designationId: val })}
                  options={designationOptions}
                  placeholder="-- Search & Select Designation --"
                  emptyMessage="No Designations Available"
                  createAction={{
                    label: 'Create Designation',
                    onClick: () => navigate('/admin/designations')
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>

              {/* Primary Role * (Single Role Selection ONLY) */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Primary Role *</label>
                <select
                  value={formData.primaryRole}
                  onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select Primary Role --</option>
                  {availableRoles.map(r => (
                    <option key={r.id || r.roleCode} value={r.roleCode}>{r.roleCode} - {r.roleName}</option>
                  ))}
                </select>
                {formErrors.primaryRole && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.primaryRole}</span>}
              </div>

              {/* Dialog Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER DIALOG (Profile, Department, Designation, Status, Primary & Additional Roles - NO PERMISSION EDITING) */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px', width: '560px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Edit Enterprise User Profile & Roles</h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Update profile info, department, designation, status, and role assignments</span>
              </div>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Names */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Email (Read Only Identity) & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Official Email (Identity)</label>
                  <input
                    type="email"
                    disabled
                    value={editFormData.email}
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Account Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A', boxSizing: 'border-box' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>
              </div>

              {/* Department Master Selector */}
              <div>
                <SearchableMasterSelect
                  label="Department"
                  options={departmentOptions}
                  value={editFormData.departmentId}
                  onChange={(val) => setEditFormData({ ...editFormData, departmentId: val })}
                  placeholder="Select Department..."
                  emptyMessage="No Departments Available"
                  createAction={{
                    label: 'Create Department',
                    onClick: () => navigate('/admin/departments')
                  }}
                />
              </div>

              {/* Designation Master Selector */}
              <div>
                <SearchableMasterSelect
                  label="Designation"
                  options={designationOptions}
                  value={editFormData.designationId}
                  onChange={(val) => setEditFormData({ ...editFormData, designationId: val })}
                  placeholder="Select Designation..."
                  emptyMessage="No Designations Available"
                  createAction={{
                    label: 'Create Designation',
                    onClick: () => navigate('/admin/designations')
                  }}
                />
              </div>

              {/* Primary Role * */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Primary Role *</label>
                <select
                  value={editFormData.primaryRole}
                  onChange={(e) => {
                    const newPrimary = e.target.value;
                    setEditFormData({
                      ...editFormData,
                      primaryRole: newPrimary,
                      additionalRoles: editFormData.additionalRoles.filter(r => r !== newPrimary)
                    });
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  {availableRoles.map(r => (
                    <option key={r.id || r.roleCode} value={r.roleCode}>{r.roleCode} - {r.roleName}</option>
                  ))}
                </select>
              </div>

              {/* Additional Roles Selection */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Additional Roles</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {availableRoles
                    .filter(r => r.roleCode !== editFormData.primaryRole)
                    .map(r => {
                      const isChecked = editFormData.additionalRoles.includes(r.roleCode);
                      return (
                        <label key={r.id || r.roleCode} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updatedAdd = isChecked
                                ? editFormData.additionalRoles.filter(rc => rc !== r.roleCode)
                                : [...editFormData.additionalRoles, r.roleCode];
                              setEditFormData({ ...editFormData, additionalRoles: updatedAdd });
                            }}
                          />
                          <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.roleCode}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
