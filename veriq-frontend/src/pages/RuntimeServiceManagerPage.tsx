import React from 'react';
import { ChevronRight, Activity, Play, Pause, RefreshCw, Zap, Clock, Terminal, Radio, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import { useRuntimeServiceManager } from '../hooks/useRuntimeServiceManager';

export const RuntimeServiceManagerPage: React.FC = () => {
  const { status, loading, error, lastProducedPackets, startService, pauseService, triggerManualCycle } = useRuntimeServiceManager();

  const isRunning = status?.running ?? true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Runtime Services</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Heartbeat Service Manager</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Runtime Service Manager</h1>
            
            {/* Visual Heartbeat Pulse Indicator */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: isRunning ? '#F0FDF4' : '#FFFBEB',
              color: isRunning ? '#166534' : '#B45309',
              border: isRunning ? '1px solid #BBF7D0' : '1px solid #FDE68A',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isRunning ? '#22C55E' : '#F59E0B',
                boxShadow: isRunning ? '0 0 8px #22C55E' : 'none',
              }} />
              <span>{isRunning ? 'HEARTBEAT ACTIVE (15s CYCLE)' : 'SERVICE PAUSED'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isRunning ? (
            <button onClick={pauseService} disabled={loading} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', color: '#B45309', borderColor: '#FDE68A', background: '#FFFBEB' }}>
              <Pause size={14} color="#D97706" />
              <span>Pause Heartbeat</span>
            </button>
          ) : (
            <button onClick={startService} disabled={loading} className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Play size={14} />
              <span>Start Heartbeat</span>
            </button>
          )}

          <button onClick={triggerManualCycle} disabled={loading} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}>
            <Zap size={14} color="#2563EB" />
            <span>Trigger Manual Cycle</span>
          </button>
        </div>
      </div>

      {/* VERIQ Architecture Flow Banner */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#2563EB" />
          <span>VERIQ RUNTIME HEARTBEAT PIPELINE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={14} color="#6B7280" /> Runtime Registry</span>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontWeight: 700 }}><Activity size={14} color="#2563EB" /> Service Manager (15s Loop)</span>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Radio size={14} color="#059669" /> Telemetry Provider Contract</span>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} color="#D97706" /> Telemetry Packets Stream</span>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280' }}><ShieldCheck size={14} color="#6B7280" /> Telemetry Service</span>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>SERVICE STATE</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: isRunning ? '#166534' : '#B45309', marginTop: '2px' }}>
            {isRunning ? 'RUNNING' : 'PAUSED'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>CYCLE INTERVAL</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="#2563EB" />
            <span>15 Seconds</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>CYCLES EXECUTED</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginTop: '2px' }}>
            {status?.totalCyclesExecuted ?? 0}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>PACKETS PRODUCED</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>
            {status?.totalPacketsProduced ?? 0}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ACTIVE RUNTIME SENSORS</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#166534', marginTop: '2px' }}>
            {status?.activeSensorsCount ?? 0}
          </div>
        </div>
      </div>

      {/* Error Feedback */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Real-Time Execution Console Stream */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1E293B', background: '#1E293B' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} color="#38BDF8" />
            <span>REAL-TIME EXECUTION LOG CONSOLE</span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-code)' }}>
            Last Cycle: {status?.lastCycleTime ? new Date(status.lastCycleTime).toLocaleTimeString() : '--'}
          </span>
        </div>

        <div style={{ padding: '14px 16px', fontFamily: 'var(--font-code)', fontSize: '12px', color: '#F1F5F9', maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {status?.recentExecutionLogs && status.recentExecutionLogs.length > 0 ? (
            status.recentExecutionLogs.map((log, i) => (
              <div key={i} style={{ color: log.includes('Error') ? '#F87171' : log.includes('PAUSED') ? '#FBBF24' : '#4ADE80' }}>
                {log}
              </div>
            ))
          ) : (
            <div style={{ color: '#94A3B8', fontStyle: 'italic' }}>Initializing execution console...</div>
          )}
        </div>
      </div>

      {/* Produced Telemetry Packets Table */}
      {lastProducedPackets.length > 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={13} color="#2563EB" />
              <span>PRODUCED TELEMETRY PACKETS (LAST CYCLE)</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              Packets published to Telemetry Module
            </span>
          </div>

          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>PACKET ID</th>
                <th style={{ width: '20%' }}>SENSOR CODE</th>
                <th style={{ width: '25%' }}>SENSOR TYPE</th>
                <th style={{ width: '15%', textAlign: 'center' }}>READING VALUE</th>
                <th style={{ width: '15%', textAlign: 'right' }}>QUALITY</th>
              </tr>
            </thead>
            <tbody>
              {lastProducedPackets.map((p) => (
                <tr key={p.packetId}>
                  <td style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: '#6B7280' }}>
                    {p.packetId}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE', fontWeight: 700 }}>
                      {p.sensorCode}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937' }}>
                    {p.sensorType}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                      {p.value} {p.unit}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge badge-active" style={{ background: '#F0FDF4', color: '#166534' }}>
                      {p.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
