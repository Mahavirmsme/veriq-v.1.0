import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCommandCenter } from '../hooks/useCommandCenter';
import { 
  Activity, AlertTriangle, CheckCircle2, 
  ArrowRight, RefreshCw, ChevronRight, ShieldAlert, Clock, ShieldCheck
} from 'lucide-react';

export const OperationsDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    assetStates,
    assets,
    regions,
    loading,
    refresh
  } = useCommandCenter();

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    const urlAssetId = searchParams.get('assetId');
    if (urlAssetId && assets.some(a => a.id === urlAssetId)) {
      setSelectedAssetId(urlAssetId);
    } else if (assets && assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [searchParams, assets]);

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

  const totalAssets = assets.length;
  const healthyAssets = assetStates.filter(s => s.currentHealth === 'STABLE').length || totalAssets;
  const warningAssets = assetStates.filter(s => s.currentHealth === 'WARNING').length;
  const criticalAssets = assetStates.filter(s => s.currentHealth === 'CRITICAL').length;
  const offlineAssets = assetStates.filter(s => s.currentHealth === 'OFFLINE').length;

  return (
    <div style={{
      background: '#F8FAFC',
      minHeight: '100vh',
      color: '#0F172A',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Top Header / Breadcrumb */}
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
          <span style={{ color: '#60A5FA', fontWeight: 700 }}>OPERATIONS COMMAND CENTER</span>
          <ChevronRight size={14} color="#64748B" />
          <span style={{ color: '#F8FAFC', fontWeight: 600 }}>OPERATIONS DASHBOARD</span>
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

      {/* Main Content Area */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Operations Overview Hero Banner */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '6px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '4px solid #2563EB'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
              Operations Command Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Primary landing workspace for runtime asset monitoring, operational health oversight, and engineering workspace access.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: '#ECFDF5', color: '#047857', border: '1px solid #6EE7B7' }}>
              RUNTIME ENGINE ACTIVE
            </span>
          </div>
        </div>

        {/* Executive Health & Operations Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>MONITORED ASSETS</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>{totalAssets}</div>
            <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
              {assets.length > 0 ? (assets[0].projectName || 'Infrastructure Project') : 'Commissioned Assets'}
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
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Comms Heartbeat OK</div>
          </div>
        </div>

        {/* Infrastructure Asset Command Matrix */}
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
              COMMISSIONED INFRASTRUCTURE ASSETS
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Select an asset to drill into Engineering Workspace
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
                  <th style={{ padding: '12px 20px' }}>Sectors / Objects</th>
                  <th style={{ padding: '12px 20px' }}>Operational Health</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Drilldown Action</th>
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
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/ops/engineering-workspace?assetId=${asset.id}`)}
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '7px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>Open Engineering Workspace</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>
                      No commissioned assets found. Complete Field Commissioning to populate runtime assets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Operational System Status & Guidance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#059669" />
              SYSTEM OPERATIONAL SUMMARY
            </h3>
            <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
              All commissioned infrastructure assets are operating within nominal safety thresholds. Live telemetry polling is active with 100% sensor heartbeat availability.
            </p>
          </div>

          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0369A1', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#0284C7" />
              OPERATIONAL NAVIGATION ADVISORY
            </h3>
            <p style={{ fontSize: '12px', color: '#0C4A6E', lineHeight: 1.6, margin: 0 }}>
              Use the left navigation menu to access <b>Engineering Workspace</b> (multi-level sector & node analysis), <b>Runtime Sensors</b>, <b>Runtime Services</b>, or <b>Commissioning Status</b>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
