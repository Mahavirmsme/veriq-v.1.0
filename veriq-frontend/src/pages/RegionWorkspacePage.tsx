import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cpu, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, Layers, FolderKanban, Ruler, Info, Edit3, Lock, Eye } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { useRegionWorkspace } from '../hooks/useRegionWorkspace';

export const RegionWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regionCountInput, setRegionCountInput] = useState<number>(3);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  
  // Single Source of Truth State: isSaved controls READ ONLY vs EDIT mode
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [isUnlockConfirmOpen, setIsUnlockConfirmOpen] = useState<boolean>(false);

  const {
    regions,
    loading,
    saving,
    serverError,
    validationResults,
    isValidatedSuccess,
    loadExistingRegions,
    generateRegions,
    updateRegionRow,
    validateDesign,
    saveEngineeringDesign,
  } = useRegionWorkspace();

  useEffect(() => {
    assetService.getAll().then((data) => {
      setAssets(data);
      const urlAssetId = searchParams.get('assetId');
      if (urlAssetId && data.some((a) => a.id === urlAssetId)) {
        setSelectedAssetId(urlAssetId);
      } else {
        const firstLinear = data.find((a) => a.assetNature === 'Linear');
        if (firstLinear) {
          setSelectedAssetId(firstLinear.id);
        } else if (data.length > 0) {
          setSelectedAssetId(data[0].id);
        }
      }
    }).catch(() => setAssets([]));
  }, [searchParams]);

  // Load persisted Engineering Artifact from backend whenever selectedAssetId changes
  useEffect(() => {
    if (selectedAssetId) {
      setSaveSuccessMsg(null);
      loadExistingRegions(selectedAssetId).then((data) => {
        if (data && data.length > 0) {
          setIsSaved(true); // Persisted artifact exists -> Open in READ ONLY mode
        } else {
          setIsSaved(false); // No saved artifact -> Open in EDIT mode
        }
      });
    }
  }, [selectedAssetId, loadExistingRegions]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const isLinearAsset = selectedAsset?.assetNature === 'Linear';

  const handleGenerate = () => {
    if (!selectedAsset || !isLinearAsset) return;
    const start = selectedAsset.startChainage || 0;
    const end = selectedAsset.endChainage || 0;
    generateRegions(regionCountInput, start, end);
    setSaveSuccessMsg(null);
  };

  const handleValidate = () => {
    if (!selectedAsset) return;
    validateDesign(selectedAsset);
    // CRITICAL: Validation Engine ONLY verifies rules and NEVER switches to Read Mode!
  };

  const handleSave = async () => {
    if (!selectedAsset || !isValidatedSuccess) return;
    try {
      await saveEngineeringDesign(selectedAsset.id);
      setSaveSuccessMsg('Region engineering design successfully validated and saved!');
      setIsSaved(true); // ONLY NOW switch to READ ONLY mode after HTTP 200 backend success!
      setIsTableExpanded(true);
    } catch {
      // serverError handled in hook
    }
  };

  const handleConfirmUnlock = () => {
    setIsUnlockConfirmOpen(false);
    setIsSaved(false); // Return to Edit Mode with loaded persisted regions
    setSaveSuccessMsg(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar (Platform > Engineering Design > Region Workspace) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Design</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Region Workspace</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Region Engineering Workspace</h1>
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

        {/* Asset Selection Dropdown & Edit Unlock Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>TARGET ASSET:</label>
          <select
            className="input-field"
            style={{ height: '36px', fontSize: '13px', minWidth: '280px' }}
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            {assets.map((ast) => (
              <option key={ast.id} value={ast.id}>
                {ast.assetName} ({ast.assetCode}) - {ast.assetNature}
              </option>
            ))}
          </select>

          {isSaved && isLinearAsset && regions.length > 0 && (
            <button
              onClick={() => setIsUnlockConfirmOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '13px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
              title="Unlock Region Design for modification"
            >
              <Edit3 size={15} color="#2563EB" />
              <span>Edit Engineering Design</span>
            </button>
          )}
        </div>
      </div>

      {/* Non-Applicability Banner if Asset Nature = Point */}
      {selectedAsset && !isLinearAsset && (
        <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#92400E' }}>
          <Info size={20} color="#D97706" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Region Module Not Applicable</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>
              Selected asset <b>{selectedAsset.assetName}</b> is a <b>Point Asset</b>. Region engineering segmentation applies ONLY to <b>Linear Assets</b> (e.g. Highways, Railways, Pipelines).
            </div>
          </div>
        </div>
      )}

      {/* Linear Asset Workspace Content */}
      {selectedAsset && isLinearAsset && (
        <>
          {/* Summary Card with Clickable REGIONS attribute */}
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
                <span>{selectedAsset.assetName} ({selectedAsset.assetCode})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>CHAINAGE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={14} color="#2563EB" />
                <span>km {selectedAsset.startChainage || 0} → {selectedAsset.endChainage || 0} ({selectedAsset.totalLength || 0} km)</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET NATURE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px' }}>
                {selectedAsset.assetNature} ({selectedAsset.assetClass})
              </div>
            </div>
            
            {/* Clickable REGIONS attribute */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>REGIONS</div>
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
                title="Click to view Region Engineering Design table"
              >
                <span>{regions.length}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* EDIT MODE Action Toolbar (Always visible in EDIT MODE, including after validation!) */}
          {!isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>NUMBER OF REGIONS:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  style={{ width: '70px', height: '34px', fontSize: '13px', textAlign: 'center' }}
                  value={regionCountInput}
                  onChange={(e) => setRegionCountInput(parseInt(e.target.value) || 1)}
                />
                <button onClick={handleGenerate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <Cpu size={14} color="#2563EB" />
                  <span>Generate Regions</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <ShieldCheck size={15} color="#2563EB" />
                  <span>Validate Design</span>
                </button>

                {/* Save button remains VISIBLE and ENABLED when isValidatedSuccess is true */}
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

          {/* Region Table (Editable in EDIT MODE, Read-Only in READ MODE) */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaved ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                  <span>{isSaved ? 'SAVED REGION ENGINEERING ARTIFACT (READ ONLY)' : 'ENGINEERING REGION SEGMENTATION GRID (EDITABLE)'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {isSaved ? 'Click "Edit Engineering Design" to unlock' : 'Edit values, click Validate Design, then click Save'}
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading region design from database...</div>
              ) : (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>REGION ID</th>
                      <th style={{ width: '28%' }}>REGION NAME</th>
                      <th style={{ width: '20%' }}>START CHAINAGE (km)</th>
                      <th style={{ width: '20%' }}>END CHAINAGE (km)</th>
                      <th style={{ width: '12%' }}>LENGTH (km)</th>
                      <th style={{ width: '8%', textAlign: 'right' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regions.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', fontWeight: 700, color: '#1F2937' }}>
                            {row.regionCode}
                          </span>
                        </td>
                        <td>
                          {!isSaved ? (
                            <input
                              type="text"
                              className="input-field"
                              style={{ height: '32px', fontSize: '13px', fontWeight: 500 }}
                              value={row.regionName}
                              onChange={(e) => updateRegionRow(idx, 'regionName', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>{row.regionName}</span>
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
                              onChange={(e) => updateRegionRow(idx, 'startChainage', e.target.value)}
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
                              onChange={(e) => updateRegionRow(idx, 'endChainage', e.target.value)}
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
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${row.status === 'VALIDATED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.status === 'VALIDATED' ? '#F0FDF4' : '#FFFBEB', color: row.status === 'VALIDATED' ? '#166534' : '#B45309' }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {regions.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                          No engineering regions generated yet. Specify region count above and click "Generate Regions".
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
                  <span>VERIQ ENGINEERING VALIDATION ENGINE REPORT</span>
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
                  <span>Unlock Engineering Design</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '20px', lineHeight: '1.5' }}>
                  This will unlock the Region Engineering Design for modification. You will need to re-validate engineering rules before saving changes.
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
