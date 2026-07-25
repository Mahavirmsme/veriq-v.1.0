import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, RefreshCw, Activity, Filter, Lock, Database, Layers, Power, AlertTriangle, Radio, AlertCircle, Wrench, Ban, Clock, History, Cpu, UserCheck, ShieldCheck } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { useRuntimeSensorRegistry } from '../hooks/useRuntimeSensorRegistry';
import { RuntimeSensorRecord } from '../services/runtimeSensorService';

export const RuntimeSensorRegistryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [inspectedSensor, setInspectedSensor] = useState<RuntimeSensorRecord | null>(null);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const { sensors, loading, error, loadRuntimeSensors } = useRuntimeSensorRegistry();

  useEffect(() => {
    assetService.getAll().then((data) => {
      setAssets(data);
      const urlAssetId = searchParams.get('assetId');
      if (urlAssetId && data.some((a) => a.id === urlAssetId)) {
        setSelectedAssetId(urlAssetId);
      }
    }).catch(() => setAssets([]));
  }, [searchParams]);

  useEffect(() => {
    loadRuntimeSensors();
  }, [loadRuntimeSensors]);

  // Set default inspected sensor when list loads
  useEffect(() => {
    if (sensors && sensors.length > 0 && !inspectedSensor) {
      setInspectedSensor(sensors[0]);
    }
  }, [sensors, inspectedSensor]);

  const filteredSensors = sensors.filter((s) => {
    const matchesSearch =
      s.sensorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sensorType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nodeCode && s.nodeCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.commissioningReference && s.commissioningReference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAsset = selectedAssetId === 'ALL' || (s.assetName && assets.find(a => a.id === selectedAssetId)?.assetName === s.assetName);
    const matchesStatus = selectedStatusFilter === 'ALL' || s.runtimeStatus.toUpperCase().replace(/\s+/g, '_') === selectedStatusFilter.toUpperCase().replace(/\s+/g, '_');

    return matchesSearch && matchesAsset && matchesStatus;
  });

  const getStatusBadgeStyle = (status: string) => {
    const norm = status ? status.toUpperCase().replace(/\s+/g, '_') : 'PROVISIONED';
    switch (norm) {
      case 'PROVISIONED':
        return { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: 'Provisioned' };
      case 'ACTIVE':
        return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', label: 'Active' };
      case 'RECEIVING_TELEMETRY':
        return { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0', label: 'Receiving Telemetry' };
      case 'COMMUNICATION_LOST':
        return { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', label: 'Communication Lost' };
      case 'FAULT':
        return { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA', label: 'Fault' };
      case 'MAINTENANCE':
        return { bg: '#F3E8FF', color: '#6B21A8', border: '#E9D5FF', label: 'Maintenance' };
      case 'RETIRED':
        return { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB', label: 'Retired' };
      default:
        return { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB', label: status };
    }
  };

  const activeSensorsCount = sensors.filter(s => s.runtimeStatus.toLowerCase() === 'active' || s.runtimeStatus.toLowerCase() === 'receiving telemetry').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Operational Layer</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Runtime Sensors</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Runtime Sensor Registry</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
              READ ONLY OPERATIONAL LAYER
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => loadRuntimeSensors()} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
            <RefreshCw size={14} color="#2563EB" />
            <span>Refresh Operational Registry</span>
          </button>
        </div>
      </div>

      {/* Read-Only System Controlled Status Card for Inspected Sensor */}
      {inspectedSensor && (
        <div style={{ background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={15} color="#166534" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>SYSTEM CONTROLLED RUNTIME STATUS CARD</span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE', fontWeight: 700 }}>
                {inspectedSensor.sensorCode}
              </span>
              <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>({inspectedSensor.sensorType})</span>
            </div>

            <button
              onClick={() => setShowLogModal(true)}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '12px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
            >
              <History size={13} color="#2563EB" />
              <span>View Audit Transition Log</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>RUNTIME STATE</div>
              <div style={{ marginTop: '4px' }}>
                {(() => {
                  const b = getStatusBadgeStyle(inspectedSensor.runtimeStatus);
                  return (
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                      {b.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>CURRENT STATE OWNER</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={14} color="#2563EB" />
                <span>{inspectedSensor.currentStateOwner || 'Commissioning Service'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>LAST TRANSITION TIME</div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-code)', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color="#6B7280" />
                <span>{inspectedSensor.lastTransitionTime ? new Date(inspectedSensor.lastTransitionTime).toLocaleString() : new Date(inspectedSensor.createdAt || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>TRANSITION REASON</div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{inspectedSensor.lastTransitionReason || 'Runtime Sensor Created from Commissioning Artifact'}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Control Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filter by Sensor ID, Type, Node..."
              className="input-field"
              style={{ paddingLeft: '30px', height: '34px', fontSize: '13px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#6B7280" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>ASSET:</span>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '180px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              <option value="ALL">All Assets</option>
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>OPERATIONAL STATE:</span>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '180px' }}
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              <option value="PROVISIONED">Provisioned</option>
              <option value="ACTIVE">Active</option>
              <option value="RECEIVING_TELEMETRY">Receiving Telemetry</option>
              <option value="COMMUNICATION_LOST">Communication Lost</option>
              <option value="FAULT">Fault</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Showing <b>{filteredSensors.length}</b> of {sensors.length} Sensors
        </span>
      </div>

      {/* Error Feedback */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Runtime Sensor Data Grid */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} color="#166534" />
            <span>LIVE OPERATIONAL RUNTIME SENSOR REGISTRY (SYSTEM CONTROLLED)</span>
          </div>
          <span style={{ fontSize: '11px', color: '#6B7280' }}>
            Select any sensor row to inspect system status ownership and transition logs
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading runtime sensor registry...</div>
        ) : (
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>RUNTIME SENSOR ID</th>
                <th style={{ width: '18%' }}>SENSOR TYPE</th>
                <th style={{ width: '15%' }}>ENGINEERING NODE</th>
                <th style={{ width: '12%' }}>CHAINAGE (km)</th>
                <th style={{ width: '15%' }}>COMMISSIONING REF</th>
                <th style={{ width: '15%' }}>RUNTIME STATE</th>
                <th style={{ width: '10%', textAlign: 'right' }}>STATE OWNER</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((row) => {
                const badge = getStatusBadgeStyle(row.runtimeStatus);
                const isSelected = inspectedSensor?.id === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setInspectedSensor(row)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : 'transparent',
                    }}
                  >
                    <td>
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE', fontWeight: 700 }}>
                        {row.sensorCode}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={14} color="#2563EB" />
                        <span>{row.sensorType}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                        {row.nodeCode} (#{row.nodeNumber})
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-code)', color: '#4B5563' }}>
                        km {row.formattedChainage || row.nodeChainage}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: '#6B7280' }}>
                        {row.commissioningReference || 'COMM-SUCCESS'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>
                        {row.currentStateOwner || 'Commissioning Service'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredSensors.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                    No runtime sensors found in registry. Complete Commissioning on an Engineering Node to generate Runtime Sensors.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Permanent Transition Audit Log Modal */}
      {showLogModal && inspectedSensor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31, 41, 55, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '680px', padding: '24px 28px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={18} color="#2563EB" />
                  <span>Runtime State Transition Log</span>
                </h3>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Permanent Immutable Audit History for Sensor <b>{inspectedSensor.sensorCode}</b> ({inspectedSensor.sensorType})
                </div>
              </div>
              <button onClick={() => setShowLogModal(false)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>Close</button>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {inspectedSensor.transitionLogs && inspectedSensor.transitionLogs.length > 0 ? (
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>TIMESTAMP</th>
                      <th style={{ width: '30%' }}>STATE TRANSITION</th>
                      <th style={{ width: '25%' }}>SYSTEM OWNER</th>
                      <th style={{ width: '20%' }}>REASON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectedSensor.transitionLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '11px', fontFamily: 'var(--font-code)', color: '#374151' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ fontSize: '12px', fontWeight: 600 }}>
                          <span style={{ color: '#6B7280' }}>{log.previousState}</span>
                          <span style={{ color: '#2563EB', margin: '0 6px' }}>→</span>
                          <span style={{ color: '#1F2937' }}>{log.newState}</span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
                          {log.transitionOwner}
                        </td>
                        <td style={{ fontSize: '11px', color: '#4B5563' }}>
                          {log.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '16px 20px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1F2937' }}>Initial Transition Record</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    <b>Time:</b> {new Date(inspectedSensor.lastTransitionTime || inspectedSensor.createdAt || Date.now()).toLocaleString()}<br />
                    <b>Transition:</b> NONE → PROVISIONED<br />
                    <b>Owner:</b> Commissioning Service<br />
                    <b>Reason:</b> Runtime Sensor Created from Commissioning Artifact
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
