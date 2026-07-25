import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, FolderKanban, AlertTriangle, ChevronRight, RefreshCw, Filter, Building, CheckCircle2, Layers } from 'lucide-react';
import { useProjectState } from '../hooks/useProjectState';
import { organizationService, Organization } from '../services/organizationService';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../services/projectService';

export const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, loading, error, refresh, createProject, updateProject, deleteProject } = useProjectState();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State matching Milestone-2 frozen fields
  const [formData, setFormData] = useState({
    organizationId: '',
    projectName: '',
    projectCode: '',
    projectDescription: '',
    projectStatus: 'ACTIVE',
  });

  useEffect(() => {
    organizationService.getAll().then(setOrganizations).catch(() => setOrganizations([]));
  }, []);

  // Listen to URL search parameters for drill-down organization filtering
  useEffect(() => {
    const orgIdFromUrl = searchParams.get('organizationId');
    if (orgIdFromUrl) {
      setOrgFilter(orgIdFromUrl);
    }
  }, [searchParams]);

  const filteredProjects = (projects || []).filter((proj) => {
    const matchesSearch =
      proj.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.projectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.organizationName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg = orgFilter === 'ALL' || proj.organizationId === orgFilter;
    const matchesStatus = statusFilter === 'ALL' || proj.projectStatus === statusFilter;

    return matchesSearch && matchesOrg && matchesStatus;
  });

  const activeCount = (projects || []).filter((p) => p.projectStatus === 'ACTIVE').length;

  const resetForm = () => {
    setFormData({
      organizationId: organizations.length > 0 ? organizations[0].id : '',
      projectName: '',
      projectCode: '',
      projectDescription: '',
      projectStatus: 'ACTIVE',
    });
    setModalError(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setModalError(null);
    setFormData({
      organizationId: proj.organizationId,
      projectName: proj.projectName,
      projectCode: proj.projectCode,
      projectDescription: proj.projectDescription || '',
      projectStatus: proj.projectStatus,
    });
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!formData.organizationId) {
      setModalError('Organization selection is required.');
      return;
    }
    try {
      const payload: CreateProjectPayload = {
        organizationId: formData.organizationId,
        projectName: formData.projectName,
        projectCode: formData.projectCode,
        projectDescription: formData.projectDescription,
        projectStatus: formData.projectStatus,
      };
      await createProject(payload);
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error creating project record.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setModalError(null);
    try {
      const payload: UpdateProjectPayload = {
        organizationId: formData.organizationId,
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        projectStatus: formData.projectStatus,
      };
      await updateProject(editingProject.id, payload);
      setEditingProject(null);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error updating project record.');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingProjectId) {
      try {
        await deleteProject(deletingProjectId);
        setDeletingProjectId(null);
      } catch {
        setDeletingProjectId(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Asset Management</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Projects</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Project Registry</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                {projects.length} Total
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                {activeCount} Active
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={refresh} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} title="Refresh Project Records">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} />
            <span>New Project</span>
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

      {/* High-Density Enterprise Filter Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '640px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '32px', fontSize: '13px', height: '34px' }}
              placeholder="Search by project, code, organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#6B7280" />
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '170px' }} value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
              <option value="ALL">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '130px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
          Showing <b>{filteredProjects.length}</b> of <b>{projects.length}</b> projects
        </div>
      </div>

      {/* Corporate Data Grid with ASSETS column */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '13px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          Loading project registry from database...
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>PROJECT</th>
                <th style={{ width: '13%' }}>CODE</th>
                <th style={{ width: '25%' }}>ORGANIZATION</th>
                <th style={{ width: '12%' }}>ASSETS</th>
                <th style={{ width: '12%' }}>STATUS</th>
                <th style={{ width: '10%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((proj) => (
                <tr key={proj.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FolderKanban size={16} color="#2563EB" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>{proj.projectName}</div>
                        {proj.projectDescription && <div style={{ fontSize: '11px', color: '#6B7280' }}>{proj.projectDescription}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E5E7EB', color: '#1F2937', fontWeight: 600 }}>
                      {proj.projectCode}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={14} color="#6B7280" />
                      <span style={{ fontWeight: 500, fontSize: '13px', color: '#1F2937' }}>{proj.organizationName}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/assets?projectId=${proj.id}`)}
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
                      title="Drill-down to Assets for this Project"
                    >
                      <Layers size={13} color="#2563EB" />
                      <span>{proj.assetCount || 0} Assets</span>
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-active">
                      <CheckCircle2 size={10} style={{ marginRight: '4px' }} />
                      {proj.projectStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button onClick={() => handleOpenEdit(proj)} className="btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Edit Project">
                        <Edit3 size={13} color="#2563EB" />
                      </button>
                      <button onClick={() => setDeletingProjectId(proj.id)} className="btn-danger" style={{ padding: '4px 6px', fontSize: '11px' }} title="Delete Project">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                    No projects found in database. Click "New Project" to create your first project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '560px', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>New Project</h2>
              <span style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px' }}>Milestone-2 Standard</span>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.organizationId} onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}>
                  <option value="" disabled>Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT NAME *</label>
                <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} placeholder="Enter Project Name" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT CODE *</label>
                  <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectCode} onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })} placeholder="e.g. PRJ-01" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT STATUS *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectStatus} onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT DESCRIPTION</label>
                <textarea className="input-field" style={{ marginTop: '3px', minHeight: '60px', resize: 'vertical', fontSize: '13px' }} value={formData.projectDescription} onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })} placeholder="Enter Project Description" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '560px', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>Edit Project</h2>
            
            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ORGANIZATION *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.organizationId} onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT NAME *</label>
                <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT STATUS *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectStatus} onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT DESCRIPTION</label>
                <textarea className="input-field" style={{ marginTop: '3px', minHeight: '60px', resize: 'vertical', fontSize: '13px' }} value={formData.projectDescription} onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Update Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProjectId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', padding: '20px 24px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Are you sure you want to delete this project from the database? This action is permanent.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setDeletingProjectId(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleConfirmDelete} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Delete Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
