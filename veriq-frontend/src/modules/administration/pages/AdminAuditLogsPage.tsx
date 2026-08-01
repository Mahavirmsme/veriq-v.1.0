import React, { useEffect, useState } from 'react';
import { permissionService, AuditLogDTO } from '../../../services/permissionService';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await permissionService.getAllAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load security audit logs');
    } finally {
      setLoading(false);
    }
  };

  const actions = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))];

  const filteredLogs = logs.filter(l => {
    const matchesAction = filterAction === 'ALL' || l.action === filterAction;
    const matchesSearch = (l.action && l.action.toLowerCase().includes(search.toLowerCase())) ||
                          (l.resourceType && l.resourceType.toLowerCase().includes(search.toLowerCase())) ||
                          (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
                          (l.userId && l.userId.toLowerCase().includes(search.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Security Audit Log Trail
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
              Immutable Tenant Activity & Security Records
            </p>
          </div>
          <div style={{ background: '#F1F5F9', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
            Total Audit Records: {logs.length}
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search action, resource, details, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px'
            }}
          />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          >
            {actions.map(act => (
              <option key={act} value={act}>{act === 'ALL' ? 'All Actions' : act}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
            Loading audit log trail...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLogs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
            No audit log records found for current tenant.
          </div>
        )}

        {/* Audit Log Table */}
        {!loading && !error && filteredLogs.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Timestamp</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Action</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Resource</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Result</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>IP Address</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {l.timestamp ? new Date(l.timestamp).toLocaleString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {l.action}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                        {l.resourceType}:{l.resourceId || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: l.result === 'SUCCESS' ? '#DCFCE7' : '#FEE2E2',
                        color: l.result === 'SUCCESS' ? '#15803D' : '#B91C1C',
                        border: `1px solid ${l.result === 'SUCCESS' ? '#86EFAC' : '#FCA5A5'}`
                      }}>
                        {l.result}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#475569' }}>
                      {l.ipAddress || '127.0.0.1'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      {l.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
