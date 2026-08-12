import React, { useState, useEffect } from 'react';
import './EngineeringNavigation.css';
import { useEngineeringContext } from '../context/useEngineeringContext';
import { commandCenterService, DeploymentZoneStateDTO } from '../../../services/commandCenterService';

/**
 * Enterprise Operations Command Center - Left Operational Panel (Region-2).
 * 100% Runtime Engine Driven.
 * Evaluated nodes count matches contextNodes.length exactly.
 */
export const EngineeringNavigation: React.FC = () => {
  const { selectedZone, selectedRegion, selectedAsset, selectedEngineeringObject, contextNodes, contextSensors } = useEngineeringContext();

  const [zoneState, setZoneState] = useState<DeploymentZoneStateDTO | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchZoneRuntimeData = async () => {
      try {
        const zoneStates = await commandCenterService.getZoneStates().catch(() => []);

        if (isMounted) {
          const zoneCode = selectedZone?.zoneCode;
          const zoneId = selectedZone?.id;
          const matchZoneState = (zoneStates || []).find(z => z.deploymentZoneId === zoneId || z.zoneCode === zoneCode) || null;
          setZoneState(matchZoneState);
        }
      } catch {
        // Fallback
      }
    };

    fetchZoneRuntimeData();

    return () => {
      isMounted = false;
    };
  }, [selectedZone?.id, selectedZone?.zoneCode, selectedRegion?.regionCode, selectedAsset?.id, selectedEngineeringObject.id]);

  const runtimeSensors = contextSensors;

  const totalRuntimeSensors = runtimeSensors.length;
  const healthySensors = runtimeSensors.filter(s => s.runtimeStatus === 'ACTIVE' || s.runtimeStatus === 'PROVISIONED').length;
  const faultySensors = runtimeSensors.filter(s => s.runtimeStatus === 'FAULTY' || s.runtimeStatus === 'CALIBRATION_DUE').length;
  const offlineSensors = runtimeSensors.filter(s => s.runtimeStatus === 'OFFLINE' || s.runtimeStatus === 'TELEMETRY_LOST').length;

  const faultList = runtimeSensors.filter(s => s.runtimeStatus === 'FAULTY' || s.runtimeStatus === 'OFFLINE' || s.runtimeStatus === 'CALIBRATION_DUE');
  const maintenanceList = runtimeSensors.filter(s => s.runtimeStatus === 'CALIBRATION_DUE' || s.runtimeStatus === 'REPLACEMENT_REQUIRED');


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
      {/* 1. SHARED COLUMN HEADER */}
      <div className="veriq-column-header">
        <h2 className="veriq-column-header-title">SYSTEM STATUS</h2>
        <span className="veriq-column-header-badge">LIVE</span>
      </div>

      {/* 2. UNIFIED INFORMATION RAIL */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Runtime Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Runtime Status</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: totalRuntimeSensors > 0 ? '#16A34A' : '#64748B', fontFamily: 'monospace' }}>
            {totalRuntimeSensors > 0 ? '● LIVE TELEMETRY' : 'OFFLINE'}
          </span>
        </div>

        {/* Zone Health */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Zone Health</span>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: zoneState?.currentHealth === 'CRITICAL' ? '#DC2626' : zoneState?.currentHealth === 'WARNING' ? '#D97706' : '#16A34A',
            fontFamily: 'monospace'
          }}>
            {zoneState?.currentHealth || 'STABLE'}
          </span>
        </div>

        {/* Evaluated Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Evaluated Nodes</span>
          <strong style={{ fontFamily: 'monospace', color: '#0F172A', fontSize: '11px' }}>{contextNodes.length}</strong>
        </div>

        <div style={{ height: '1px', background: '#F1F5F9', margin: '2px 0' }} />

        {/* Sensors Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Sensors</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', fontSize: '11px' }}>{totalRuntimeSensors}</span>
          </div>

          {totalRuntimeSensors > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', fontSize: '9px', textAlign: 'center' }}>
              <div style={{ background: '#F8FAFC', padding: '4px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B' }}>Active</span>
                <div style={{ fontWeight: 800, color: '#16A34A', fontFamily: 'monospace' }}>{healthySensors}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '4px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B' }}>Faulty</span>
                <div style={{ fontWeight: 800, color: faultySensors > 0 ? '#DC2626' : '#0F172A', fontFamily: 'monospace' }}>{faultySensors}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '4px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B' }}>Offline</span>
                <div style={{ fontWeight: 800, color: offlineSensors > 0 ? '#D97706' : '#0F172A', fontFamily: 'monospace' }}>{offlineSensors}</div>
              </div>
            </div>
          )}
        </div>

        {/* Faults */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Faults</span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: faultList.length > 0 ? '#DC2626' : '#16A34A',
            fontFamily: 'monospace'
          }}>
            {faultList.length > 0 ? `${faultList.length} Active` : '0 Faults'}
          </span>
        </div>

        {/* Maintenance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Maintenance</span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: maintenanceList.length > 0 ? '#D97706' : '#16A34A',
            fontFamily: 'monospace'
          }}>
            {maintenanceList.length > 0 ? `${maintenanceList.length} Tasks` : 'Queue Clear'}
          </span>
        </div>

        {/* Trends */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>Trends</span>
          <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}>
            {contextNodes.length > 0 ? 'Live Stream' : '—'}
          </span>
        </div>

      </div>
    </div>
  );
};

export default EngineeringNavigation;

