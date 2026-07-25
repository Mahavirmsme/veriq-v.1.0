import React from 'react';

export const EngineeringTimelineSection: React.FC = () => {
  const items = [
    { label: 'Inspection', placeholder: '[ Inspection Timeline ]' },
    { label: 'Monitoring', placeholder: '[ Monitoring Timeline ]' },
    { label: 'Maintenance', placeholder: '[ Maintenance Timeline ]' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Engineering Timeline</span>
        <span>Chronology</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => (
          <div key={idx} className="veriq-opsintel-item-placeholder">
            <span style={{ color: '#2563EB', fontWeight: 600 }}>[{item.label}]</span>
            <span>{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
