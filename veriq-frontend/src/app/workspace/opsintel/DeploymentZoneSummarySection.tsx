import React from 'react';

export const DeploymentZoneSummarySection: React.FC = () => {
  const items = [
    { label: 'Zone Matrix', placeholder: '[ Matrix Placeholder ]' },
    { label: 'Distribution', placeholder: '[ Distribution Placeholder ]' },
    { label: 'Coverage', placeholder: '[ Coverage Placeholder ]' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Deployment Zone Summary</span>
        <span>DZ Matrix</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => (
          <div key={idx} className="veriq-opsintel-item-placeholder">
            <span style={{ color: '#DB2777', fontWeight: 600 }}>[{item.label}]</span>
            <span>{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
