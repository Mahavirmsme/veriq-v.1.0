import React from 'react';

export const RecommendedActionsSection: React.FC = () => {
  const actions = [
    { action: 'Inspect', label: '[ Field Inspection Action ]' },
    { action: 'Monitor', label: '[ Sensor Monitoring Action ]' },
    { action: 'Maintenance', label: '[ Schedule Maintenance Action ]' }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Recommended Actions</span>
        <span>Engineering Guidance</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {actions.map((act, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder">
            <span style={{ fontSize: '10px' }}>{act.label}</span>
            <span className="veriq-decision-action-btn">{act.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
