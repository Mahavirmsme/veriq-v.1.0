import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { departmentService, DepartmentDTO, CreateDepartmentPayloadDTO } from '../../../services/departmentService';

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateDepartmentPayloadDTO>({
    name: '',
    code: '',
    status: 'ACTIVE'
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fetchDepartments = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data || []);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load department master records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = 'Department name is required.';
    if (!formData.code.trim()) errors.code = 'Department code is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await departmentService.createDepartment({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        status: formData.status || 'ACTIVE'
      });
      setShowCreateModal(false);
      setFormData({ name: '', code: '', status: 'ACTIVE' });
      setFormErrors({});
      fetchDepartments();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create department master record.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentService.deleteDepartment(id);
      fetchDepartments();
    } catch (err: any) {
      setErrorMsg('Failed to delete department.');
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Workspace Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', borderLeft: '4px solid #0F172A' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>WORKSPACE: ADMINISTRATION</span>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>Department Master Directory</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchDepartments}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => { setFormErrors({}); setShowCreateModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Plus size={14} />
            Create Department
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', color: '#991B1B', fontSize: '12px', fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search by department name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '6px 12px 6px 32px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <span style={{ fontSize: '11px', color: '#64748B' }}>Total Master Records: {filteredDepartments.length}</span>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>Loading department master records...</div>
        ) : filteredDepartments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>No department master records found. Click "Create Department" to add one.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Department Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Code</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{dept.name}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#334155' }}>{dept.code}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, background: dept.status === 'ACTIVE' ? '#DCFCE7' : '#FEE2E2', color: dept.status === 'ACTIVE' ? '#15803D' : '#B91C1C' }}>
                      {dept.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      style={{ padding: '4px 8px', fontSize: '10px', border: '1px solid #FCA5A5', borderRadius: '4px', background: '#FEF2F2', color: '#991B1B', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE DEPARTMENT MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px', width: '420px', maxWidth: '95%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Create Department Master</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Water Infrastructure"
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                {formErrors.name && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.name}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Department Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. ENG-WI"
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                {formErrors.code && <span style={{ fontSize: '10px', color: '#DC2626' }}>{formErrors.code}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>

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
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
