import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlatformHeader } from './PlatformHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';

export const PlatformShell: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Top Enterprise Header */}
      <PlatformHeader />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Workspace Context Sidebar */}
        <WorkspaceSidebar />

        {/* Workspace Body */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
