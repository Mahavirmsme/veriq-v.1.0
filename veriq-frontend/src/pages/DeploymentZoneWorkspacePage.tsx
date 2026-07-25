import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, FolderKanban, Ruler, Info, Edit3, Lock, Eye, Cpu, Radio } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { useDeploymentZoneWorkspace } from '../hooks/useDeploymentZoneWorkspace';

export const DeploymentZoneWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [zoneCountInput, setZoneCountInput] = useState<number>(2);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Single Source of Truth State: isSaved controls READ ONLY vs EDIT mode
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [isUnlockConfirmOpen, setIsUnlockConfirmOpen] = useState<boolean>(false);

  const {
    zones,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingZones,
    generateZones,
    updateZoneRow,
    validateDesign,
    saveEngineeringDesign,
  } = useDeploymentZoneWorkspace();

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

  // Load regions for selected linear asset
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

  // Load persisted Deployment Zones whenever selectedRegionId changes
  useEffect(() => {
    if (selectedRegionId) {
      setSaveSuccessMsg(null);
      loadExistingZones(selectedRegionId).then((data) => {
        if (data && data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [selectedRegionId, loadExistingZones]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  const handleGenerate = () => {
    if (!selectedRegion) return;
    const start = selectedRegion.startChainage || 0;
    const end = selectedRegion.endChainage || 0;
    generateZones(zoneCountInput, start, end);
    setSaveSuccessMsg(null);
  };

  const handleValidate = () => {
    if (!selectedRegion) return;
    validateDesign(selectedRegion);
  };

  const handleSave = async () => {
    if (!selectedRegion || !isValidatedSuccess) return;
    try {
      await saveEngineeringDesign(selectedRegion.id || '');
      setSaveSuccessMsg('Deployment Zone engineering design successfully validated and saved!');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar (Platform > Engineering Design > Deployment Designer) */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '220px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

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

          {isSaved && selectedRegion && zones.length > 0 && (
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

      {/* Warning if no saved regions exist for target asset */}
      {selectedAsset && regions.length === 0 && (
        <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#92400E' }}>
          <Info size={20} color="#D97706" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>No Regions Defined for Asset</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>
              Deployment Zone segmentation depends on saved Region definitions. Please open the <b>Region Workspace</b> and save an engineering design for <b>{selectedAsset.assetName}</b> first.
            </div>
          </div>
        </div>
      )}

      {/* Active Workspace */}
      {selectedAsset && selectedRegion && (
        <>
          {/* Header Summary Metadata Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>PROJECT</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderKanban size={14} color="#2563EB" />
                <span>{selectedAsset.projectName}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#2563EB" />
                <span>{selectedAsset.assetName}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} color="#2563EB" />
                <span>{selectedRegion.regionName} ({selectedRegion.regionCode})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION LENGTH</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>km {selectedRegion.startChainage} → {selectedRegion.endChainage} ({selectedRegion.regionLength} km)</span>
              </div>
            </div>
            
            {/* Clickable DEPLOYMENT ZONES attribute */}
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

          {/* Validation Report Panel (EDIT MODE ONLY) */}
          {!isSaved && validationResults.length > 0 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color={isValidatedSuccess ? '#16A34A' : '#DC2626'} />
                  <span>DEPLOYMENT ZONE VALIDATION ENGINE REPORT</span>
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
                  <span>Unlock Deployment Zone Design</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '20px', lineHeight: '1.5' }}>
                  This will unlock the Deployment Zone Engineering Design for modification. You will need to re-validate engineering rules before saving changes.
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
