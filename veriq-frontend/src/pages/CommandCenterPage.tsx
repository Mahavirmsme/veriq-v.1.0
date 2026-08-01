import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCommandCenter } from '../hooks/useCommandCenter';
import { useAuth } from '../context/AuthContext';
import { hasDeveloperPermission } from '../app/authentication/RoleResolver';
import { 
  Activity, AlertTriangle, CheckCircle2, 
  ArrowRight, RefreshCw, ChevronRight, ShieldAlert, 
  Clock, Wrench
} from 'lucide-react';
import { EngineeringWorkspaceSecondaryNav } from '../components/EngineeringWorkspaceSecondaryNav';

export const CommandCenterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = (user as any)?.role || (user?.roles && user.roles[0]);
  const isDeveloper = hasDeveloperPermission(userRole);

  const {
    assetStates,
    regionStates,
    nodeStates,
    assets,
    regions,
    nodes,
    sensors,
    loading,
    refresh
  } = useCommandCenter();

  // Navigation Drilldown State (Breadcrumb: Operations > Asset > Sector/Region > Node)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Synchronize drilldown state from URL query parameters
  useEffect(() => {
    const urlAssetId = searchParams.get('assetId');
    const urlPointId = searchParams.get('pointAssetId');
    const urlRegionId = searchParams.get('regionId');
    const urlNodeId = searchParams.get('nodeId');
    const isDevInspector = searchParams.get('devTool') === 'node-inspector';

    if (urlAssetId && assets.some(a => a.id === urlAssetId)) {
      setSelectedAssetId(urlAssetId);
    }
    const targetSectorId = urlPointId || urlRegionId;
    if (targetSectorId && regions.some(r => r.id === targetSectorId)) {
      setSelectedRegionId(targetSectorId);
    }
    if (urlNodeId && nodes.some(n => n.id === urlNodeId)) {
      setSelectedNodeId(urlNodeId);
    }
    if (isDevInspector && isDeveloper) {
      setIsInspectorOpen(true);
    }
  }, [searchParams, assets, regions, nodes, isDeveloper]);

  // Filter helpers
  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const selectedAssetRegions = regions.filter(r => r.asset?.id === selectedAssetId || r.assetId === selectedAssetId);
  const selectedRegion = regions.find(r => r.id === selectedRegionId);
  const selectedRegionNodes = nodes.filter(n => n.deploymentZone?.region?.id === selectedRegionId || n.regionId === selectedRegionId);
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedNodeSensors = sensors.filter(s => s.engineeringNode?.id === selectedNodeId || s.engineeringNodeId === selectedNodeId);

  // Status Badge Helper Component
  const renderStatusBadge = (status: string | undefined, size: 'sm' | 'md' | 'lg' = 'md') => {
    const s = (status || 'STABLE').toUpperCase();
    let bg = '#ECFDF5';
    let text = '#047857';
    let border = '#6EE7B7';
    let icon = <CheckCircle2 size={size === 'sm' ? 12 : 14} color="#047857" />;

    if (s === 'STABLE' || s === 'HEALTHY' || s === 'ACTIVE') {
      bg = '#ECFDF5';
      text = '#047857';
      border = '#6EE7B7';
      icon = <CheckCircle2 size={size === 'sm' ? 12 : 14} color="#047857" />;
    } else if (s === 'WARNING' || s === 'ELEVATED') {
      bg = '#FFFBEB';
      text = '#B45309';
      border = '#FCD34D';
      icon = <AlertTriangle size={size === 'sm' ? 12 : 14} color="#B45309" />;
    } else if (s === 'CRITICAL' || s === 'FAULT') {
      bg = '#FEF2F2';
      text = '#B91C1C';
      border = '#FCA5A5';
      icon = <ShieldAlert size={size === 'sm' ? 12 : 14} color="#B91C1C" />;
    } else if (s === 'OFFLINE' || s === 'INACTIVE') {
      bg = '#F8FAFC';
      text = '#475569';
      border = '#CBD5E1';
      icon = <Clock size={size === 'sm' ? 12 : 14} />;
    }

    const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 16px' : '4px 12px';
    const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px';

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: '4px',
        padding,
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.04em',
        fontFamily: 'monospace'
      }}>
        {icon}
        {s}
      </span>
    );
  };

  // -------------------------------------------------------------
  // RUNTIME NODE INSPECTOR (INTERNAL ENGINEERING DIAGNOSTIC WINDOW - RBAC PROTECTED)
  // -------------------------------------------------------------
  const renderNodeWorkspaceModal = () => {
    if (!selectedNode || !isInspectorOpen || !isDeveloper) return null;
    const nodeState = nodeStates.find(ns => ns.engineeringNodeId === selectedNode.id || ns.nodeCode === selectedNode.nodeCode);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #1E293B',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* Modal Header */}
          <div style={{
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #2563EB'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={13} color="#38BDF8" />
                RUNTIME NODE INSPECTOR (INTERNAL ENGINEERING DIAGNOSTICS)
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Node: {selectedNode.nodeCode || `EN-${selectedNode.nodeNumber}`}
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1' }}>
                  (Chainage {selectedNode.formattedChainage || `${selectedNode.chainage || 0} KM`})
                </span>
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {renderStatusBadge(nodeState?.currentHealth || 'STABLE', 'lg')}
              <button
                onClick={() => setIsInspectorOpen(false)}
                style={{
                  background: '#1E293B',
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Quick Specs Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PARENT ZONE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {selectedNode.deploymentZone?.zoneCode || selectedNode.zoneCode || 'PZ-01'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>COMMISSIONED SENSORS</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {selectedNodeSensors.length} Sensors
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>EVALUATION VERSION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', marginTop: '2px', fontFamily: 'monospace' }}>
                  {nodeState?.evaluationVersion || 'v1.0.0'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>LAST REFRESH</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                  {nodeState?.evaluationTimestamp ? new Date(nodeState.evaluationTimestamp).toLocaleTimeString() : 'Live Connected'}
                </div>
              </div>
            </div>

            {/* Dynamic Sensor Telemetry Grid */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#2563EB" />
                LIVE COMMISSIONED SENSOR TELEMETRY & OBSERVATIONS
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {selectedNodeSensors.length > 0 ? (
                  selectedNodeSensors.map((s, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '14px',
                      background: '#FFFFFF'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{s.sensorType}</span>
                        <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>{s.sensorCode}</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
                        {s.currentValue || 'Operational'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>
                          {s.measurementParameter || 'ACTIVE_TELEMETRY'}
                        </span>
                        {renderStatusBadge(s.runtimeStatus || 'STABLE', 'sm')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: 'span 3', padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                    No commissioned sensors bound to this node yet. Complete Field Commissioning to activate live telemetry.
                  </div>
                )}
              </div>
            </div>

            {/* Evidence & Recommendations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', background: '#F8FAFC' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
                  ENGINEERING EVIDENCE ASSESSMENT
                </h4>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  Structural and telemetry observations at Chainage {selectedNode.formattedChainage || `${selectedNode.chainage || 0} KM`} demonstrate stable operational equilibrium. Zero structural safety breaches detected.
                </p>
              </div>

              <div style={{ border: '1px solid #BAE6FD', borderRadius: '6px', padding: '16px', background: '#F0F9FF' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0369A1', margin: '0 0 10px' }}>
                  RECOMMENDED OPERATIONAL ACTIONS
                </h4>
                <ul style={{ fontSize: '12px', color: '#0C4A6E', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                  <li>Maintain automated telemetry polling heartbeat.</li>
                  <li>Perform routine visual verification during field inspections.</li>
                  <li>No immediate intervention required.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // BREADCRUMB HEADER COMPONENT
  // -------------------------------------------------------------
  const renderBreadcrumb = () => (
    <div style={{
      background: '#0F172A',
      color: '#FFFFFF',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
        <span
          onClick={() => { setSelectedAssetId(null); setSelectedRegionId(null); }}
          style={{ cursor: 'pointer', color: selectedAssetId ? '#94A3B8' : '#60A5FA', fontWeight: selectedAssetId ? 500 : 700 }}
        >
          OPERATIONS COMMAND CENTER
        </span>

        {selectedAsset && (
          <>
            <ChevronRight size={14} color="#64748B" />
            <span
              onClick={() => setSelectedRegionId(null)}
              style={{ cursor: 'pointer', color: selectedRegionId ? '#94A3B8' : '#60A5FA', fontWeight: selectedRegionId ? 500 : 700 }}
            >
              ASSET: {selectedAsset.assetName || selectedAsset.assetCode}
            </span>
          </>
        )}

        {selectedRegion && (
          <>
            <ChevronRight size={14} color="#64748B" />
            <span style={{ color: '#60A5FA', fontWeight: 700 }}>
              {selectedAsset?.assetNature?.toUpperCase() === 'POINT' ? 'POINT ASSET:' : 'REGION:'} {selectedRegion.regionName || selectedRegion.regionCode}
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={refresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Live Refresh'}
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // LEVEL 1: CLIENT OPERATIONS COMMAND CENTER DASHBOARD
  // -------------------------------------------------------------
  const renderHeadquartersDashboard = () => {
    const totalAssets = assets.length;
    const healthyAssets = assetStates.filter(s => s.currentHealth === 'STABLE').length;
    const warningAssets = assetStates.filter(s => s.currentHealth === 'WARNING').length;
    const criticalAssets = assetStates.filter(s => s.currentHealth === 'CRITICAL').length;
    const offlineAssets = assetStates.filter(s => s.currentHealth === 'OFFLINE').length;

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Hero Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>TOTAL MONITORED ASSETS</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>{totalAssets}</div>
            <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
              {assets.length > 0 ? (assets[0].projectName || 'Infrastructure Project') : 'Commissioned Infrastructure'}
            </div>
          </div>

          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>HEALTHY (STABLE)</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#047857', marginTop: '4px' }}>{healthyAssets}</div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>Normal Operations</div>
          </div>

          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>WARNING REQUIRED</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#B45309', marginTop: '4px' }}>{warningAssets}</div>
            <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600, marginTop: '2px' }}>Elevated Telemetry</div>
          </div>

          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase' }}>CRITICAL RISK</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#B91C1C', marginTop: '4px' }}>{criticalAssets}</div>
            <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>Immediate Inspection</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>OFFLINE / INACTIVE</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#475569', marginTop: '4px' }}>{offlineAssets}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Comms Lost</div>
          </div>
        </div>

        {/* Enterprise Asset Grid Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            background: '#F1F5F9',
            padding: '14px 20px',
            borderBottom: '1px solid #CBD5E1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              INFRASTRUCTURE ASSET COMMAND MATRIX
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Select Asset to inspect Sector Runtime Operations
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
              Loading runtime assets from backend database...
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px' }}>Asset Name & Code</th>
                  <th style={{ padding: '12px 20px' }}>Asset Nature</th>
                  <th style={{ padding: '12px 20px' }}>Coverage Span</th>
                  <th style={{ padding: '12px 20px' }}>Total Sectors</th>
                  <th style={{ padding: '12px 20px' }}>Current State</th>
                  <th style={{ padding: '12px 20px' }}>Critical Sectors</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Command Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const state = assetStates.find(s => s.assetId === asset.id || s.assetName === asset.assetName);
                  const assetRgns = regions.filter(r => r.asset?.id === asset.id || r.assetId === asset.id);

                  return (
                    <tr key={asset.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F172A' }}>
                        {asset.assetName}
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, fontFamily: 'monospace' }}>
                          {asset.assetCode}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 600 }}>
                        {asset.assetNature || 'LINEAR'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#334155', fontFamily: 'monospace' }}>
                        {asset.startChainage !== undefined ? `km ${asset.startChainage} → ${asset.endChainage}` : 'Point Infrastructure'}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F172A' }}>
                        {state?.totalRegions || assetRgns.length || 1} Sectors
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {renderStatusBadge(state?.currentHealth || 'STABLE')}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: (state?.criticalRegions || 0) > 0 ? '#DC2626' : '#475569' }}>
                        {state?.criticalRegions || 0} Critical
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedAssetId(asset.id)}
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          Open Asset Command <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>
                      No commissioned assets available in Operations Command Center. Complete Field Commissioning to activate assets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // LEVEL 2: ASSET COMMAND DASHBOARD
  // -------------------------------------------------------------
  const renderAssetCommandDashboard = () => {
    if (!selectedAsset) return null;
    const assetState = assetStates.find(s => s.assetId === selectedAsset.id || s.assetName === selectedAsset.assetName);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Asset Hero Banner */}
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '6px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '4px solid #2563EB'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em' }}>
              ASSET COMMAND DASHBOARD
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 6px' }}>
              {selectedAsset.assetName} ({selectedAsset.assetCode})
            </h1>
            <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
              Nature: {selectedAsset.assetNature || 'LINEAR'} | {selectedAsset.startChainage !== undefined ? `Span: km ${selectedAsset.startChainage} → ${selectedAsset.endChainage}` : 'Point Infrastructure Object'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {renderStatusBadge(assetState?.currentHealth || 'STABLE', 'lg')}
            <button
              onClick={() => setSelectedAssetId(null)}
              style={{
                background: '#1E293B',
                color: '#94A3B8',
                border: '1px solid #334155',
                borderRadius: '4px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Overview
            </button>
          </div>
        </div>

        {/* Region Grid Matrix */}
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            background: '#F1F5F9',
            padding: '14px 20px',
            borderBottom: '1px solid #CBD5E1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
              REGIONAL OPERATIONAL SECTORS ({selectedAssetRegions.length} Sectors)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px' }}>
            {selectedAssetRegions.map((region) => {
              const rgnState = regionStates.find(rs => rs.regionId === region.id || rs.regionName === region.regionName);
              const rgnNodes = nodes.filter(n => n.deploymentZone?.region?.id === region.id || n.regionId === region.id);

              return (
                <div key={region.id} style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '18px',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {region.regionName}
                      </h4>
                      <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace', marginTop: '2px' }}>
                        {region.regionCode}
                      </div>
                    </div>
                    {renderStatusBadge(rgnState?.currentHealth || 'STABLE', 'sm')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#F8FAFC', padding: '10px', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>NODES</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{rgnNodes.length}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 700 }}>WARNINGS</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#B45309' }}>{rgnState?.warningZones || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#B91C1C', fontWeight: 700 }}>CRITICAL</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#B91C1C' }}>{rgnState?.criticalZones || 0}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRegionId(region.id)}
                    style={{
                      background: '#1E3A8A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    Open Sector Operations <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}

            {selectedAssetRegions.length === 0 && (
              <div style={{ gridColumn: 'span 3', padding: '36px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                No regional operational sectors found for this asset.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // LEVEL 3: REGION OPERATIONS DASHBOARD
  // -------------------------------------------------------------
  const renderRegionOperationsDashboard = () => {
    if (!selectedRegion) return null;
    const rgnState = regionStates.find(rs => rs.regionId === selectedRegion.id || rs.regionName === selectedRegion.regionName);

    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Three Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '20px' }}>
          
          {/* LEFT PANEL: Operations & Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Region Selector List */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
                REGIONAL SECTORS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedAssetRegions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegionId(r.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      border: r.id === selectedRegionId ? '1px solid #2563EB' : '1px solid #E2E8F0',
                      background: r.id === selectedRegionId ? '#EFF6FF' : '#FFFFFF',
                      color: r.id === selectedRegionId ? '#1E40AF' : '#334155',
                      fontWeight: r.id === selectedRegionId ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{r.regionName}</span>
                    {renderStatusBadge('STABLE', 'sm')}
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Node Summary Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
                OPERATIONAL SUMMARY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Total Sector Nodes:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedRegionNodes.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Telemetry Active:</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>100.0%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Operational Status:</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>ACTIVE</span>
                </div>
              </div>
            </div>

          </div>

          {/* CENTER PANEL: Hero Region & Infrastructure Ribbon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Hero Region Metric Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '20px',
              borderTop: '4px solid #1E3A8A'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                    REGIONAL SECTOR OPERATIONS
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '4px 0' }}>
                    {selectedRegion.regionName} ({selectedRegion.regionCode})
                  </h2>
                  <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>
                    Sector Code: {selectedRegion.regionCode}
                  </div>
                </div>
                {renderStatusBadge(rgnState?.currentHealth || 'STABLE', 'lg')}
              </div>
            </div>

            {/* INFRASTRUCTURE RIBBON */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
                  INFRASTRUCTURE NODE RIBBON
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Select Node to inspect Sector Queue
                </span>
              </div>

              {/* Chainage Ribbon Track */}
              <div style={{
                position: 'relative',
                height: '48px',
                background: '#F1F5F9',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px'
              }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', background: '#94A3B8' }} />

                {/* Render Nodes along the chainage ribbon */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  {selectedRegionNodes.map((node, i) => {
                    const ndState = nodeStates.find(ns => ns.engineeringNodeId === node.id || ns.nodeCode === node.nodeCode);
                    const status = ndState?.currentHealth || 'STABLE';
                    const isSelected = node.id === selectedNodeId;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: status === 'STABLE' ? '#10B981' : status === 'WARNING' ? '#F59E0B' : '#EF4444',
                          border: isSelected ? '3px solid #0F172A' : '2px solid #FFFFFF',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 800
                        }}>
                          {node.nodeNumber || (i + 1)}
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#334155', fontFamily: 'monospace' }}>
                          km {node.formattedChainage || node.chainage || '0.000'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Operational Information & Queue */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderBottom: '1px solid #CBD5E1', fontWeight: 800, fontSize: '12px', color: '#0F172A', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>SECTOR OPERATIONAL INFORMATION</span>
                {selectedNode && isDeveloper && (
                  <button
                    onClick={() => setIsInspectorOpen(true)}
                    style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Wrench size={12} />
                    <span>Runtime Node Inspector (Developer Tool)</span>
                  </button>
                )}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Node Code</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Chainage</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Operational Guidance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRegionNodes.map((n) => {
                    const isSelected = n.id === selectedNodeId;
                    return (
                      <tr key={n.id} style={{ borderBottom: '1px solid #F1F5F9', background: isSelected ? '#EFF6FF' : 'transparent' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 700, fontFamily: 'monospace', color: isSelected ? '#1E40AF' : '#0F172A' }}>{n.nodeCode}</td>
                        <td style={{ padding: '10px 16px', fontFamily: 'monospace' }}>km {n.formattedChainage || n.chainage || '0.000'}</td>
                        <td style={{ padding: '10px 16px' }}>{renderStatusBadge('STABLE', 'sm')}</td>
                        <td style={{ padding: '10px 16px', color: '#334155' }}>Routine telemetry monitoring active. Normal operational state.</td>
                      </tr>
                    );
                  })}
                  {selectedRegionNodes.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No engineering nodes registered for this sector.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* RIGHT PANEL: Decision Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Operational Alerts Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={14} color="#2563EB" />
                OPERATIONAL ALERTS & GUIDANCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ borderLeft: '3px solid #10B981', paddingLeft: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>All Systems Operational</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Zero structural safety breaches detected.</div>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '12px' }}>
                FIELD ADVISORIES
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>
                No pending operational advisories for this sector.
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: '#F8FAFC',
      minHeight: '100vh',
      color: '#0F172A',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Top Command Bar */}
      {renderBreadcrumb()}
      <EngineeringWorkspaceSecondaryNav />

      {/* Render Active Level Based on Navigation State */}
      {selectedRegionId ? (
        renderRegionOperationsDashboard()
      ) : selectedAssetId ? (
        renderAssetCommandDashboard()
      ) : (
        renderHeadquartersDashboard()
      )}

      {/* Render Runtime Node Inspector Diagnostic Window (RBAC Guarded) */}
      {renderNodeWorkspaceModal()}
    </div>
  );
};
