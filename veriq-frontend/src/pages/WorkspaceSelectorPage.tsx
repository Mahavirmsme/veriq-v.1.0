import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Sliders, ShieldAlert, Globe, User } from 'lucide-react';

export const WorkspaceSelectorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const workspaces = [
    {
      id: 'portfolio',
      path: '/portfolio',
      title: 'Portfolio Center',
      description: 'Executive Infrastructure Overview, Portfolio Health Metrics, and Cross-Project Explorer.',
      icon: Globe,
      accent: '#8B5CF6'
    },
    {
      id: 'administration',
      path: '/admin',
      title: 'Administration Workspace',
      description: 'Governance, User Access, Roles, Permissions, Security Audit Logs & System Settings.',
      icon: Settings,
      accent: '#0F172A'
    },
    {
      id: 'configuration',
      path: '/config/projects',
      title: 'Project Configuration Workspace',
      description: 'Author Digital Twin hierarchy from Organization down to Sensor Package Strategy & Commissioning.',
      icon: Sliders,
      accent: '#2563EB'
    },
    {
      id: 'operations',
      path: '/ops',
      title: 'Operations Command Center',
      description: 'Operate infrastructure, monitor linear embankment ribbon, inspect nodes & execute operational decisions.',
      icon: ShieldAlert,
      accent: '#059669'
    }
  ];

  const userWorkspaces = user?.allowedWorkspaces || ['portfolio', 'administration', 'configuration', 'operations'];

  const handleSelect = (id: string, path: string) => {
    localStorage.setItem('veriq_active_workspace', id);
    navigate(path, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Session Info Card */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AUTHENTICATED SESSION LOADED
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 2px' }}>
              Welcome, {user?.name || user?.username || 'Administrator'}
            </h1>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontFamily: 'monospace' }}>
              Assigned Roles: {user?.roles?.join(', ') || 'ADMIN'} | Email: {user?.email || 'admin@veriq.io'}
            </p>
          </div>

          <div style={{
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid #2563EB',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#60A5FA',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={14} />
            <span>Multiple Workspaces Available</span>
          </div>
        </div>

        {/* Workspace Selection Header */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px' }}>
            Select Active Platform Workspace
          </h2>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
            Choose an authorized workspace to launch into its primary operational view
          </p>
        </div>

        {/* Workspace Selection Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {workspaces.map((ws) => {
            const isAllowed = userWorkspaces.includes(ws.id);
            const Icon = ws.icon;

            return (
              <div
                key={ws.id}
                onClick={() => isAllowed && handleSelect(ws.id, ws.path)}
                style={{
                  background: '#1E293B',
                  border: `1px solid ${isAllowed ? '#334155' : '#1E293B'}`,
                  borderTop: `4px solid ${ws.accent}`,
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: isAllowed ? 'pointer' : 'not-allowed',
                  opacity: isAllowed ? 1 : 0.4,
                  transition: 'all 150ms ease'
                }}
              >
                <div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    background: ws.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: '14px'
                  }}>
                    <Icon size={20} />
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>
                    {ws.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                    {ws.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #334155',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isAllowed ? '#60A5FA' : '#64748B'
                }}>
                  <span>{isAllowed ? 'Launch Workspace →' : 'Access Restricted'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default WorkspaceSelectorPage;
