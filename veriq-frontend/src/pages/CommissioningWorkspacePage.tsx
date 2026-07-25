import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, FolderKanban, Ruler, Info, Lock, Eye, Cpu, Radio, GitCommit, Activity, Play, CheckSquare } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../services/engineeringNodeService';
import { useCommissioningWorkspace } from '../hooks/useCommissioningWorkspace';

export const CommissioningWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [zones, setZones] = useState<DeploymentZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [nodes, setNodes] = useState<EngineeringNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);

  const {
    record,
    sensorPackage,
    gridRows,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadCommissioningState,
    startCommissioningProcess,
    updateCommissionedQty,
    validateAcceptance,
    completeCommissioningProcess,
  } = useCommissioningWorkspace();

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

  // Load commissioning state whenever selectedNodeId changes
  useEffect(() => {
    if (selectedNodeId) {
      setSaveSuccessMsg(null);
      loadCommissioningState(selectedNodeId);
    }
  }, [selectedNodeId, loadCommissioningState]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const isCommissioned = record?.status === 'COMMISSIONED';

  const handleStartCommissioning = () => {
    if (!selectedNode) return;
    startCommissioningProcess(selectedNode.id || '');
  };

  const handleValidate = () => {
    validateAcceptance();
  };

  const handleComplete = async () => {
    if (!selectedNode || !isValidatedSuccess) return;
    try {
      await completeCommissioningProcess(selectedNode.id || '', remarksInput);
      setSaveSuccessMsg('Commissioning process completed successfully! Runtime Sensors generated and persisted to database.');
    } catch {
      // serverError handled in hook
    }
  };

  const totalRuntimeSensorsCount = record?.runtimeSensors ? record.runtimeSensors.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar (Platform > Delivery > Commissioning & Ops) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Delivery</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Commissioning & Ops</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Commissioning Workspace</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: isCommissioned ? '#F0FDF4' : record?.status === 'IN_PROGRESS' ? '#EFF6FF' : '#FEF3C7',
              color: isCommissioned ? '#166534' : record?.status === 'IN_PROGRESS' ? '#1E40AF' : '#92400E',
              border: isCommissioned ? '1px solid #BBF7D0' : record?.status === 'IN_PROGRESS' ? '1px solid #BFDBFE' : '1px solid #FDE68A'
            }}>
              {isCommissioned ? 'COMMISSIONED (READ ONLY)' : record?.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'NOT STARTED'}
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
        </div>
      </div>

      {/* Warning if no saved sensor package exists for target node */}
      {selectedNode && !sensorPackage && (
        <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#92400E' }}>
          <Info size={20} color="#D97706" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>No Sensor Package Defined for Node</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>
              Commissioning requires an approved Sensor Package design. Please open the <b>Sensor Designer</b> and save an engineering design for <b>{selectedNode.nodeCode}</b> first.
            </div>
          </div>
        </div>
      )}

      {/* Active Workspace */}
      {selectedAsset && selectedRegion && selectedZone && selectedNode && sensorPackage && (
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
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>LOCATION CHAINAGE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>km {selectedNode.formattedChainage || selectedNode.chainage}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>SENSOR PACKAGE</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} color="#166534" />
                <span>APPROVED & LOCKED</span>
              </div>
            </div>
            
            {/* Clickable RUNTIME SENSORS attribute */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>RUNTIME SENSORS</div>
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
                title="Click to view Commissioning grid table"
              >
                <span>{totalRuntimeSensorsCount}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '14px 18px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={16} color="#2563EB" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>COMMISSIONING ACCEPTANCE CONTROL</span>

              {!record || record.status === 'NOT_STARTED' ? (
                <button onClick={handleStartCommissioning} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}>
                  <Play size={14} color="#2563EB" />
                  <span>Start Commissioning</span>
                </button>
              ) : null}
            </div>

            {!isCommissioned && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <ShieldCheck size={15} color="#2563EB" />
                  <span>Validate Acceptance</span>
                </button>

                <button
                  onClick={handleComplete}
                  disabled={!isValidatedSuccess || saving}
                  className="btn-primary"
                  style={{
                    padding: '6px 16px',
                    fontSize: '13px',
                    opacity: isValidatedSuccess && !saving ? 1 : 0.5,
                    cursor: isValidatedSuccess && !saving ? 'pointer' : 'not-allowed',
                  }}
                  title={isValidatedSuccess ? 'Complete Commissioning and Generate Runtime Sensors' : 'Validate acceptance successfully to enable completion'}
                >
                  <CheckSquare size={15} />
                  <span>{saving ? 'Completing...' : 'Complete Commissioning'}</span>
                </button>
              </div>
            )}
          </div>

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

          {/* Commissioning Grid */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isCommissioned ? <Lock size={13} color="#166534" /> : <Activity size={13} color="#2563EB" />}
                  <span>{isCommissioned ? 'COMMISSIONED RUNTIME SENSORS (READ ONLY ARTIFACT)' : 'COMMISSIONING ACCEPTANCE GRID'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {isCommissioned ? 'Commissioning complete and locked' : 'Verify installed quantities and click Validate Acceptance'}
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading commissioning record...</div>
              ) : (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>SENSOR TYPE</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>REQUIRED QTY</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>COMMISSIONED QTY</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>ACCEPTANCE STATUS</th>
                      <th style={{ width: '38%' }}>GENERATED RUNTIME SENSOR CODES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Activity size={14} color="#2563EB" />
                            <span>{row.sensorType}</span>
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#4B5563' }}>
                            {row.requiredQty}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {!isCommissioned ? (
                            <input
                              type="number"
                              min="0"
                              max={row.requiredQty * 2}
                              className="input-field"
                              style={{ width: '65px', height: '30px', fontSize: '13px', textAlign: 'center', fontWeight: 700 }}
                              value={row.commissionedQty}
                              onChange={(e) => updateCommissionedQty(idx, parseInt(e.target.value) || 0)}
                            />
                          ) : (
                            <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                              {row.commissionedQty}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${row.status === 'ACCEPTED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.status === 'ACCEPTED' ? '#F0FDF4' : '#FFFBEB', color: row.status === 'ACCEPTED' ? '#166534' : '#B45309' }}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          {row.generatedCodes.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {row.generatedCodes.map((code) => (
                                <span key={code} style={{ fontFamily: 'var(--font-code)', fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                                  {code}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                              Pending Complete Commissioning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {gridRows.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                          No sensor types found in Sensor Package.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Validation Report Panel */}
          {!isCommissioned && validationResults.length > 0 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color={isValidatedSuccess ? '#16A34A' : '#DC2626'} />
                  <span>COMMISSIONING VALIDATION REPORT</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: isValidatedSuccess ? '#F0FDF4' : '#FEF2F2', color: isValidatedSuccess ? '#166534' : '#991B1B', border: isValidatedSuccess ? '1px solid #BBF7D0' : '1px solid #FECACA' }}>
                  {isValidatedSuccess ? 'VALIDATION SUCCESS - COMPLETE BUTTON ENABLED' : 'ACCEPTANCE INCOMPLETE'}
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
        </>
      )}
    </div>
  );
};
