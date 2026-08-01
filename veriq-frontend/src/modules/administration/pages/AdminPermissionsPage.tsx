import React from 'react';
import { WORKSPACE_PERMISSIONS } from '../services/workspacePermissionMapper';
import { useNavigate } from 'react-router-dom';

export const AdminPermissionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Workspace Permission Matrix Overview
            </h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
              Business-facing workspace capabilities mapped automatically to internal authorization engines
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/roles')}
            style={{
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Configure Role Matrix →
          </button>
        </div>

        {/* Informational Banner */}
        <div style={{
          padding: '12px 16px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '6px',
          color: '#1E40AF',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>ℹ️ Business-Facing Matrix: Manages permissions using domain engineering capabilities. Internal system tokens remain encapsulated.</span>
          <span style={{ fontSize: '10px', background: '#DBEAFE', padding: '2px 8px', borderRadius: '4px', border: '1px solid #93C5FD' }}>
            ORGANIZATION ADMIN MATRIX
          </span>
        </div>

        {/* Workspace Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {WORKSPACE_PERMISSIONS.map(group => (
            <div key={group.id} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {group.title}
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0' }}>
                  {group.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.actions.map(act => (
                  <div key={act.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E40AF' }}>
                      [ ] {act.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', lineHeight: 1.2 }}>
                      {act.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/admin/roles')}
            style={{
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Assign Workspace Permissions to Roles →
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPermissionsPage;
