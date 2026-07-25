import React from 'react';
import { useWorkspace } from '../workspace/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceType } from '../authentication/RoleResolver';
import { 
  Building2, Sliders, ShieldAlert, LogOut, User, 
  Activity, Layers, Settings, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlatformHeader: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace, allowedWorkspaces, userRole } = useWorkspace();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleWorkspaceChange = (ws: WorkspaceType) => {
    setActiveWorkspace(ws);
    if (ws === 'administration') navigate('/admin');
    else if (ws === 'configuration') navigate('/config');
    else navigate('/ops');
  };

  const getWorkspaceIcon = (ws: WorkspaceType) => {
    switch (ws) {
      case 'administration': return <Settings size={15} />;
      case 'configuration': return <Sliders size={15} />;
      case 'operations': return <ShieldAlert size={15} />;
    }
  };

  const getWorkspaceLabel = (ws: WorkspaceType) => {
    switch (ws) {
      case 'administration': return 'Administration Workspace';
      case 'configuration': return 'Project Configuration';
      case 'operations': return 'Operations Command Center';
    }
  };

  return (
    <header style={{
      height: '56px',
      background: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '2px solid #1E293B',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/ops')}>
          <div style={{
            width: '28px',
            height: '28px',
            background: '#2563EB',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '15px',
            color: '#FFFFFF',
            letterSpacing: '0.05em'
          }}>
            V
          </div>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.06em', color: '#FFFFFF' }}>VERIQ</span>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, marginLeft: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INFRASTRUCTURE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Live System Heartbeat */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '2px 10px',
          fontSize: '11px',
          color: '#34D399',
          fontWeight: 600
        }}>
          <CheckCircle2 size={12} color="#34D399" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1E293B', padding: '4px', borderRadius: '6px', border: '1px solid #334155' }}>
        {allowedWorkspaces.map((ws) => {
          const isActive = activeWorkspace === ws;
          return (
            <button
              key={ws}
              onClick={() => handleWorkspaceChange(ws)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 100ms ease'
              }}
            >
              {getWorkspaceIcon(ws)}
              <span>{getWorkspaceLabel(ws)}</span>
            </button>
          );
        })}
      </div>

      {/* User Session & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
            {user?.username || 'User Session'}
          </div>
          <div style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 600, fontFamily: 'monospace' }}>
            ROLE: {userRole}
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out of VERIQ Platform"
          style={{
            background: 'transparent',
            color: '#94A3B8',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <LogOut size={14} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};
