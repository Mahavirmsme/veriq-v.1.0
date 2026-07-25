import React from 'react';

export const NodeSummarySection: React.FC = () => {
  const items = [
    { label: 'Node Status', placeholder: '[ Status Placeholder ]' },
    { label: 'Availability', placeholder: '[ Availability Placeholder ]' },
    { label: 'Node Activity', placeholder: '[ Activity Placeholder ]' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Node Summary</span>
        <span>Cards</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => (
          <div key={idx} className="veriq-opsintel-item-placeholder">
            <span style={{ color: '#7C3AED', fontWeight: 600 }}>[{item.label}]</span>
            <span>{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
