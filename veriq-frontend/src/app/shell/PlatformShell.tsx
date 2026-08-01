import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PlatformHeader } from './PlatformHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';

export const PlatformShell: React.FC = () => {
  const location = useLocation();

  // The Executive Portfolio Center (/portfolio) and Operations Command Center 
  // are single executive landing pages and must NOT be disturbed with an outer sidebar.
  const isFullWidthLandingPage = 
    location.pathname === '/portfolio' ||
    location.pathname === '/ops/dashboard' || 
    location.pathname === '/ops/command-center' || 
    location.pathname === '/ops' ||
    location.pathname === '/dashboard';

  const showSidebar = !isFullWidthLandingPage;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Top Enterprise Header */}
      <PlatformHeader />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Workspace Context Sidebar (Transferred to Engineering Workspace pages) */}
        {showSidebar && <WorkspaceSidebar />}

        {/* Workspace Body */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: showSidebar ? '24px 32px 60px' : '0',
          background: '#F8FAFC',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
