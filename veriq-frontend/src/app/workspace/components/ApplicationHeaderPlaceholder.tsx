import React from 'react';

export const ApplicationHeaderPlaceholder: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '36px',
      background: '#0B1120',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      boxSizing: 'border-box',
      borderBottom: '1px solid #1E293B',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '4px',
          background: '#2563EB',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          V
        </div>
        <span style={{ color: '#F8FAFC', fontSize: '13px', fontWeight: 800, letterSpacing: '-0.01em' }}>
          VERIQ <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: '12px', marginLeft: '6px' }}>| Operations Command Center</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
        <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, fontFamily: 'monospace' }}>
          SYSTEM ONLINE
        </span>
      </div>
    </div>
  );
};
