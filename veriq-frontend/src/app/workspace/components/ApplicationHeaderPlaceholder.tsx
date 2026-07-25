import React from 'react';

export const ApplicationHeaderPlaceholder: React.FC = () => {
  return (
    <div className="veriq-placeholder-box" style={{ padding: '0 12px', border: 'none' }}>
      <div className="veriq-placeholder-header" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="veriq-placeholder-title" style={{ color: '#F8FAFC', fontSize: '13px' }}>
            VERIQ :: ENTERPRISE INFRASTRUCTURE INTELLIGENCE PLATFORM
          </span>
          <span className="veriq-placeholder-badge">REGION-1 : APPLICATION HEADER</span>
        </div>
        <div className="veriq-placeholder-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderColor: '#10B981' }}>
          SYSTEM READY
        </div>
      </div>
    </div>
  );
};
