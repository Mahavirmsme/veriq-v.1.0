import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, FolderKanban, Ruler, Info, Edit3, Lock, Eye, Cpu, Radio, GitCommit, Activity, Plus, Trash2, Search } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../services/engineeringNodeService';
import { SENSOR_MASTER_LIST, sensorPackageService } from '../services/sensorPackageService';
import { useSensorPackageWorkspace } from '../hooks/useSensorPackageWorkspace';

export const SensorPackageWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [zones, setZones] = useState<DeploymentZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [nodes, setNodes] = useState<EngineeringNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  const [selectedTypeInput, setSelectedTypeInput] = useState<string>(SENSOR_MASTER_LIST[0].type);
  const [customTypeInput, setCustomTypeInput] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Single Source of Truth State: isSaved controls READ ONLY vs EDIT mode
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [isUnlockConfirmOpen, setIsUnlockConfirmOpen] = useState<boolean>(false);

  const {
    items,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingPackage,
    addSensorType,
    removeSensorRow,
    updateSensorRow,
    validateDesign,
    saveEngineeringDesign,
  } = useSensorPackageWorkspace();

  // Load linear assets
  useEffect(() => {
    assetService.getAll().then((data) => {
      const linears = data.filter((a) => a.assetNature === 'Linear');
      setAssets(linears);
      const urlAssetId = searchParams.get('assetId');
      if (urlAssetId && linears.some((a) => a.id === urlAssetId)) {
        setSelectedAssetId(urlAssetId);
      } else if (linears.length > 0) {
        setSelectedAssetId(linears[0].id);
      }
    }).catch(() => setAssets([]));
  }, [searchParams]);

  // Load regions
  useEffect(() => {
    if (selectedAssetId) {
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
  }, [selectedAssetId, searchParams]);

  // Load zones
  useEffect(() => {
    if (selectedRegionId) {
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
  }, [selectedRegionId, searchParams]);

  // Load nodes
  useEffect(() => {
    if (selectedZoneId) {
      engineeringNodeService.getByDeploymentZoneId(selectedZoneId).then((nData) => {
        setNodes(nData || []);
        const urlNodeId = searchParams.get('nodeId');
        if (urlNodeId && nData.some((n) => n.id === urlNodeId)) {
          setSelectedNodeId(urlNodeId);
        } else if (nData && nData.length > 0) {
          setSelectedNodeId(nData[0].id || '');
        } else {
          setSelectedNodeId('');
        }
      }).catch(() => setNodes([]));
    }
  }, [selectedZoneId, searchParams]);

  // Load persisted Sensor Package whenever selectedNodeId changes
  useEffect(() => {
    if (selectedNodeId) {
      setSaveSuccessMsg(null);
      loadExistingPackage(selectedNodeId).then((data) => {
        if (data && data.items && data.items.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [selectedNodeId, loadExistingPackage]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleAddSensor = () => {
    if (selectedTypeInput === 'Custom Sensor') {
      if (customTypeInput.trim()) {
        addSensorType(customTypeInput.trim());
        setCustomTypeInput('');
      }
    } else {
      addSensorType(selectedTypeInput);
    }
  };

  const handleValidate = () => {
    validateDesign();
  };

  const handleSave = async () => {
    if (!selectedNode || !isValidatedSuccess) return;
    try {
      await saveEngineeringDesign(selectedNode.id || '');
      setSaveSuccessMsg('Sensor Package engineering design successfully validated and saved as permanent Engineering Artifact!');
      setIsSaved(true);
      setIsTableExpanded(true);
    } catch {
      // serverError handled in hook
    }
  };

  const handleConfirmUnlock = () => {
    setIsUnlockConfirmOpen(false);
    setIsSaved(false);
    setSaveSuccessMsg(null);
  };

  const filteredMasterList = SENSOR_MASTER_LIST.filter((m) =>
    m.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.parameter.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalSensorCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar (Platform > Engineering Design > Sensor Designer) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Design</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Sensor Designer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Sensor Package Workspace</h1>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '140px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>REGION:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '120px' }}
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.regionCode}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ZONE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '130px' }}
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.zoneCode}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>NODE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '140px' }}
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.nodeCode} (#{n.nodeNumber})</option>
              ))}
            </select>
          </div>

          {isSaved && selectedNode && items.length > 0 && (
            <button
              onClick={() => setIsUnlockConfirmOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
              title="Unlock Sensor Package Design for modification"
            >
              <Edit3 size={14} color="#2563EB" />
              <span>Edit Package</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning if no saved nodes exist for target zone */}
      {selectedZone && nodes.length === 0 && (
        <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#92400E' }}>
          <Info size={20} color="#D97706" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>No Engineering Nodes Defined for Zone</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>
              Sensor Package design requires saved Engineering Node definitions. Please open the <b>Node Designer</b> and save an engineering node design for <b>{selectedZone.zoneName}</b> first.
            </div>
          </div>
        </div>
      )}

      {/* Active Workspace */}
      {selectedAsset && selectedRegion && selectedZone && selectedNode && (
        <>
          {/* Header Summary Metadata Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>PROJECT / ASSET</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderKanban size={14} color="#2563EB" />
                <span>{selectedAsset.assetName}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION / ZONE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#2563EB" />
                <span>{selectedRegion.regionCode} / {selectedZone.zoneCode}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ENGINEERING NODE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitCommit size={14} color="#2563EB" />
                <span>{selectedNode.nodeCode} (#{selectedNode.nodeNumber})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>CHAINAGE LOCATION</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>km {selectedNode.formattedChainage || selectedNode.chainage}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>SENSOR TYPES</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', marginTop: '2px' }}>
                {items.length} Types
              </div>
            </div>
            
            {/* Clickable TOTAL SENSOR COUNT attribute */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>TOTAL SENSORS</div>
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
                title="Click to view Sensor Package table"
              >
                <span>{totalSensorCount}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* EDIT MODE Action Toolbar (Searchable Multi-Select / Add Sensor Types) */}
          {!isSaved && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#FFFFFF', padding: '14px 18px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={16} color="#2563EB" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>ADD SENSOR TO PACKAGE</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
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
                      opacity: isValidatedSuccess && !saving ? 1 : 0.5,
                      cursor: isValidatedSuccess && !saving ? 'pointer' : 'not-allowed',
                    }}
                    title={isValidatedSuccess ? 'Save Validated Sensor Package Design' : 'Run validation successfully to enable save'}
                  >
                    <Save size={15} />
                    <span>{saving ? 'Saving...' : 'Save Engineering Design'}</span>
                  </button>
                </div>
              </div>

              {/* Searchable Dropdown & Add Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search sensor types..."
                    className="input-field"
                    style={{ paddingLeft: '30px', height: '34px', fontSize: '12px' }}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>

                <select
                  className="input-field"
                  style={{ height: '34px', fontSize: '12px', flex: 1 }}
                  value={selectedTypeInput}
                  onChange={(e) => setSelectedTypeInput(e.target.value)}
                >
                  {filteredMasterList.map((m) => (
                    <option key={m.type} value={m.type}>
                      [{m.category}] {m.type} — ({m.parameter})
                    </option>
                  ))}
                </select>

                {selectedTypeInput === 'Custom Sensor' && (
                  <input
                    type="text"
                    placeholder="Enter Custom Sensor Name"
                    className="input-field"
                    style={{ height: '34px', fontSize: '12px', width: '220px' }}
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value)}
                  />
                )}

                <button onClick={handleAddSensor} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}>
                  <Plus size={15} color="#2563EB" />
                  <span>Add Sensor Type</span>
                </button>
              </div>
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

          {/* Sensor Package Table */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaved ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                  <span>{isSaved ? 'SAVED SENSOR PACKAGE ARTIFACT (READ ONLY)' : 'SENSOR PACKAGE INSTRUMENTATION GRID'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {isSaved ? 'Click "Edit Package" to unlock' : 'Specify quantities & engineering purpose, then click Validate Engineering Design'}
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading sensor package design from database...</div>
              ) : (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>SENSOR TYPE</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>QUANTITY</th>
                      <th style={{ width: '25%' }}>MEASUREMENT PARAMETER</th>
                      <th style={{ width: '28%' }}>ENGINEERING PURPOSE</th>
                      <th style={{ width: '10%', textAlign: 'right' }}>STATUS</th>
                      {!isSaved && <th style={{ width: '5%', textAlign: 'right' }}>ACTION</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Activity size={14} color="#2563EB" />
                            <span>{row.sensorType}</span>
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {!isSaved ? (
                            <input
                              type="number"
                              min="1"
                              max="100"
                              className="input-field"
                              style={{ width: '60px', height: '30px', fontSize: '13px', textAlign: 'center', fontWeight: 700 }}
                              value={row.quantity}
                              onChange={(e) => updateSensorRow(idx, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          ) : (
                            <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                              ×{row.quantity}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#4B5563', fontStyle: 'italic' }}>
                            {row.measurementParameter}
                          </span>
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="text"
                              className="input-field"
                              style={{ height: '30px', fontSize: '12px' }}
                              value={row.engineeringPurpose}
                              onChange={(e) => updateSensorRow(idx, 'engineeringPurpose', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '12px', color: '#1F2937' }}>{row.engineeringPurpose}</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${row.status === 'VALIDATED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.status === 'VALIDATED' ? '#F0FDF4' : '#FFFBEB', color: row.status === 'VALIDATED' ? '#166534' : '#B45309' }}>
                            {row.status}
                          </span>
                        </td>
                        {!isSaved && (
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => removeSensorRow(idx)} className="btn-danger" style={{ padding: '4px 6px', fontSize: '11px' }} title="Remove Sensor">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={isSaved ? 5 : 6} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                          No sensor types added yet. Select a sensor type above and click "Add Sensor Type".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Validation Report Panel (EDIT MODE ONLY) */}
          {!isSaved && validationResults.length > 0 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color={isValidatedSuccess ? '#16A34A' : '#DC2626'} />
                  <span>SENSOR PACKAGE VALIDATION ENGINE REPORT</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: isValidatedSuccess ? '#F0FDF4' : '#FEF2F2', color: isValidatedSuccess ? '#166534' : '#991B1B', border: isValidatedSuccess ? '1px solid #BBF7D0' : '1px solid #FECACA' }}>
                  {isValidatedSuccess ? 'VALIDATION SUCCESS - SAVE BUTTON ENABLED' : 'VALIDATION ERRORS DETECTED'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {validationResults.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '8px 12px', borderRadius: '6px', background: item.severity === 'SUCCESS' ? '#F0FDF4' : '#FEF2F2', border: item.severity === 'SUCCESS' ? '1px solid #BBF7D0' : '1px solid #FECACA' }}>
                    {item.severity === 'SUCCESS' ? <CheckCircle2 size={16} color="#166534" /> : <AlertTriangle size={16} color="#991B1B" />}
                    <span style={{ fontWeight: 600, color: item.severity === 'SUCCESS' ? '#166534' : '#991B1B' }}>[{item.rule}]</span>
                    <span style={{ color: item.severity === 'SUCCESS' ? '#166534' : '#991B1B' }}>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlock Confirmation Dialog */}
          {isUnlockConfirmOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '440px', padding: '24px 28px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#D97706" />
                  <span>Unlock Sensor Package Design</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '20px', lineHeight: '1.5' }}>
                  This will unlock the Sensor Package Engineering Design for modification. You will need to re-validate engineering rules before saving changes.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => setIsUnlockConfirmOpen(false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Cancel</button>
                  <button onClick={handleConfirmUnlock} className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Continue</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
