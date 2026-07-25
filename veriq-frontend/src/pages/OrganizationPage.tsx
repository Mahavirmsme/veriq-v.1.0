import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Mail, UserCheck, Shield, FolderKanban, AlertTriangle, ChevronRight, RefreshCw, Filter, Building, CheckCircle2 } from 'lucide-react';
import { useOrganizationState } from '../hooks/useOrganizationState';
import { Organization, CreateOrganizationPayload, UpdateOrganizationPayload } from '../services/organizationService';

export const OrganizationPage: React.FC = () => {
  const { organizations, loading, error, refresh, createOrganization, updateOrganization, deleteOrganization } = useOrganizationState();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State matching AUDIT-010 Sections 1, 2, and 3
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    organizationType: 'Enterprise',
    description: '',
    status: 'ACTIVE',
    contactPerson: '',
    designation: '',
    contactEmail: '',
    contactMobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
  });

  const filteredOrgs = (organizations || []).filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.organizationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || org.organizationType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || org.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = (organizations || []).filter(o => o.status === 'ACTIVE').length;
  const totalProjects = (organizations || []).reduce((acc, o) => acc + (o.projectCount || 0), 0);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      organizationType: 'Enterprise',
      description: '',
      status: 'ACTIVE',
      contactPerson: '',
      designation: '',
      contactEmail: '',
      contactMobile: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
    });
    setModalError(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setModalError(null);
    setFormData({
      name: org.name,
      code: org.code,
      organizationType: org.organizationType,
      description: org.description || '',
      status: org.status,
      contactPerson: org.contactPerson || '',
      designation: org.designation || '',
      contactEmail: org.contactEmail || '',
      contactMobile: org.contactMobile || '',
      addressLine1: org.addressLine1 || '',
      addressLine2: org.addressLine2 || '',
      city: org.city || '',
      state: org.state || '',
      country: org.country || '',
      pinCode: org.pinCode || '',
    });
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    try {
      const payload: CreateOrganizationPayload = {
        name: formData.name,
        code: formData.code,
        organizationType: formData.organizationType,
        description: formData.description,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        contactEmail: formData.contactEmail,
        contactMobile: formData.contactMobile,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
      };
      await createOrganization(payload);
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error creating organization record.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setModalError(null);
    try {
      const payload: UpdateOrganizationPayload = {
        name: formData.name,
        organizationType: formData.organizationType,
        status: formData.status,
        description: formData.description,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        contactEmail: formData.contactEmail,
        contactMobile: formData.contactMobile,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
      };
      await updateOrganization(editingOrg.id, payload);
      setEditingOrg(null);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error updating organization record.');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingOrgId) {
      try {
        await deleteOrganization(deletingOrgId);
        setDeletingOrgId(null);
      } catch {
        setDeletingOrgId(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar (Bentley / Azure Portal Style) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Enterprise Architecture</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Organizations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Organization Management</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                {organizations.length} Total
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                {activeCount} Active
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={refresh} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} title="Refresh Database Records">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} />
            <span>New Organization</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B', fontSize: '13px' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* High-Density Enterprise Filter & Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '32px', fontSize: '13px', height: '34px' }}
              placeholder="Search by name, code, type, contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#6B7280" />
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '140px' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="ALL">All Types</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Government">Government</option>
              <option value="Contractor">Contractor</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '130px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
          Showing <b>{filteredOrgs.length}</b> of <b>{organizations.length}</b> records
        </div>
      </div>

      {/* High-Density Corporate Data Grid (SAP Fiori / SAP Table Standard) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '13px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          Loading enterprise organization registry from database...
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>ORGANIZATION</th>
                <th style={{ width: '12%' }}>CODE</th>
                <th style={{ width: '15%' }}>TYPE</th>
                <th style={{ width: '25%' }}>PRIMARY CONTACT</th>
                <th style={{ width: '10%' }}>PROJECTS</th>
                <th style={{ width: '10%' }}>STATUS</th>
                <th style={{ width: '10%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgs.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={16} color="#2563EB" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>{org.name}</div>
                        {org.city && <div style={{ fontSize: '11px', color: '#6B7280' }}>{org.city}{org.state ? `, ${org.state}` : ''}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E5E7EB', color: '#1F2937', fontWeight: 600 }}>
                      {org.code}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-enterprise">
                      {org.organizationType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#1F2937', fontWeight: 500 }}>{org.contactPerson}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={10} color="#9CA3AF" />
                      <span>{org.contactEmail}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/projects?organizationId=${org.id}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2563EB',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        cursor: 'pointer',
                        transition: 'all 100ms ease'
                      }}
                      title="Drill-down to Projects for this Organization"
                    >
                      <FolderKanban size={13} color="#2563EB" />
                      <span>{org.projectCount || 0} Projects</span>
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-active">
                      <CheckCircle2 size={10} style={{ marginRight: '4px' }} />
                      {org.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button onClick={() => handleOpenEdit(org)} className="btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Edit Organization">
                        <Edit3 size={13} color="#2563EB" />
                      </button>
                      <button onClick={() => setDeletingOrgId(org.id)} className="btn-danger" style={{ padding: '4px 6px', fontSize: '11px' }} title="Delete Organization">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                    No organization records match your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Enterprise Dialog (Create) */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>Create New Organization</h2>
              <span style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px' }}>AUDIT-010 Standard</span>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Section 1 */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  SECTION 1: ORGANIZATION INFORMATION
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION NAME *</label>
                    <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter Organization Name" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION CODE *</label>
                      <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="Enter Code (e.g. ACME-01)" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION TYPE *</label>
                      <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.organizationType} onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Government">Government</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>DESCRIPTION (OPTIONAL)</label>
                    <textarea className="input-field" style={{ marginTop: '3px', minHeight: '48px', resize: 'vertical', fontSize: '13px' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter Organization Description" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  SECTION 2: PRIMARY CONTACT
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>CONTACT PERSON *</label>
                      <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="Enter Contact Person" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>DESIGNATION</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} placeholder="Enter Designation" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>EMAIL *</label>
                      <input required type="email" className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="Enter Contact Email" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>MOBILE *</label>
                      <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactMobile} onChange={(e) => setFormData({ ...formData, contactMobile: e.target.value })} placeholder="Enter Contact Mobile" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  SECTION 3: ADDRESS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ADDRESS LINE 1</label>
                    <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} placeholder="Address Line 1" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ADDRESS LINE 2</label>
                    <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} placeholder="Address Line 2" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>CITY</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>STATE</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>COUNTRY</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PIN CODE</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} placeholder="PIN Code" />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Create Organization</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enterprise Dialog (Edit) */}
      {editingOrg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>Edit Organization</h2>
            
            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Section 1 */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SECTION 1: ORGANIZATION INFORMATION</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION NAME *</label>
                    <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION TYPE *</label>
                      <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.organizationType} onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Government">Government</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>STATUS *</label>
                      <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>DESCRIPTION</label>
                    <textarea className="input-field" style={{ marginTop: '3px', minHeight: '48px', resize: 'vertical', fontSize: '13px' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SECTION 2: PRIMARY CONTACT</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>CONTACT PERSON *</label>
                      <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>DESIGNATION</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>EMAIL *</label>
                      <input required type="email" className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>MOBILE *</label>
                      <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.contactMobile} onChange={(e) => setFormData({ ...formData, contactMobile: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SECTION 3: ADDRESS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ADDRESS LINE 1</label>
                    <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ADDRESS LINE 2</label>
                    <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>CITY</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>STATE</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>COUNTRY</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PIN CODE</label>
                      <input className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setEditingOrg(null)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Update Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingOrgId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', padding: '20px 24px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Are you sure you want to delete this organization from the database? This action is permanent.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setDeletingOrgId(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleConfirmDelete} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Delete Organization</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
