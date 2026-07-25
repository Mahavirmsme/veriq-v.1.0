import React, { useState } from 'react';
import { Users, ShieldCheck, FileText, Settings, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdministrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit' | 'settings'>('users');

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Workspace Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '20px',
        borderLeft: '4px solid #0F172A'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em' }}>
          WORKSPACE-1: ADMINISTRATION
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '4px 0 2px' }}>
          Enterprise Administration & Governance
        </h1>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Manage user access, security roles, permission policies, system audit logs, and platform licensing.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #CBD5E1', paddingBottom: '8px' }}>
        {[
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
          { id: 'audit', label: 'Audit Log Trail', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '4px',
                border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: isActive ? '#EFF6FF' : '#FFFFFF',
                color: isActive ? '#1E40AF' : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', fontWeight: 800, fontSize: '13px', color: '#0F172A' }}>
            ENTERPRISE USER DIRECTORY (ROLE ASSIGNMENTS)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>User Name</th>
                <th style={{ padding: '12px 20px' }}>Email</th>
                <th style={{ padding: '12px 20px' }}>Enterprise Role</th>
                <th style={{ padding: '12px 20px' }}>Department</th>
                <th style={{ padding: '12px 20px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Principal Secretary', email: 'sec.wrd@bihar.gov.in', role: 'CHIEF_ENGINEER', dept: 'WRD Headquarters', status: 'ACTIVE' },
                { name: 'Superintending Engineer', email: 'se.kosi@bihar.gov.in', role: 'ASSET_MANAGER', dept: 'Kosi Zone', status: 'ACTIVE' },
                { name: 'Executive Engineer', email: 'ee.patna@bihar.gov.in', role: 'REGIONAL_ENGINEER', dept: 'Patna Region', status: 'ACTIVE' },
                { name: 'Configuration Lead', email: 'config.lead@veriq.io', role: 'CONFIG_ENGINEER', dept: 'Digital Engineering', status: 'ACTIVE' },
                { name: 'System Administrator', email: 'admin@veriq.io', role: 'ADMIN', dept: 'IT Infrastructure', status: 'ACTIVE' },
              ].map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F172A' }}>{u.name}</td>
                  <td style={{ padding: '14px 20px', color: '#475569', fontFamily: 'monospace' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>{u.dept}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#047857', fontWeight: 700, fontSize: '12px' }}>● {u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { title: 'ADMIN', desc: 'Full System Administration, User Management, License, & Security Policy control.' },
            { title: 'CONFIG_ENGINEER', desc: 'Digital Infrastructure Authoring, Hierarchy Design, Publishing & Commissioning.' },
            { title: 'CHIEF_ENGINEER', desc: 'WRD Headquarters Command Center access & statewide risk overview.' },
            { title: 'ASSET_MANAGER', desc: 'Asset Command Dashboard access & regional sector oversight.' },
            { title: 'REGIONAL_ENGINEER', desc: 'Region Operations Dashboard access & Linear Ribbon investigation.' },
            { title: 'FIELD_ENGINEER', desc: 'Node Engineering Workspace access & field telemetry inspection.' },
          ].map((r, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{r.title}</div>
              <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>PLATFORM SECURITY AUDIT LOG TRAIL</h3>
          <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>
            [2026-07-25 18:55:12] USER admin@veriq.io ASSIGNED ROLE CONFIG_ENGINEER TO user@veriq.io<br/>
            [2026-07-25 18:42:01] SYSTEM VERIQ_RUNTIME_SERVICE EXECUTED SCHEDULER HEARTBEAT (15s)<br/>
            [2026-07-25 18:28:16] ENGINE REGION_HEALTH_ENGINE UPDATED REGION_STATE FOR REGION-01 (STABLE)
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>SYSTEM & LICENSE CONFIGURATION</h3>
          <div style={{ fontSize: '13px', color: '#334155' }}>
            VERIQ Platform License: <strong>ENTERPRISE UNLIMITED</strong> | Expiry: <strong>2030-12-31</strong><br/>
            Database Engine: <strong>PostgreSQL veriq_db (Flyway V16 Migration Active)</strong>
          </div>
        </div>
      )}

    </div>
  );
};
