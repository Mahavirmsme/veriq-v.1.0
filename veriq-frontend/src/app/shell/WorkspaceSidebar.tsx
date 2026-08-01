import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../workspace/WorkspaceContext';
import { 
  Building2, Briefcase, Users, ShieldCheck, Key, FileText, Settings,
  Folder, Layers, LayoutGrid, Cpu, Radio, Activity, CheckCircle2,
  Globe, Server, Terminal, Wrench, Award
} from 'lucide-react';
import { hasDeveloperPermission } from '../authentication/RoleResolver';

export const WorkspaceSidebar: React.FC = () => {
  const { user } = useAuth();
  const { allowedWorkspaces } = useWorkspace();
  const location = useLocation();
  const userRole = (user as any)?.role || (user?.roles && user.roles[0]) || 'ROLE_ORG_ADMIN';
  const isDeveloper = hasDeveloperPermission(userRole);

  const isConfigWorkspace = location.pathname.startsWith('/config') || location.pathname.startsWith('/configuration');

  const portfolioNav = [
    { label: 'Infrastructure Overview', path: '/portfolio', icon: Globe },
  ];

  const adminNav = [
    { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Designations', path: '/admin/designations', icon: Briefcase },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Roles', path: '/admin/roles', icon: ShieldCheck },
    { label: 'Workspace Permission Matrix', path: '/admin/permissions', icon: Key },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // STRICT WORKSPACE ISOLATION: Project Configuration Left Menu MUST contain ONLY these 9 items
  const isolatedProjectConfigNav = [
    { label: 'Projects', path: '/config/projects', icon: Folder },
    { label: 'Assets', path: '/config/assets', icon: Layers },
    { label: 'Regions', path: '/config/regions', icon: LayoutGrid },
    { label: 'Deployment Zones', path: '/config/deployment-zones', icon: Cpu },
    { label: 'Engineering Nodes', path: '/config/nodes', icon: Radio },
    { label: 'Sensor Packages', path: '/config/sensors', icon: Activity },
    { label: 'Commissioning', path: '/config/commissioning', icon: CheckCircle2 },
    { label: 'Engineering Release Review', path: '/config/release-review', icon: Award },
    { label: 'Published Runtime', path: '/ops/dashboard', icon: Globe },
  ];

  const clientOpsNav = [
    { label: 'Operations Dashboard', path: '/ops/dashboard', icon: LayoutGrid },
    { label: 'Asset Command Matrix', path: '/ops/assets', icon: Layers },
    { label: 'Runtime Node Explorer', path: '/ops/nodes', icon: Radio },
    { label: 'Runtime Sensors', path: '/ops/runtime-sensors', icon: Activity },
    { label: 'Runtime Services', path: '/ops/runtime-services', icon: Server },
  ];

  const developerNav = [
    { label: 'Asset Command Matrix', path: '/ops/assets', icon: Layers },
    { label: 'Runtime Node Inspector', path: '/ops/assets?devTool=node-inspector', icon: Wrench },
    { label: 'Runtime Sensor Inspector', path: '/ops/runtime-sensors', icon: Radio },
    { label: 'Runtime Event Viewer', path: '/ops/runtime-services', icon: Terminal },
    { label: 'Runtime Health Debugger', path: '/ops/assets?devTool=health-debugger', icon: Cpu },
  ];

  return (
    <aside style={{
      width: '240px',
      background: '#0F172A',
      color: '#94A3B8',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1E293B',
      userSelect: 'none',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        
        {/* WORKSPACE ISOLATION CASE 1: PROJECT CONFIGURATION WORKSPACE */}
        {isConfigWorkspace ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
              Project Configuration
            </div>

            {isolatedProjectConfigNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    background: isActive ? '#1E293B' : 'transparent',
                    textDecoration: 'none',
                    marginBottom: '2px',
                    transition: 'all 100ms ease'
                  })}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ) : (
          /* WORKSPACE ISOLATION CASE 2: OTHER WORKSPACES (PORTFOLIO, OPS, ADMIN) */
          <>
            {/* SECTION 1: PORTFOLIO CENTER NAVIGATION */}
            {allowedWorkspaces.includes('portfolio') && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                  Portfolio Center
                </div>
                {portfolioNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                        background: isActive ? '#1E293B' : 'transparent',
                        textDecoration: 'none',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      })}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}

            {/* SECTION 2: OPERATIONS COMMAND CENTER NAVIGATION */}
            {allowedWorkspaces.includes('operations') && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                  Operations Command Center
                </div>
                {clientOpsNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                        background: isActive ? '#1E293B' : 'transparent',
                        textDecoration: 'none',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      })}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}

            {/* SECTION 3: ADMINISTRATION NAVIGATION */}
            {allowedWorkspaces.includes('administration') && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                  Administration
                </div>
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                        background: isActive ? '#1E293B' : 'transparent',
                        textDecoration: 'none',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      })}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}

            {/* DEVELOPER / DIAGNOSTIC TOOLS (RBAC PROTECTED) */}
            {isDeveloper && allowedWorkspaces.includes('operations') && (
              <div style={{ marginBottom: '16px', borderTop: '1px solid #1E293B', paddingTop: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={12} color="#F59E0B" />
                  <span>Engineering Diagnostics</span>
                </div>
                {developerNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isActive ? '#F59E0B' : '#CBD5E1',
                        background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                        textDecoration: 'none',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      })}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </aside>
  );
};
