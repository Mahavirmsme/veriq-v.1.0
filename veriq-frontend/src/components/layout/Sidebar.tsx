import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Home, FolderKanban, Cpu, Layers, Activity, BrainCircuit } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview', path: '/', icon: Home },
    { label: 'Organizations', path: '/organizations', icon: Building2 },
    { label: 'Projects', path: '/projects', icon: FolderKanban, disabled: true },
    { label: 'Engineering Design', path: '/engineering-design', icon: Cpu, disabled: true },
    { label: 'Deployment Designer', path: '/deployment-designer', icon: Layers, disabled: true },
    { label: 'Commissioning & Ops', path: '/operations', icon: Activity, disabled: true },
    { label: 'Decision Intelligence', path: '/intelligence', icon: BrainCircuit, disabled: true },
  ];

  return (
    <aside style={{
      width: '230px',
      borderRight: '1px solid #E5E7EB',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 10px',
      gap: '4px'
    }}>
      <div style={{ padding: '4px 10px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#9CA3AF', textTransform: 'uppercase' }}>
        MODULE NAVIGATION
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.disabled) {
          return (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '6px',
              color: '#9CA3AF',
              opacity: 0.6,
              cursor: 'not-allowed',
              fontSize: '13px'
            }}>
              <Icon size={16} />
              <span>{item.label}</span>
            </div>
          );
        }

        return (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '6px',
              color: isActive ? '#2563EB' : '#4B5563',
              background: isActive ? '#EFF6FF' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: '13px',
              borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
              transition: 'all 100ms ease'
            })}
          >
            <Icon size={16} color={item.path === '/organizations' ? '#2563EB' : '#6B7280'} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
