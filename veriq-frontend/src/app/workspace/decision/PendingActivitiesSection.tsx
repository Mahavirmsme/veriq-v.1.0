import React from 'react';

export const PendingActivitiesSection: React.FC = () => {
  const activities = [
    { type: 'Inspection', placeholder: '[ Pending Field Inspection ]' },
    { type: 'Validation', placeholder: '[ Pending Data Validation ]' }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Pending Activities</span>
        <span>Queue</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {activities.map((act, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder" style={{ height: '28px' }}>
            <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>{act.type}</span>
            <span style={{ fontSize: '10px' }}>{act.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
