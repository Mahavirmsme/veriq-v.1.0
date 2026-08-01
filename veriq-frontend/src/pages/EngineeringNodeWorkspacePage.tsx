import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, Ruler, Edit3, Lock, Eye, Cpu, Radio, MapPin, Cpu as NodeIcon, ArrowRight } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { useEngineeringNodeWorkspace } from '../hooks/useEngineeringNodeWorkspace';

export const EngineeringNodeWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [pointAssets, setPointAssets] = useState<PointAsset[]>([]);
  const [selectedPointAssetId, setSelectedPointAssetId] = useState<string>('');
  const [zones, setZones] = useState<DeploymentZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [editableNodeSpacing, setEditableNodeSpacing] = useState<number>(200);

  // Single Source of Truth State: isSaved controls READ ONLY vs EDIT mode
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [, setIsUnlockConfirmOpen] = useState<boolean>(false);

  const {
    nodes,
    loading,
    saving,
    serverError,
    validationResults: _validationResults,
    isValidatedSuccess,
    loadExistingNodes,
    generateNodes,
    validateDesign,
    saveEngineeringDesign,
  } = useEngineeringNodeWorkspace();

  // Load all top-level Assets (both LINEAR and POINT)
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

  // Load Regions or Point Assets depending on Asset Nature
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
      deploymentZoneService.getByAssetId(selectedPointAssetId).then((zData) => {
        const pointAssetObj = pointAssets.find((p) => p.id === selectedPointAssetId);
        const validZones = (zData && zData.length > 0) ? zData : [
          {
            id: `z-point-${selectedPointAssetId}`,
            zoneCode: 'PZ-01',
            zoneName: `${pointAssetObj?.pointAssetName || 'Point Infrastructure'} Main Zone`,
            priority: 'High',
            startChainage: 0,
            endChainage: 1,
            zoneLength: 1,
            nodeSpacing: 100,
            totalNodes: 5,
            zoneStatus: 'VALIDATED'
          }
        ];
        setZones(validZones);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && validZones.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (validZones.length > 0) {
          setSelectedZoneId(validZones[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => {
        const pointAssetObj = pointAssets.find((p) => p.id === selectedPointAssetId);
        const fallbackZones = [
          {
            id: `z-point-${selectedPointAssetId}`,
            zoneCode: 'PZ-01',
            zoneName: `${pointAssetObj?.pointAssetName || 'Point Infrastructure'} Main Zone`,
            priority: 'High',
            startChainage: 0,
            endChainage: 1,
            zoneLength: 1,
            nodeSpacing: 100,
            totalNodes: 5,
            zoneStatus: 'VALIDATED'
          }
        ];
        setZones(fallbackZones);
        setSelectedZoneId(fallbackZones[0].id);
      });
    } else if (!isPointAsset && selectedRegionId) {
      deploymentZoneService.getByRegionId(selectedRegionId).then((zData) => {
        setZones(zData || []);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && zData.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (zData && zData.length > 0) {
          setSelectedZoneId(zData[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => setZones([]));
    }
  }, [selectedAssetId, selectedRegionId, selectedPointAssetId, isPointAsset, pointAssets, searchParams]);

  // Synchronize editableNodeSpacing with selectedZone recommendation
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPointAsset = pointAssets.find((p) => p.id === selectedPointAssetId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  useEffect(() => {
    if (selectedZone && selectedZone.nodeSpacing) {
      setEditableNodeSpacing(Number(selectedZone.nodeSpacing));
    }
  }, [selectedZoneId, selectedZone?.nodeSpacing]);

  // Load persisted Engineering Nodes whenever selectedZoneId changes
  useEffect(() => {
    if (selectedZoneId) {
      setSaveSuccessMsg(null);
      loadExistingNodes(selectedZoneId).then((data) => {
        if (data && data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [selectedZoneId, loadExistingNodes]);

  const handleGenerate = () => {
    if (!selectedZone) return;
    const spacing = Number(editableNodeSpacing);
    if (isNaN(spacing) || spacing <= 0) {
      alert('Node spacing must be greater than zero meters.');
      return;
    }
    const start = selectedZone.startChainage || 0;
    const end = selectedZone.endChainage || 0;
    generateNodes(start, end, spacing);
    setSaveSuccessMsg(null);
  };

  const handleResetSpacing = () => {
    if (selectedZone && selectedZone.nodeSpacing) {
      setEditableNodeSpacing(Number(selectedZone.nodeSpacing));
    }
  };

  const handleValidate = () => {
    if (!selectedZone) return;
    validateDesign(selectedZone);
  };

  const handleSave = async () => {
    if (!selectedZone || !isValidatedSuccess) return;
    try {
      await saveEngineeringDesign(selectedZone.id || '');
      setSaveSuccessMsg('Engineering Node design successfully validated and saved as permanent Engineering Artifact!');
      setIsSaved(true);
      setIsTableExpanded(true);
    } catch {
      // serverError handled in hook
    }
  };

  const isReadyToDisplay = isPointAsset 
    ? (selectedAsset && selectedPointAsset && selectedZone)
    : (selectedAsset && selectedRegion && selectedZone);

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
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Node Designer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Engineering Node Workspace</h1>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 1. ASSET SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '200px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

          {/* 2. DYNAMIC SECONDARY SELECTOR: REGION (Linear) vs POINT ASSET (Point) */}
          {isPointAsset ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>POINT ASSET:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '220px' }}
                value={selectedPointAssetId}
                onChange={(e) => setSelectedPointAssetId(e.target.value)}
              >
                {pointAssets.map((p) => (
                  <option key={p.id} value={p.id}>{p.pointAssetName} ({p.pointAssetType})</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>REGION:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '180px' }}
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.regionCode}</option>
                ))}
              </select>
            </div>
          )}

          {/* 3. DEPLOYMENT ZONE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ZONE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '200px' }}
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.zoneCode} — {z.zoneName}</option>
              ))}
            </select>
          </div>

          {isSaved && selectedZone && nodes.length > 0 && (
            <button
              onClick={() => setIsUnlockConfirmOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
              title="Unlock Engineering Node Design for modification"
            >
              <Edit3 size={14} color="#2563EB" />
              <span>Edit Design</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Workspace */}
      {isReadyToDisplay && selectedZone && (
        <>
          {/* Header Summary Metadata Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#2563EB" />
                <span>{selectedAsset?.assetName}</span>
              </div>
            </div>
            
            {isPointAsset ? (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>POINT INFRASTRUCTURE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" />
                  <span>{selectedPointAsset?.pointAssetName}</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color="#2563EB" />
                  <span>{selectedRegion?.regionCode}</span>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>DEPLOYMENT ZONE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#2563EB" />
                <span>{selectedZone.zoneName} ({selectedZone.zoneCode})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ZONE BOUNDS & LENGTH</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>{selectedZone.startChainage} → {selectedZone.endChainage} ({selectedZone.zoneLength} km)</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>NODE SPACING</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', marginTop: '2px' }}>
                {selectedZone.nodeSpacing} meters ({selectedZone.priority})
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>ENGINEERING NODES</div>
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
                title="Click to view Engineering Node grid table"
              >
                <span>{nodes.length}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* EDIT MODE Action Toolbar */}
          {!isSaved && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', padding: '14px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              {/* Audit Trail Banner if Override Applied */}
              {selectedZone && Number(editableNodeSpacing) !== Number(selectedZone.nodeSpacing) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#92400E',
                  fontWeight: 700
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={14} color="#D97706" />
                    <span>Engineering Override Applied • Recommended: {selectedZone.nodeSpacing}m ({selectedZone.priority} Risk) • Approved: {editableNodeSpacing}m</span>
                  </div>
                  <button
                    onClick={handleResetSpacing}
                    style={{
                      background: 'transparent',
                      border: '1px solid #F59E0B',
                      color: '#B45309',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Reset to Recommended
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>RECOMMENDED:</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1F2937' }}>
                      {selectedZone.nodeSpacing}m ({selectedZone.priority})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>NODE SPACING:</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ width: '85px', height: '32px', fontSize: '12px', fontWeight: 700 }}
                      value={editableNodeSpacing}
                      onChange={(e) => setEditableNodeSpacing(Number(e.target.value))}
                      min={1}
                      step={10}
                    />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>meters</span>
                  </div>

                  {Number(editableNodeSpacing) !== Number(selectedZone.nodeSpacing) && (
                    <button
                      onClick={handleResetSpacing}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', height: '32px' }}
                      title="Reset node spacing to zone recommendation"
                    >
                      Reset to Recommended
                    </button>
                  )}

                  <button onClick={handleGenerate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', height: '32px' }}>
                    <NodeIcon size={14} color="#2563EB" />
                    <span>Generate Nodes ({editableNodeSpacing}m Spacing)</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', height: '32px' }}>
                    <ShieldCheck size={15} color="#2563EB" />
                    <span>Validate Engineering Design</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!isValidatedSuccess || saving}
                    className="btn-primary"
                    style={{
                      padding: '6px 16px',
                      fontSize: '13px',
                      height: '32px',
                      opacity: isValidatedSuccess && !saving ? 1 : 0.5,
                      cursor: isValidatedSuccess && !saving ? 'pointer' : 'not-allowed',
                    }}
                    title={isValidatedSuccess ? 'Save Validated Engineering Node Design' : 'Run validation successfully to enable save'}
                  >
                    <Save size={15} />
                    <span>{saving ? 'Saving...' : 'Save Engineering Design'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVED MODE: Enterprise Next Stage CTA Banner */}
          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#166534" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>ENGINEERING NODE ARTIFACT PUBLISHED</div>
                  <div style={{ fontSize: '12px', color: '#15803D' }}>Nodes generated and validated. Ready for Sensor Package Specification.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const queryParams = new URLSearchParams();
                  if (selectedAssetId) queryParams.set('assetId', selectedAssetId);
                  if (isPointAsset && selectedPointAssetId) queryParams.set('pointAssetId', selectedPointAssetId);
                  if (!isPointAsset && selectedRegionId) queryParams.set('regionId', selectedRegionId);
                  if (selectedZoneId) queryParams.set('zoneId', selectedZoneId);
                  if (nodes.length > 0) queryParams.set('nodeId', (nodes[0] as any).id || nodes[0].nodeCode || '');
                  
                  navigate(`/config/sensors?${queryParams.toString()}`);
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px', background: '#166534', borderColor: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Proceed to Sensor Packages</span>
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

          {/* Engineering Node Table */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaved ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                  <span>{isSaved ? 'SAVED ENGINEERING NODE ARTIFACT (READ ONLY)' : 'SYSTEM GENERATED ENGINEERING NODE GRID'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {isSaved ? 'Click "Edit Design" to unlock and regenerate' : 'Click Validate Engineering Design to verify node sequence'}
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading engineering node design from database...</div>
              ) : (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>NODE ID</th>
                      <th style={{ width: '12%' }}>NODE NUMBER</th>
                      <th style={{ width: '18%' }}>CHAINAGE (km)</th>
                      <th style={{ width: '18%' }}>FORMATTED CHAINAGE</th>
                      <th style={{ width: '15%' }}>DEPLOYMENT ZONE</th>
                      <th style={{ width: '12%' }}>{isPointAsset ? 'POINT INFRASTRUCTURE' : 'REGION'}</th>
                      <th style={{ width: '13%', textAlign: 'right' }}>ENGINEERING STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', fontWeight: 700, color: '#1F2937' }}>
                            {row.nodeCode}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>
                            #{row.nodeNumber}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', fontFamily: 'var(--font-code)', color: '#374151' }}>
                            {row.chainage.toFixed(3)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-code)', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                            km {row.formattedChainage}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#4B5563' }}>
                            {selectedZone.zoneName} ({selectedZone.zoneCode})
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#4B5563' }}>
                            {isPointAsset ? (selectedPointAsset?.pointAssetName || 'Point Asset') : (selectedRegion?.regionCode || 'Region')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${row.engineeringStatus === 'SAVED' || row.engineeringStatus === 'VALIDATED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.engineeringStatus === 'SAVED' ? '#F0FDF4' : row.engineeringStatus === 'VALIDATED' ? '#EFF6FF' : '#FFFBEB', color: row.engineeringStatus === 'SAVED' ? '#166534' : row.engineeringStatus === 'VALIDATED' ? '#1E40AF' : '#B45309' }}>
                            {row.engineeringStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {nodes.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                          No engineering nodes generated yet. Click "Generate Nodes" above.
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
