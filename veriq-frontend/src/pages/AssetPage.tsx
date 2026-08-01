import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Layers, AlertTriangle, ChevronRight, RefreshCw, Filter, FolderKanban, CheckCircle2, Navigation, MapPin, Ruler, Cpu } from 'lucide-react';
import { useAssetState } from '../hooks/useAssetState';
import { projectService, Project } from '../services/projectService';
import { Asset, ASSET_CLASS_MASTER, CreateAssetPayload, UpdateAssetPayload } from '../services/assetService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';

export const AssetPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { assets, loading, error, refresh, createAsset, updateAsset, deleteAsset } = useAssetState();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [natureFilter, setNatureFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Point Asset State inside Asset Form
  const [pointAssetItems, setPointAssetItems] = useState<{ pointAssetCode: string; pointAssetName: string; pointAssetType: string; startChainage?: number; structureLengthMeters?: number; endChainage?: number; locationChainage?: number }[]>([]);
  const [newPointItem, setNewPointItem] = useState({ pointAssetCode: '', pointAssetName: '', pointAssetType: 'Bridge', startChainage: '', structureLengthMeters: '' });
  const [pointValidationErr, setPointValidationErr] = useState<string | null>(null);

  // Existing Point Assets for Editing
  const [existingPointAssets, setExistingPointAssets] = useState<PointAsset[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    projectId: '',
    assetName: '',
    assetCode: '',
    assetDescription: '',
    assetClass: ASSET_CLASS_MASTER[0],
    assetNature: 'Linear' as 'Linear' | 'Point',
    startChainage: '',
    endChainage: '',
    totalLength: '',
    assetStatus: 'ACTIVE',
  });

  useEffect(() => {
    projectService.getAll().then(setProjects).catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId');
    if (projectIdFromUrl) {
      setProjectFilter(projectIdFromUrl);
    }
  }, [searchParams]);

  // Auto-calculate Total Length for Linear Assets
  useEffect(() => {
    if (formData.assetNature === 'Linear') {
      const start = parseFloat(formData.startChainage);
      const end = parseFloat(formData.endChainage);
      if (!isNaN(start) && !isNaN(end)) {
        const length = end - start;
        setFormData((prev) => ({ ...prev, totalLength: length >= 0 ? length.toFixed(3) : '0.000' }));
      } else {
        setFormData((prev) => ({ ...prev, totalLength: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, startChainage: '', endChainage: '', totalLength: '' }));
    }
  }, [formData.assetNature, formData.startChainage, formData.endChainage]);

  const filteredAssets = (assets || []).filter((ast) => {
    const matchesSearch =
      ast.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetClass?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProject = projectFilter === 'ALL' || ast.projectId === projectFilter;
    const matchesClass = classFilter === 'ALL' || ast.assetClass === classFilter;
    const matchesNature = natureFilter === 'ALL' || ast.assetNature === natureFilter;
    const matchesStatus = statusFilter === 'ALL' || ast.assetStatus === statusFilter;

    return matchesSearch && matchesProject && matchesClass && matchesNature && matchesStatus;
  });

  const linearCount = (assets || []).filter((a) => String(a.assetNature).toUpperCase() === 'LINEAR').length;
  const pointCount = (assets || []).filter((a) => String(a.assetNature).toUpperCase() === 'POINT').length;

  const resetForm = () => {
    setFormData({
      projectId: projects.length > 0 ? projects[0].id : '',
      assetName: '',
      assetCode: '',
      assetDescription: '',
      assetClass: ASSET_CLASS_MASTER[0],
      assetNature: 'Linear',
      startChainage: '',
      endChainage: '',
      totalLength: '',
      assetStatus: 'ACTIVE',
    });
    setPointAssetItems([]);
    setNewPointItem({ pointAssetCode: '', pointAssetName: '', pointAssetType: 'Bridge', startChainage: '', structureLengthMeters: '' });
    setExistingPointAssets([]);
    setModalError(null);
    setPointValidationErr(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = async (ast: Asset) => {
    setEditingAsset(ast);
    setModalError(null);
    setPointValidationErr(null);
    setFormData({
      projectId: ast.projectId,
      assetName: ast.assetName,
      assetCode: ast.assetCode,
      assetDescription: ast.assetDescription || '',
      assetClass: ast.assetClass,
      assetNature: (ast.assetNature?.toUpperCase() === 'POINT' ? 'Point' : 'Linear') as 'Linear' | 'Point',
      startChainage: ast.startChainage !== undefined && ast.startChainage !== null ? String(ast.startChainage) : '',
      endChainage: ast.endChainage !== undefined && ast.endChainage !== null ? String(ast.endChainage) : '',
      totalLength: ast.totalLength !== undefined && ast.totalLength !== null ? String(ast.totalLength) : '',
      assetStatus: ast.assetStatus,
    });

    if (String(ast.assetNature).toUpperCase() === 'POINT') {
      const existing = await pointAssetService.getByAssetId(ast.id).catch(() => []);
      setExistingPointAssets(existing || []);
    }
  };

  const handleAddPointItem = () => {
    if (!newPointItem.pointAssetCode.trim()) {
      setPointValidationErr('Point Asset Code is required.');
      return;
    }
    if (!newPointItem.pointAssetName.trim()) {
      setPointValidationErr('Point Asset Name is required.');
      return;
    }
    const start = parseFloat(newPointItem.startChainage);
    if (isNaN(start)) {
      setPointValidationErr('Start Chainage is required.');
      return;
    }
    const lengthM = parseFloat(newPointItem.structureLengthMeters);
    if (isNaN(lengthM) || lengthM <= 0) {
      setPointValidationErr('Structure Length must be greater than zero.');
      return;
    }

    const end = parseFloat((start + (lengthM / 1000)).toFixed(3));

    setPointAssetItems((prev) => [
      ...prev,
      {
        pointAssetCode: newPointItem.pointAssetCode.trim(),
        pointAssetName: newPointItem.pointAssetName.trim(),
        pointAssetType: newPointItem.pointAssetType,
        startChainage: start,
        structureLengthMeters: lengthM,
        endChainage: end,
        locationChainage: start
      }
    ]);
    setPointValidationErr(null);
    setNewPointItem({ pointAssetCode: '', pointAssetName: '', pointAssetType: 'Bridge', startChainage: '', structureLengthMeters: '' });
  };

  const handleRemovePointItem = (index: number) => {
    setPointAssetItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingPoint = async (pointId: string) => {
    try {
      await pointAssetService.delete(pointId);
      setExistingPointAssets((prev) => prev.filter((p) => p.id !== pointId));
    } catch {
      // Ignore
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!formData.projectId) {
      setModalError('Project selection is required.');
      return;
    }
    try {
      const payload: CreateAssetPayload = {
        projectId: formData.projectId,
        assetName: formData.assetName,
        assetCode: formData.assetCode,
        assetDescription: formData.assetDescription,
        assetClass: formData.assetClass,
        assetNature: formData.assetNature,
        startChainage: formData.assetNature === 'Linear' && formData.startChainage ? parseFloat(formData.startChainage) : undefined,
        endChainage: formData.assetNature === 'Linear' && formData.endChainage ? parseFloat(formData.endChainage) : undefined,
        totalLength: formData.assetNature === 'Linear' && formData.totalLength ? parseFloat(formData.totalLength) : undefined,
        assetStatus: formData.assetStatus,
      };
      const createdAsset = await createAsset(payload);

      // Save Point Assets to backend database
      if (formData.assetNature === 'Point' && pointAssetItems.length > 0 && createdAsset.id) {
        for (const item of pointAssetItems) {
          await pointAssetService.create({
            assetId: createdAsset.id,
            pointAssetCode: item.pointAssetCode,
            pointAssetName: item.pointAssetName,
            pointAssetType: item.pointAssetType,
            startChainage: item.startChainage,
            structureLengthMeters: item.structureLengthMeters,
            endChainage: item.endChainage,
            locationChainage: item.startChainage,
            status: 'ACTIVE'
          }).catch(() => {});
        }
      }

      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error creating asset record.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    setModalError(null);
    try {
      const payload: UpdateAssetPayload = {
        projectId: formData.projectId,
        assetName: formData.assetName,
        assetDescription: formData.assetDescription,
        assetClass: formData.assetClass,
        assetNature: formData.assetNature,
        startChainage: formData.assetNature === 'Linear' && formData.startChainage ? parseFloat(formData.startChainage) : undefined,
        endChainage: formData.assetNature === 'Linear' && formData.endChainage ? parseFloat(formData.endChainage) : undefined,
        totalLength: formData.assetNature === 'Linear' && formData.totalLength ? parseFloat(formData.totalLength) : undefined,
        assetStatus: formData.assetStatus,
      };
      await updateAsset(editingAsset.id, payload);

      // Add new Point Assets created during edit
      if (formData.assetNature === 'Point' && pointAssetItems.length > 0) {
        for (const item of pointAssetItems) {
          await pointAssetService.create({
            assetId: editingAsset.id,
            pointAssetCode: item.pointAssetCode,
            pointAssetName: item.pointAssetName,
            pointAssetType: item.pointAssetType,
            startChainage: item.startChainage,
            structureLengthMeters: item.structureLengthMeters,
            endChainage: item.endChainage,
            locationChainage: item.startChainage,
            status: 'ACTIVE'
          }).catch(() => {});
        }
      }

      setEditingAsset(null);
    } catch (err: unknown) {
      const apiError = err as { message?: string; error?: { details?: string } };
      setModalError(apiError?.error?.details || apiError?.message || 'Error updating asset record.');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingAssetId) {
      try {
        await deleteAsset(deletingAssetId);
        setDeletingAssetId(null);
      } catch {
        setDeletingAssetId(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Asset Management</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Asset Management</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Asset Registry</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                {assets.length} Total Assets
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                {linearCount} Linear
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                {pointCount} Point
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={refresh} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} title="Refresh Asset Registry">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} />
            <span>New Asset</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '780px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '32px', fontSize: '13px', height: '34px' }}
              placeholder="Search asset, code, class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#6B7280" />
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '150px' }} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
              <option value="ALL">All Projects</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>{proj.projectName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '150px' }} value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="ALL">All Asset Classes</option>
              {ASSET_CLASS_MASTER.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '120px' }} value={natureFilter} onChange={(e) => setNatureFilter(e.target.value)}>
              <option value="ALL">All Natures</option>
              <option value="Linear">Linear</option>
              <option value="Point">Point</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select className="input-field" style={{ height: '34px', fontSize: '12px', padding: '0 8px', width: '120px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
          Showing <b>{filteredAssets.length}</b> of <b>{assets.length}</b> assets
        </div>
      </div>

      {/* Corporate Data Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '13px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          Loading asset registry from database...
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>ASSET</th>
                <th style={{ width: '10%' }}>CODE</th>
                <th style={{ width: '18%' }}>PROJECT</th>
                <th style={{ width: '15%' }}>ASSET CLASS</th>
                <th style={{ width: '12%' }}>NATURE</th>
                <th style={{ width: '15%' }}>SEGMENT / OBJECTS</th>
                <th style={{ width: '8%' }}>STATUS</th>
                <th style={{ width: '0%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((ast) => (
                <tr key={ast.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={16} color="#2563EB" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>{ast.assetName}</div>
                        {ast.assetDescription && <div style={{ fontSize: '11px', color: '#6B7280' }}>{ast.assetDescription}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E5E7EB', color: '#1F2937', fontWeight: 600 }}>
                      {ast.assetCode}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FolderKanban size={13} color="#6B7280" />
                      <span style={{ fontWeight: 500, fontSize: '13px', color: '#1F2937' }}>{ast.projectName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151', background: '#F9FAFB', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                      {ast.assetClass}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: String(ast.assetNature).toUpperCase() === 'LINEAR' ? '#EFF6FF' : '#FEF3C7',
                      color: String(ast.assetNature).toUpperCase() === 'LINEAR' ? '#1E40AF' : '#92400E',
                      border: String(ast.assetNature).toUpperCase() === 'LINEAR' ? '1px solid #BFDBFE' : '1px solid #FDE68A'
                    }}>
                      {String(ast.assetNature).toUpperCase() === 'LINEAR' ? <Navigation size={10} /> : <MapPin size={10} />}
                      {ast.assetNature}
                    </span>
                  </td>
                  <td>
                    {String(ast.assetNature).toUpperCase() === 'LINEAR' && ast.totalLength !== undefined && ast.totalLength !== null ? (
                      <div style={{ fontSize: '11px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Ruler size={12} color="#2563EB" />
                        <span>km {ast.startChainage || 0} → {ast.endChainage || 0} <b>({ast.totalLength} km)</b></span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Point Assets Configured</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-active">
                      <CheckCircle2 size={10} style={{ marginRight: '4px' }} />
                      {ast.assetStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      {String(ast.assetNature).toUpperCase() === 'LINEAR' && (
                        <button onClick={() => navigate(`/engineering-design?assetId=${ast.id}`)} className="btn-secondary" style={{ padding: '4px 6px', fontSize: '11px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }} title="Open Region Engineering Workspace">
                          <Cpu size={13} color="#2563EB" />
                        </button>
                      )}
                      <button onClick={() => handleOpenEdit(ast)} className="btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Edit Asset">
                        <Edit3 size={13} color="#2563EB" />
                      </button>
                      <button onClick={() => setDeletingAssetId(ast.id)} className="btn-danger" style={{ padding: '4px 6px', fontSize: '11px' }} title="Delete Asset">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                    No asset records found in database. Click "New Asset" to register your first asset.
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
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>New Asset Registration</h2>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}>
                  <option value="" disabled>Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.projectName} ({proj.projectCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET NAME *</label>
                <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} placeholder="Enter Asset Name (e.g. Samruddhi Mahamarg Expressway)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET CODE *</label>
                  <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetCode} onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })} placeholder="e.g. SM-01" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>STATUS *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetStatus} onChange={(e) => setFormData({ ...formData, assetStatus: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET CLASS *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetClass} onChange={(e) => setFormData({ ...formData, assetClass: e.target.value })}>
                    {ASSET_CLASS_MASTER.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET NATURE *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetNature} onChange={(e) => setFormData({ ...formData, assetNature: e.target.value as 'Linear' | 'Point' })}>
                    <option value="Linear">Linear (Highway, Railway, Pipeline, etc.)</option>
                    <option value="Point">Point (Substation, Plant, Dam, Airport, etc.)</option>
                  </select>
                </div>
              </div>

              {/* Conditional Linear Asset Chainage Fields */}
              {formData.assetNature === 'Linear' && (
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    ENGINEERING CHAINAGE & LENGTH
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>START CHAINAGE (km)</label>
                      <input type="number" step="0.001" className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.startChainage} onChange={(e) => setFormData({ ...formData, startChainage: e.target.value })} placeholder="0.000" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>END CHAINAGE (km)</label>
                      <input type="number" step="0.001" className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.endChainage} onChange={(e) => setFormData({ ...formData, endChainage: e.target.value })} placeholder="21.800" />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>TOTAL LENGTH (km)</label>
                      <input readOnly className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px', background: '#E5E7EB', fontWeight: 600, color: '#1F2937' }} value={formData.totalLength} placeholder="Auto-calculated" />
                    </div>
                  </div>
                </div>
              )}

              {/* Seamless Integrated Point Assets Configuration Section */}
              {(formData.assetNature === 'Point' || (formData.assetNature as string) === 'POINT') && (() => {
                const pStart = parseFloat(newPointItem.startChainage);
                const pLen = parseFloat(newPointItem.structureLengthMeters);
                const derivedEndStr = (!isNaN(pStart) && !isNaN(pLen) && pLen > 0) ? (pStart + (pLen / 1000)).toFixed(3) : '';

                return (
                  <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      POINT ASSETS
                    </div>

                    {pointValidationErr && (
                      <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={13} />
                        <span>{pointValidationErr}</span>
                      </div>
                    )}

                    {/* Add New Point Asset Line */}
                    <div style={{ display: 'grid', gridTemplateColumns: '110px 1.5fr 130px 100px 110px 100px 75px', gap: '8px', alignItems: 'center' }}>
                      <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Code (BR-27)" value={newPointItem.pointAssetCode} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetCode: e.target.value })} />
                      <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Point Asset Name" value={newPointItem.pointAssetName} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetName: e.target.value })} />
                      <select className="input-field" style={{ height: '32px', fontSize: '12px' }} value={newPointItem.pointAssetType} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetType: e.target.value })}>
                        <option value="Bridge">Bridge</option>
                        <option value="Dam">Dam</option>
                        <option value="Pump Station">Pump Station</option>
                        <option value="Substation">Substation</option>
                        <option value="Tunnel">Tunnel</option>
                        <option value="Plant">Plant</option>
                      </select>
                      <input type="number" step="0.001" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Start (km)" value={newPointItem.startChainage} onChange={(e) => setNewPointItem({ ...newPointItem, startChainage: e.target.value })} />
                      <input type="number" step="1" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Length (m)" value={newPointItem.structureLengthMeters} onChange={(e) => setNewPointItem({ ...newPointItem, structureLengthMeters: e.target.value })} />
                      <input type="text" readOnly className="input-field" style={{ height: '32px', fontSize: '12px', background: '#F1F5F9', fontWeight: 700, color: '#0F172A' }} placeholder="End (km)" value={derivedEndStr} title="End Chainage derived automatically = Start + (Length / 1000)" />
                      <button type="button" onClick={handleAddPointItem} className="btn-secondary" style={{ height: '32px', padding: '0 8px', fontSize: '12px', fontWeight: 700 }}>+ Add</button>
                    </div>

                    {/* Added List */}
                    {pointAssetItems.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                        {pointAssetItems.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                            <div>
                              <strong style={{ color: '#0F172A' }}>{p.pointAssetCode}</strong> — {p.pointAssetName} ({p.pointAssetType}) [Start: km {p.startChainage ?? p.locationChainage} | Length: {p.structureLengthMeters ?? 0}m | End: km {p.endChainage ?? (p.startChainage || p.locationChainage || 0)}]
                            </div>
                            <button type="button" onClick={() => handleRemovePointItem(idx)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET DESCRIPTION</label>
                <textarea className="input-field" style={{ marginTop: '3px', minHeight: '56px', resize: 'vertical', fontSize: '13px' }} value={formData.assetDescription} onChange={(e) => setFormData({ ...formData, assetDescription: e.target.value })} placeholder="Enter Asset Description" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingAsset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 30px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>Edit Asset</h2>
            
            {modalError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>PROJECT *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.projectName} ({proj.projectCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET NAME *</label>
                <input required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET CLASS *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetClass} onChange={(e) => setFormData({ ...formData, assetClass: e.target.value })}>
                    {ASSET_CLASS_MASTER.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET NATURE *</label>
                  <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetNature} onChange={(e) => setFormData({ ...formData, assetNature: e.target.value as 'Linear' | 'Point' })}>
                    <option value="Linear">Linear</option>
                    <option value="Point">Point</option>
                  </select>
                </div>
              </div>

              {/* Integrated Point Assets Configuration Section for Editing */}
              {(formData.assetNature === 'Point' || (formData.assetNature as string) === 'POINT') && (
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    POINT ASSETS
                  </div>

                  {pointValidationErr && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={13} />
                      <span>{pointValidationErr}</span>
                    </div>
                  )}

                  {/* Existing Point Assets */}
                  {existingPointAssets.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px' }}>
                      {existingPointAssets.map((p) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                          <div>
                            <strong style={{ color: '#0F172A' }}>{p.pointAssetCode}</strong> — {p.pointAssetName} ({p.pointAssetType}) [Start: km {p.startChainage ?? p.locationChainage} | Length: {p.structureLengthMeters ?? 0}m | End: km {p.endChainage ?? (p.startChainage || p.locationChainage || 0)}]
                          </div>
                          <button type="button" onClick={() => handleDeleteExistingPoint(p.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Delete</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Point Asset Line */}
                  {(() => {
                    const pStartEdit = parseFloat(newPointItem.startChainage);
                    const pLenEdit = parseFloat(newPointItem.structureLengthMeters);
                    const derivedEndStrEdit = (!isNaN(pStartEdit) && !isNaN(pLenEdit) && pLenEdit > 0) ? (pStartEdit + (pLenEdit / 1000)).toFixed(3) : '';

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '110px 1.5fr 130px 100px 110px 100px 75px', gap: '8px', alignItems: 'center' }}>
                        <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Code (BR-27)" value={newPointItem.pointAssetCode} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetCode: e.target.value })} />
                        <input type="text" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Point Asset Name" value={newPointItem.pointAssetName} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetName: e.target.value })} />
                        <select className="input-field" style={{ height: '32px', fontSize: '12px' }} value={newPointItem.pointAssetType} onChange={(e) => setNewPointItem({ ...newPointItem, pointAssetType: e.target.value })}>
                          <option value="Bridge">Bridge</option>
                          <option value="Dam">Dam</option>
                          <option value="Pump Station">Pump Station</option>
                          <option value="Substation">Substation</option>
                          <option value="Tunnel">Tunnel</option>
                          <option value="Plant">Plant</option>
                        </select>
                        <input type="number" step="0.001" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Start (km)" value={newPointItem.startChainage} onChange={(e) => setNewPointItem({ ...newPointItem, startChainage: e.target.value })} />
                        <input type="number" step="1" className="input-field" style={{ height: '32px', fontSize: '12px' }} placeholder="Length (m)" value={newPointItem.structureLengthMeters} onChange={(e) => setNewPointItem({ ...newPointItem, structureLengthMeters: e.target.value })} />
                        <input type="text" readOnly className="input-field" style={{ height: '32px', fontSize: '12px', background: '#F1F5F9', fontWeight: 700, color: '#0F172A' }} placeholder="End (km)" value={derivedEndStrEdit} title="End Chainage derived automatically = Start + (Length / 1000)" />
                        <button type="button" onClick={handleAddPointItem} className="btn-secondary" style={{ height: '32px', padding: '0 8px', fontSize: '12px', fontWeight: 700 }}>+ Add</button>
                      </div>
                    );
                  })()}

                  {/* Draft List */}
                  {pointAssetItems.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      {pointAssetItems.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '12px' }}>
                          <div>
                            <strong style={{ color: '#2563EB' }}>[New] {p.pointAssetCode}</strong> — {p.pointAssetName} ({p.pointAssetType}) [Start: km {p.startChainage ?? p.locationChainage} | Length: {p.structureLengthMeters ?? 0}m | End: km {p.endChainage ?? (p.startChainage || p.locationChainage || 0)}]
                          </div>
                          <button type="button" onClick={() => handleRemovePointItem(idx)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>STATUS *</label>
                <select required className="input-field" style={{ marginTop: '3px', height: '34px', fontSize: '13px' }} value={formData.assetStatus} onChange={(e) => setFormData({ ...formData, assetStatus: e.target.value })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET DESCRIPTION</label>
                <textarea className="input-field" style={{ marginTop: '3px', minHeight: '56px', resize: 'vertical', fontSize: '13px' }} value={formData.assetDescription} onChange={(e) => setFormData({ ...formData, assetDescription: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setEditingAsset(null)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingAssetId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', padding: '20px 24px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Are you sure you want to delete this asset from the database? This action is permanent.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setDeletingAssetId(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleConfirmDelete} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Delete Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
