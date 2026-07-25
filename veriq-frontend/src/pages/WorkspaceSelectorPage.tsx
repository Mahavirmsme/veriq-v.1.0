import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Sliders, ShieldAlert, ArrowRight, User } from 'lucide-react';

export const WorkspaceSelectorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const workspaces = [
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
      path: '/config',
      title: 'Project Configuration Workspace',
      description: 'Author Digital Twin hierarchy from Organization down to Sensor Package Strategy & Commissioning.',
      icon: Sliders,
      accent: '#2563EB'
    },
    {
      id: 'operations',
      path: '/ops',
      title: 'Operations Command Center',
      description: 'Operate infrastructure, monitor linear embankment ribbon, inspect nodes & execute engineering decisions.',
      icon: ShieldAlert,
      accent: '#059669'
    }
  ];

  const userWorkspaces = user?.allowedWorkspaces || ['administration', 'configuration', 'operations'];

  const handleSelect = (path: string) => {
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
      <div style={{ width: '100%', maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
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
            Your account has access to multiple workspaces. Select a workspace to enter.
          </p>
        </div>

        {/* Workspace Selection Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {workspaces.map((ws) => {
            const isAllowed = userWorkspaces.includes(ws.id);
            const Icon = ws.icon;

            return (
              <div
                key={ws.id}
                onClick={() => isAllowed && handleSelect(ws.path)}
                style={{
                  background: '#1E293B',
                  border: `1px solid ${isAllowed ? '#334155' : '#1E293B'}`,
                  borderTop: `4px solid ${ws.accent}`,
                  borderRadius: '8px',
                  padding: '24px',
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
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
                    {ws.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                    {ws.description}
                  </p>
                </div>

                <button
                  disabled={!isAllowed}
                  style={{
                    background: isAllowed ? '#2563EB' : '#334155',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isAllowed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    marginTop: '8px'
                  }}
                >
                  Enter Workspace <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
