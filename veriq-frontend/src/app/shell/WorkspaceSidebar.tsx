import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspace } from '../workspace/WorkspaceContext';
import { 
  Building2, Users, ShieldCheck, Key, FileText, Settings, 
  Sliders, ShieldAlert, Layers, AlertTriangle, Wrench, BarChart2 
} from 'lucide-react';

export const WorkspaceSidebar: React.FC = () => {
  const { activeWorkspace } = useWorkspace();

  const adminNav = [
    { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Roles', path: '/admin/roles', icon: ShieldCheck },
    { label: 'Permissions', path: '/admin/permissions', icon: Key },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const configNav = [
    { label: 'Project Configuration', path: '/config/wizard', icon: Sliders },
  ];

  const opsNav = [
    { label: 'Overview', path: '/ops/overview', icon: ShieldAlert },
    { label: 'Assets', path: '/ops/assets', icon: Layers },
    { label: 'Alerts', path: '/ops/alerts', icon: AlertTriangle },
    { label: 'Maintenance', path: '/ops/maintenance', icon: Wrench },
    { label: 'Reports', path: '/ops/reports', icon: FileText },
    { label: 'Analytics', path: '/ops/analytics', icon: BarChart2 },
  ];

  const currentNav = activeWorkspace === 'administration' 
    ? adminNav 
    : activeWorkspace === 'configuration' 
    ? configNav 
    : opsNav;

  const headerTitle = activeWorkspace === 'administration' 
    ? 'ADMINISTRATION' 
    : activeWorkspace === 'configuration' 
    ? 'PROJECT CONFIGURATION' 
    : 'OPERATIONS COMMAND';

  return (
    <aside style={{
      width: '230px',
      borderRight: '1px solid #CBD5E1',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 10px',
      gap: '4px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        padding: '6px 10px 12px',
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.08em',
        color: '#64748B',
        textTransform: 'uppercase',
        borderBottom: '1px solid #F1F5F9',
        marginBottom: '6px'
      }}>
        {headerTitle} NAVIGATION
      </div>

      {currentNav.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '6px',
              color: isActive ? '#1E40AF' : '#334155',
              background: isActive ? '#EFF6FF' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '13px',
              borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
              textDecoration: 'none',
              transition: 'all 100ms ease'
            })}
          >
            <Icon size={16} color="#475569" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
