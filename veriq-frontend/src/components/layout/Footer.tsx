import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid #E5E7EB',
      padding: '12px 24px',
      background: '#F5F7FA',
      color: '#6B7280',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        © 2026 VERIQ Platform • Enterprise Engineering Decision Intelligence
      </div>
      <div style={{ display: 'flex', gap: '16px', color: '#9CA3AF' }}>
        <span>Architecture: 10-Tier Frozen</span>
        <span>Version: 2.0.0-ENTERPRISE</span>
      </div>
    </footer>
  );
};
