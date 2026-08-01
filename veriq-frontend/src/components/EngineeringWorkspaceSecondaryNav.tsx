import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { LayoutGrid, Radio, Server, CheckCircle2 } from 'lucide-react';

export const EngineeringWorkspaceSecondaryNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activePath = location.pathname;

  const buildUrl = (targetPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const queryStr = params.toString();
    return queryStr ? `${targetPath}?${queryStr}` : targetPath;
  };

  const navItems = [
    { label: 'Sector & Node Matrix', path: '/ops/engineering-workspace', icon: LayoutGrid },
    { label: 'Runtime Sensors', path: '/ops/runtime-sensors', icon: Radio },
    { label: 'Runtime Services', path: '/ops/runtime-services', icon: Server },
    { label: 'Commissioning Status', path: '/ops/commissioning-status', icon: CheckCircle2 },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#FFFFFF',
      padding: '8px 16px',
      borderBottom: '1px solid #E2E8F0',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif'
    }}>
      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: '4px' }}>
        ENGINEERING SHORTCUTS:
      </span>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = 
          activePath === item.path || 
          (item.path === '/ops/engineering-workspace' && activePath.includes('/ops/engineering-workspace')) ||
          (item.path === '/ops/commissioning-status' && activePath.includes('/ops/commissioning'));

        return (
          <button
            key={item.path}
            onClick={() => navigate(buildUrl(item.path))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: isActive ? '1px solid #2563EB' : '1px solid #CBD5E1',
              background: isActive ? '#EFF6FF' : '#F8FAFC',
              color: isActive ? '#1E40AF' : '#475569',
              fontWeight: isActive ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 100ms ease'
            }}
          >
            <Icon size={14} color={isActive ? '#2563EB' : '#64748B'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
