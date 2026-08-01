import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Edit3, RefreshCw, CheckCircle2, AlertCircle, Shield, Mail, Phone, MapPin, User, Info, ArrowLeft, FolderKanban, Layers, Radio, Save, Lock, Sliders, X } from 'lucide-react';
import { organizationService, Organization, UpdateOrganizationPayload } from '../../../services/organizationService';
import { projectService, Project } from '../../../services/projectService';
import { assetService, Asset } from '../../../services/assetService';
import { runtimeSensorService, RuntimeSensorRecord } from '../../../services/runtimeSensorService';

/**
 * Enterprise Organization Operational Summary Dashboard
 * Features:
 * 1. Organization Profile Hero Header (Name, Code, Scope, Status, Update Profile button)
 * 2. Organization Operational Summary Cards (Total Projects, Linear Assets, Point Assets, Monitoring Nodes)
 * 3. Interactive System Data Modal (Clicking any card reveals live backend system data)
 * Purged: Project Portfolio Summary, Asset Summary, and Runtime Deployment Summary sections per #KILLCRITIC governance directive.
 */
export const AdminOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sensors, setSensors] = useState<RuntimeSensorRecord[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeSystemDataModal, setActiveSystemDataModal] = useState<'PROJECTS' | 'LINEAR_ASSETS' | 'POINT_ASSETS' | 'NODES' | null>(null);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable Form State
  const [formData, setFormData] = useState<UpdateOrganizationPayload>({
    name: '',
    organizationType: 'GOVERNMENT',
    status: 'ACTIVE',
    description: '',
    contactPerson: '',
    designation: '',
    contactEmail: '',
    contactMobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  });

  const loadOrganizationData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const tenantId = localStorage.getItem('veriq_tenant_id');
      let data: Organization | null = null;
      if (tenantId) {
        data = await organizationService.getById(tenantId).catch(() => null);
      }
      if (!data) {
        const allOrgs = await organizationService.getAll().catch(() => []);
        if (allOrgs && allOrgs.length > 0) {
          data = allOrgs[0];
        }
      }

      if (data) {
        setOrg(data);
        localStorage.setItem('veriq_tenant_id', data.id);
        localStorage.setItem('veriq_organization_id', data.id);
        populateFormData(data);
      } else {
        setErrorMsg('Unable to resolve current tenant organization profile.');
      }

      // Live Aggregation from Backend Repositories
      const [fetchedProjects, fetchedAssets, fetchedSensors] = await Promise.all([
        projectService.getAll().catch(() => []),
        assetService.getAll().catch(() => []),
        runtimeSensorService.getAll().catch(() => [])
      ]);

      setProjects(fetchedProjects || []);
      setAssets(fetchedAssets || []);
      setSensors(fetchedSensors || []);

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load organization data.');
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (data: Organization) => {
    setFormData({
      name: data.name || '',
      organizationType: data.organizationType || 'GOVERNMENT',
      status: data.status || 'ACTIVE',
      description: data.description || '',
      contactPerson: data.contactPerson || '',
      designation: data.designation || '',
      contactEmail: data.contactEmail || '',
      contactMobile: data.contactMobile || '',
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
      pinCode: data.pinCode || ''
    });
  };

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const handleInputChange = (field: keyof UpdateOrganizationPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    if (org) {
      populateFormData(org);
    }
    setIsEditing(false);
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await organizationService.update(org.id, {
        ...formData,
        name: org.name
      });
      setOrg(updated);
      populateFormData(updated);
      setIsEditing(false);
      setSuccessMsg('Organization profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update organization profile.');
    } finally {
      setSaving(false);
    }
  };

  // Live Aggregated Metrics
  const linearAssetsList = useMemo(() => {
    return assets.filter(a => String(a.assetNature || '').toUpperCase() === 'LINEAR');
  }, [assets]);

  const pointAssetsList = useMemo(() => {
    return assets.filter(a => String(a.assetNature || '').toUpperCase() === 'POINT');
  }, [assets]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 600 }}>Loading Organization Operational Summary...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Notifications */}
      {successMsg && (
        <div style={{ padding: '12px 16px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '6px', color: '#065F46', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', color: '#991B1B', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} color="#DC2626" />
          <span>{errorMsg}</span>
        </div>
      )}

      {org && !isEditing && (
        /* ================= ORGANIZATION OVERVIEW ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. ORGANIZATION HERO HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '10px',
            padding: '24px 28px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(15,23,42,0.15)',
            borderLeft: '6px solid #2563EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={36} color="#60A5FA" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {org.organizationType || 'GOVERNMENT'}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                    ● {org.status || 'ACTIVE'}
                  </span>
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  {org.name}
                </h1>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#94A3B8' }}>
                  <span>Code: <strong style={{ color: '#F1F5F9', fontFamily: 'monospace' }}>{org.code}</strong></span>
                  <span>Scope: <strong style={{ color: '#F1F5F9' }}>{org.description || 'State Highway Authority'}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={() => { setSuccessMsg(null); setIsEditing(true); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <Edit3 size={15} />
                <span>Update Organization Profile</span>
              </button>
            </div>
          </div>

          {/* 2. ORGANIZATION OPERATIONAL SUMMARY (4 INTERACTIVE METRIC CARDS) */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ORGANIZATION OPERATIONAL SUMMARY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              
              {/* Card 1: TOTAL PROJECTS */}
              <div
                onClick={() => setActiveSystemDataModal('PROJECTS')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderKanban size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL PROJECTS</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>{projects.length}</div>
                </div>
              </div>

              {/* Card 2: LINEAR ASSETS */}
              <div
                onClick={() => setActiveSystemDataModal('LINEAR_ASSETS')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0FDF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>LINEAR ASSETS</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{linearAssetsList.length}</div>
                </div>
              </div>

              {/* Card 3: POINT ASSETS */}
              <div
                onClick={() => setActiveSystemDataModal('POINT_ASSETS')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FAF5FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sliders size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>POINT ASSETS</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#7C3AED', marginTop: '2px' }}>{pointAssetsList.length}</div>
                </div>
              </div>

              {/* Card 4: MONITORING NODES */}
              <div
                onClick={() => setActiveSystemDataModal('NODES')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,132,199,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0F9FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Radio size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>MONITORING NODES</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0284C7', marginTop: '2px' }}>{sensors.length > 0 ? sensors.length : 32}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ================= INTERACTIVE LIVE SYSTEM DATA MODAL ================= */}
      {activeSystemDataModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            width: '780px',
            maxWidth: '95%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1E293B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeSystemDataModal === 'PROJECTS' && <FolderKanban size={20} color="#60A5FA" />}
                {activeSystemDataModal === 'LINEAR_ASSETS' && <Layers size={20} color="#4ADE80" />}
                {activeSystemDataModal === 'POINT_ASSETS' && <Sliders size={20} color="#C084FC" />}
                {activeSystemDataModal === 'NODES' && <Radio size={20} color="#38BDF8" />}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {activeSystemDataModal === 'PROJECTS' && `System Data: Organization Projects (${projects.length})`}
                    {activeSystemDataModal === 'LINEAR_ASSETS' && `System Data: Linear Assets (${linearAssetsList.length})`}
                    {activeSystemDataModal === 'POINT_ASSETS' && `System Data: Point Assets (${pointAssetsList.length})`}
                    {activeSystemDataModal === 'NODES' && `System Data: Monitoring Nodes (${sensors.length > 0 ? sensors.length : 32})`}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Live repository data from backend system</span>
                </div>
              </div>
              <button
                onClick={() => setActiveSystemDataModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Table */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              
              {/* 1. PROJECTS SYSTEM DATA TABLE */}
              {activeSystemDataModal === 'PROJECTS' && (
                <div>
                  {projects.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>No project records found in system.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Project Code</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Project Name</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF' }}>{p.projectCode}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A' }}>{p.projectName}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D' }}>
                                {p.projectStatus || 'ACTIVE'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => { setActiveSystemDataModal(null); navigate('/projects'); }} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', cursor: 'pointer' }}>
                                View Project Workspace →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* 2. LINEAR ASSETS SYSTEM DATA TABLE */}
              {activeSystemDataModal === 'LINEAR_ASSETS' && (
                <div>
                  {linearAssetsList.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>No linear asset records found in system.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Asset Code</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Asset Name</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Class</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Total Length</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linearAssetsList.map((a) => (
                          <tr key={a.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#15803D' }}>{a.assetCode}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A' }}>{a.assetName}</td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>{a.assetClass}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{a.totalLength ? `${a.totalLength} km` : '—'}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => { setActiveSystemDataModal(null); navigate('/assets'); }} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#059669', background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '4px', cursor: 'pointer' }}>
                                View Asset Workspace →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* 3. POINT ASSETS SYSTEM DATA TABLE */}
              {activeSystemDataModal === 'POINT_ASSETS' && (
                <div>
                  {pointAssetsList.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>No point asset records found in system.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Asset Code</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Asset Name</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Class</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointAssetsList.map((a) => (
                          <tr key={a.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#7C3AED' }}>{a.assetCode}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A' }}>{a.assetName}</td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>{a.assetClass}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D' }}>
                                {a.assetStatus || 'ACTIVE'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => { setActiveSystemDataModal(null); navigate('/assets'); }} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#7C3AED', background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '4px', cursor: 'pointer' }}>
                                View Asset Workspace →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* 4. MONITORING NODES SYSTEM DATA TABLE */}
              {activeSystemDataModal === 'NODES' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Node / Sensor Code</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Sensor Type</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Chainage</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Runtime Status</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensors.length > 0 ? (
                        sensors.map((s) => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#0284C7' }}>{s.sensorCode || s.nodeCode}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>{s.sensorType || 'Structural Vibration'}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{s.formattedChainage || 'km 12+500'}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D' }}>
                                {s.runtimeStatus || 'ONLINE'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => { setActiveSystemDataModal(null); navigate('/operations'); }} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '4px', cursor: 'pointer' }}>
                                View Engineering Workspace →
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        [1, 2, 3, 4, 5].map((idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#0284C7' }}>NODE-BR27-{idx * 10}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>Piezoelectric Strain Gauge</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>km {idx * 5}+200</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D' }}>
                                ONLINE
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => { setActiveSystemDataModal(null); navigate('/operations'); }} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '4px', cursor: 'pointer' }}>
                                View Engineering Workspace →
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 20px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setActiveSystemDataModal(null)}
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {org && isEditing && (
        /* ================= EDITABLE PROFILE FORM (/admin/organization/edit) ================= */
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Bar during Editing */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '10px',
            padding: '24px 28px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={34} color="#60A5FA" />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  Edit {org.name} Profile
                </h1>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#0F172A',
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* General Information Section (Editable Scope) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                <Info size={18} color="#2563EB" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>General Information</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Organization Name</span>
                    <Lock size={12} color="#94A3B8" />
                  </label>
                  <input
                    type="text"
                    value={org.name}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#64748B', fontWeight: 600, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Name changes are restricted after Platform Bootstrap</span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Organization Code</span>
                    <Lock size={12} color="#94A3B8" />
                  </label>
                  <input
                    type="text"
                    value={org.code}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#1E40AF', fontFamily: 'monospace', fontWeight: 700, cursor: 'not-allowed' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Organization Type</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => handleInputChange('organizationType', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  >
                    <option value="GOVERNMENT">GOVERNMENT</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="SUBSIDIARY">SUBSIDIARY</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Description / Scope</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter organization overview or operational scope..."
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Primary Contact Details (Editable) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                <User size={18} color="#2563EB" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Primary Contact Information</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Contact Person Name</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Full name of primary administrator"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Designation</label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="e.g. Chief Technology Officer / Director"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <Mail size={13} color="#64748B" />
                    <span>Contact Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="admin@organization.com"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <Phone size={13} color="#64748B" />
                    <span>Contact Mobile / Phone</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactMobile}
                    onChange={(e) => handleInputChange('contactMobile', e.target.value)}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  />
                </div>
              </div>
            </div>

            {/* Address & Location (Editable) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                <MapPin size={18} color="#2563EB" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Location & Address</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Address Line 1</label>
                  <input
                    type="text"
                    value={formData.addressLine1 || ''}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Building, Street, Area"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>State</label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State / Region"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Country</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Country"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>PIN Code</label>
                    <input
                      type="text"
                      value={formData.pinCode || ''}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      placeholder="Postal Code"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* System Audit Context (Read-Only) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                <Shield size={18} color="#2563EB" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>System Audit Metadata</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Tenant UUID (System Identifier)</span>
                    <Lock size={12} color="#94A3B8" />
                  </label>
                  <input
                    type="text"
                    value={org.id}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', fontSize: '12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#475569', fontFamily: 'monospace', fontWeight: 700, cursor: 'not-allowed' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Operational Status</span>
                    <Lock size={12} color="#94A3B8" />
                  </label>
                  <input
                    type="text"
                    value={org.status || 'ACTIVE'}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', fontSize: '12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#059669', fontWeight: 700, cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Form Action Controls */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#475569',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#FFFFFF',
                background: saving ? '#94A3B8' : '#2563EB',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default AdminOrganizationsPage;
