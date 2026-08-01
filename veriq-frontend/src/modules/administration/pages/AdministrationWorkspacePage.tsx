import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, ShieldCheck, Key, FileText, Settings, Activity, Clock, Shield, Server, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Enterprise Administration Workspace Home Overview.
 * Default Landing Page for Administrator users upon Role Resolution.
 * Provides System Status, Administration Modules, Quick Actions, Activity Logs, and Session Context.
 */
export const AdministrationWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userEmail = (user as any)?.email || 'admin@veriq.io';
  const userRole = (user as any)?.role || 'ADMINISTRATOR';

  const adminModules = [
    {
      title: 'Organizations',
      path: '/admin/organizations',
      description: 'Manage enterprise authority organizations and administrative boundaries.',
      icon: Building2,
      count: '1 Active Org',
      color: '#2563EB',
      bgColor: '#EFF6FF'
    },
    {
      title: 'Users & Accounts',
      path: '/admin/users',
      description: 'Manage enterprise user directory, credentials, and role assignments.',
      icon: Users,
      count: '5 Active Users',
      color: '#059669',
      bgColor: '#F0FDF4'
    },
    {
      title: 'Roles & Access Control',
      path: '/admin/roles',
      description: 'Configure security roles, authorization levels, and operational scope.',
      icon: ShieldCheck,
      count: '6 System Roles',
      color: '#7C3AED',
      bgColor: '#FAF5FF'
    },
    {
      title: 'Permissions Matrix',
      path: '/admin/permissions',
      description: 'Define granular resource permissions and functional capability rules.',
      icon: Key,
      count: '18 Policy Rules',
      color: '#D97706',
      bgColor: '#FFFBEB'
    },
    {
      title: 'Audit Logs & Trails',
      path: '/admin/audit-logs',
      description: 'Inspect platform security audit logs, user actions, and system events.',
      icon: FileText,
      count: 'Security Logging Active',
      color: '#0284C7',
      bgColor: '#F0F9FF'
    },
    {
      title: 'System Settings',
      path: '/admin/settings',
      description: 'Configure global platform preferences, license status, and system integrations.',
      icon: Settings,
      count: 'Enterprise v1.0',
      color: '#475569',
      bgColor: '#F8FAFC'
    }
  ];

  const recentActivity = [
    { event: 'User Login Authenticated', user: userEmail, timestamp: 'Just now', type: 'AUTH' },
    { event: 'System Role Resolved to ADMINISTRATOR', user: userEmail, timestamp: '1 min ago', type: 'ROLE' },
    { event: 'Database Migration Flyway V16 Verified', user: 'SYSTEM', timestamp: '10 mins ago', type: 'SYS' },
    { event: 'Commissioning Record V10 Schema Locked', user: 'SYSTEM', timestamp: '1 hour ago', type: 'SCHEMA' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. Administration Workspace Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '20px 24px',
        borderLeft: '5px solid #2563EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            VERIQ Platform Governance
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '4px 0 2px', letterSpacing: '-0.01em' }}>
            Administration Workspace
          </h1>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            Central administration hub for enterprise organization management, user access control, security roles, and system audit trails.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <UserCheck size={20} color="#059669" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Session</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{userEmail}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>● Role: {userRole}</span>
          </div>
        </div>
      </div>

      {/* 2. System Status Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>System Status</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A' }}>OPERATIONAL</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Security Level</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#2563EB' }}>ENTERPRISE RBAC</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#FAF5FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Database Engine</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#7C3AED' }}>PostgreSQL (V16)</div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Platform License</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>ACTIVE UNLIMITED</div>
          </div>
        </div>
      </div>

      {/* 3. Administration Modules Navigation Grid */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Administration Navigation Modules
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {adminModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(mod.path)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: mod.bgColor, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace', background: '#F8FAFC', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    {mod.count}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{mod.title}</span>
                    <ArrowRight size={14} color="#94A3B8" />
                  </h3>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    {mod.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Administrative Activity Log */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>Recent Administrative Activity</span>
          <button
            onClick={() => navigate('/admin/audit-logs')}
            style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            View Audit Trail →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentActivity.map((act, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #F1F5F9', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, fontFamily: 'monospace', background: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '3px' }}>
                  [{act.type}]
                </span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{act.event}</span>
                <span style={{ color: '#64748B', fontFamily: 'monospace', fontSize: '11px' }}>({act.user})</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdministrationWorkspacePage;
