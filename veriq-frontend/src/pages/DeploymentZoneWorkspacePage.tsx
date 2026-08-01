import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, FolderKanban, Ruler, Edit3, Lock, Eye, Cpu, Radio, MapPin, ArrowRight } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';
import { deploymentZoneService } from '../services/deploymentZoneService';
import { useDeploymentZoneWorkspace } from '../hooks/useDeploymentZoneWorkspace';

export const DeploymentZoneWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [pointAssets, setPointAssets] = useState<PointAsset[]>([]);
  const [selectedPointAssetId, setSelectedPointAssetId] = useState<string>('');
  const [zoneCountInput, setZoneCountInput] = useState<number>(2);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [, setIsUnlockConfirmOpen] = useState<boolean>(false);

  const {
    zones,
    loading,
    saving,
    serverError,
    validationResults: _validationResults,
    isValidatedSuccess,
    loadExistingZones,
    generateZones,
    updateZoneRow,
    validateDesign,
    saveEngineeringDesign,
  } = useDeploymentZoneWorkspace();

  // Load all top-level Assets
  useEffect(() => {
    assetService.getAll().then((data) => {
      setAssets(data || []);
      const urlAssetId = searchParams.get('assetId');
      if (urlAssetId && data.some((a) => a.id === urlAssetId)) {
        setSelectedAssetId(urlAssetId);
      } else if (data && data.length > 0) {
        setSelectedAssetId(data[0].id);
      }
    }).catch(() => setAssets([]));
  }, [searchParams]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const isPointAsset = selectedAsset?.assetNature?.toUpperCase() === 'POINT';

  // Load Regions or Point Assets depending on selected Asset Nature
  useEffect(() => {
    if (selectedAssetId) {
      if (isPointAsset) {
        setRegions([]);
        setSelectedRegionId('');
        pointAssetService.getByAssetId(selectedAssetId).then((pData) => {
          setPointAssets(pData || []);
          if (pData && pData.length > 0) {
            setSelectedPointAssetId(pData[0].id);
          } else {
            setSelectedPointAssetId('');
          }
        }).catch(() => setPointAssets([]));
      } else {
        setPointAssets([]);
        setSelectedPointAssetId('');
        regionService.getByAssetId(selectedAssetId).then((rData) => {
          setRegions(rData || []);
          const urlRegionId = searchParams.get('regionId');
          if (urlRegionId && rData.some((r) => r.id === urlRegionId)) {
            setSelectedRegionId(urlRegionId);
          } else if (rData && rData.length > 0) {
            setSelectedRegionId(rData[0].id || '');
          } else {
            setSelectedRegionId('');
          }
        }).catch(() => setRegions([]));
      }
    }
  }, [selectedAssetId, isPointAsset, searchParams]);

  // Load Deployment Zones for selected Region or Point Asset
  useEffect(() => {
    if (isPointAsset && selectedPointAssetId) {
      setSaveSuccessMsg(null);
      deploymentZoneService.getByAssetId(selectedPointAssetId).then((data) => {
        if (data && data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
          const pointObj = pointAssets.find((p) => p.id === selectedPointAssetId);
          const ptStart = pointObj?.startChainage !== undefined ? Number(pointObj.startChainage) : Number(pointObj?.locationChainage || 0);
          const ptLenM = pointObj?.structureLengthMeters !== undefined ? Number(pointObj.structureLengthMeters) : 0;
          const ptEnd = pointObj?.endChainage !== undefined ? Number(pointObj.endChainage) : (ptStart + (ptLenM / 1000));

          generateZones(1, ptStart, ptEnd);
          if (pointObj) {
            updateZoneRow(0, 'zoneName', `${pointObj.pointAssetName} Main Zone`);
            updateZoneRow(0, 'zoneCode', 'PZ-01');
          }
        }
      });
    } else if (!isPointAsset && selectedRegionId) {
      setSaveSuccessMsg(null);
      loadExistingZones(selectedRegionId).then((data) => {
        if (data && data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [selectedAssetId, selectedRegionId, selectedPointAssetId, isPointAsset, pointAssets, loadExistingZones]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPointAsset = pointAssets.find((p) => p.id === selectedPointAssetId);

  const handleGenerate = () => {
    const start = !isPointAsset && selectedRegion
      ? (selectedRegion.startChainage || 0)
      : (selectedPointAsset?.startChainage !== undefined ? Number(selectedPointAsset.startChainage) : Number(selectedPointAsset?.locationChainage || 0));
    const end = !isPointAsset && selectedRegion
      ? (selectedRegion.endChainage || 0)
      : (selectedPointAsset?.endChainage !== undefined ? Number(selectedPointAsset.endChainage) : (start + ((selectedPointAsset?.structureLengthMeters || 0) / 1000)));
    generateZones(zoneCountInput, start, end);
    setSaveSuccessMsg(null);
  };

  const handleValidate = () => {
    const ptStart = selectedPointAsset?.startChainage !== undefined ? Number(selectedPointAsset.startChainage) : Number(selectedPointAsset?.locationChainage || 0);
    const ptEnd = selectedPointAsset?.endChainage !== undefined ? Number(selectedPointAsset.endChainage) : (ptStart + ((selectedPointAsset?.structureLengthMeters || 0) / 1000));
    const ptLenKm = (selectedPointAsset?.structureLengthMeters || 0) / 1000;

    const reg = !isPointAsset && selectedRegion
      ? selectedRegion
      : { id: selectedPointAssetId, startChainage: ptStart, endChainage: ptEnd, regionLength: ptLenKm } as any;
    validateDesign(reg);
  };

  const handleSave = async () => {
    if (!isValidatedSuccess) return;
    try {
      const targetId = !isPointAsset && selectedRegion ? (selectedRegion.id || '') : selectedPointAssetId;
      await saveEngineeringDesign(targetId);
      setSaveSuccessMsg('Deployment Zone engineering design successfully validated and saved!');
      setIsSaved(true);
      setIsTableExpanded(true);
    } catch {
      // serverError handled in hook
    }
  };

  const isReadyToDisplay = isPointAsset ? (selectedAsset && selectedPointAsset) : (selectedAsset && selectedRegion);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Design</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Deployment Designer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Deployment Zone Workspace</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: isSaved ? '#F0FDF4' : '#EFF6FF',
              color: isSaved ? '#166534' : '#1E40AF',
              border: isSaved ? '1px solid #BBF7D0' : '1px solid #BFDBFE'
            }}>
              {isSaved ? 'SAVED ARTIFACT (READ ONLY)' : 'EDIT MODE'}
            </span>
          </div>
        </div>

        {/* Target Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 1. ASSET SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '220px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>
                  {ast.assetName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. SECONDARY SELECTOR: REGION (Linear) vs POINT ASSET (Point) */}
          {isPointAsset ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>POINT ASSET:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '240px' }}
                value={selectedPointAssetId}
                onChange={(e) => setSelectedPointAssetId(e.target.value)}
              >
                {pointAssets.map((p) => (
                  <option key={p.id} value={p.id}>{p.pointAssetName} ({p.pointAssetType})</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>REGION:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '220px' }}
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.regionName} ({r.regionCode})</option>
                ))}
              </select>
            </div>
          )}

          {isSaved && zones.length > 0 && (
            <button
              onClick={() => setIsUnlockConfirmOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
              title="Unlock Deployment Zone Design for modification"
            >
              <Edit3 size={14} color="#2563EB" />
              <span>Edit Design</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Workspace */}
      {isReadyToDisplay && (
        <>
          {/* Header Summary Metadata Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>PROJECT</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderKanban size={14} color="#2563EB" />
                <span>{selectedAsset?.projectName || 'Project'}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#2563EB" />
                <span>{selectedAsset?.assetName}</span>
              </div>
            </div>
            
            {isPointAsset ? (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>POINT INFRASTRUCTURE OBJECT</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" />
                  <span>{selectedPointAsset?.pointAssetName} ({selectedPointAsset?.pointAssetType})</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color="#2563EB" />
                  <span>{selectedRegion?.regionName} ({selectedRegion?.regionCode})</span>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>
                {isPointAsset ? 'POINT ENGINEERING SPAN' : 'REGION LENGTH'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>
                  {isPointAsset
                    ? `km ${selectedPointAsset?.startChainage ?? selectedPointAsset?.locationChainage ?? '0.000'} → ${selectedPointAsset?.endChainage ?? '0.000'} (${selectedPointAsset?.structureLengthMeters ?? 0} m)`
                    : `km ${selectedRegion?.startChainage} → ${selectedRegion?.endChainage} (${selectedRegion?.regionLength} km)`}
                </span>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>DEPLOYMENT ZONES</div>
              <button
                onClick={() => setIsTableExpanded((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '2px',
                  padding: '2px 10px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '4px',
                  color: '#1E40AF',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 100ms ease'
                }}
                title="Click to view Deployment Zone table"
              >
                <span>{zones.length}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* EDIT MODE Action Toolbar */}
          {!isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>NUMBER OF ZONES:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  style={{ width: '70px', height: '34px', fontSize: '13px', textAlign: 'center' }}
                  value={zoneCountInput}
                  onChange={(e) => setZoneCountInput(parseInt(e.target.value) || 1)}
                />
                <button onClick={handleGenerate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <Radio size={14} color="#2563EB" />
                  <span>Generate Zones</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <ShieldCheck size={15} color="#2563EB" />
                  <span>Validate Design</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isValidatedSuccess || saving}
                  className="btn-primary"
                  style={{
                    padding: '6px 16px',
                    fontSize: '13px',
                    opacity: isValidatedSuccess && !saving ? 1 : 0.5,
                    cursor: isValidatedSuccess && !saving ? 'pointer' : 'not-allowed',
                  }}
                  title={isValidatedSuccess ? 'Save Validated Engineering Design' : 'Run validation successfully to enable save'}
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Save Engineering Design'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SAVED MODE: Enterprise Next Stage CTA Banner */}
          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#166534" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>DEPLOYMENT ZONE ARTIFACT PUBLISHED</div>
                  <div style={{ fontSize: '12px', color: '#15803D' }}>Zone segmentation verified. Ready for Engineering Node Generation & Spacing Design.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const queryParams = new URLSearchParams();
                  if (selectedAssetId) queryParams.set('assetId', selectedAssetId);
                  if (isPointAsset && selectedPointAssetId) queryParams.set('pointAssetId', selectedPointAssetId);
                  if (!isPointAsset && selectedRegionId) queryParams.set('regionId', selectedRegionId);
                  if (zones.length > 0) queryParams.set('zoneId', (zones[0] as any).id || zones[0].zoneCode || '');
                  
                  navigate(`/config/nodes?${queryParams.toString()}`);
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px', background: '#166534', borderColor: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Proceed to Engineering Nodes</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {serverError && (
            <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          {saveSuccessMsg && (
            <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Deployment Zone Table */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaved ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                  <span>{isSaved ? 'SAVED DEPLOYMENT ZONE ARTIFACT (READ ONLY)' : 'DEPLOYMENT ZONE SEGMENTATION GRID (EDITABLE)'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {isSaved ? 'Click "Edit Design" to unlock' : 'Configure priorities and node spacings, then click Validate Design'}
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading deployment zone design from database...</div>
              ) : (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>ZONE ID</th>
                      <th style={{ width: '22%' }}>ZONE NAME</th>
                      <th style={{ width: '14%' }}>PRIORITY</th>
                      <th style={{ width: '15%' }}>START (km)</th>
                      <th style={{ width: '15%' }}>END (km)</th>
                      <th style={{ width: '8%' }}>LENGTH</th>
                      <th style={{ width: '10%' }}>SPACING (m)</th>
                      <th style={{ width: '6%', textAlign: 'center' }}>NODES</th>
                      <th style={{ width: '0%', textAlign: 'right' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', fontWeight: 700, color: '#1F2937' }}>
                            {row.zoneCode}
                          </span>
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="text"
                              className="input-field"
                              style={{ height: '32px', fontSize: '13px', fontWeight: 500 }}
                              value={row.zoneName}
                              onChange={(e) => updateZoneRow(idx, 'zoneName', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>{row.zoneName}</span>
                          )}
                        </td>
                        <td>
                          {!isSaved ? (
                            <select
                              className="input-field"
                              style={{ height: '32px', fontSize: '12px' }}
                              value={row.priority}
                              onChange={(e) => updateZoneRow(idx, 'priority', e.target.value)}
                            >
                              <option value="Very High">Very High (100m)</option>
                              <option value="High">High (200m)</option>
                              <option value="Medium">Medium (500m)</option>
                              <option value="Low">Low (1000m)</option>
                            </select>
                          ) : (
                            <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                              {row.priority}
                            </span>
                          )}
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="number"
                              step="0.001"
                              className="input-field"
                              style={{ height: '32px', fontSize: '13px' }}
                              value={row.startChainage}
                              onChange={(e) => updateZoneRow(idx, 'startChainage', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', fontFamily: 'var(--font-code)', color: '#374151' }}>{row.startChainage}</span>
                          )}
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="number"
                              step="0.001"
                              className="input-field"
                              style={{ height: '32px', fontSize: '13px' }}
                              value={row.endChainage}
                              onChange={(e) => updateZoneRow(idx, 'endChainage', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', fontFamily: 'var(--font-code)', color: '#374151' }}>{row.endChainage}</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 600, color: '#1F2937' }}>
                            {row.length.toFixed(3)}
                          </span>
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="number"
                              step="1"
                              className="input-field"
                              style={{ height: '32px', fontSize: '13px' }}
                              value={row.nodeSpacing}
                              onChange={(e) => updateZoneRow(idx, 'nodeSpacing', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '12px', fontFamily: 'var(--font-code)', color: '#1F2937', fontWeight: 600 }}>{row.nodeSpacing} m</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                            {row.totalNodes}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${row.status === 'VALIDATED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.status === 'VALIDATED' ? '#F0FDF4' : '#FFFBEB', color: row.status === 'VALIDATED' ? '#166534' : '#B45309' }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {zones.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                          No deployment zones generated yet. Specify zone count above and click "Generate Zones".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
