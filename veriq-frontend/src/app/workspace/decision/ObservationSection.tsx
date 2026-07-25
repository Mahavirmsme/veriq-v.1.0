import React from 'react';

export const ObservationSection: React.FC = () => {
  const observations = [
    { label: 'Structural', placeholder: '[ Structural Observation Placeholder ]' },
    { label: 'Monitoring', placeholder: '[ Monitoring Observation Placeholder ]' }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Engineering Observations</span>
        <span>4 Types</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {observations.map((obs, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder">
            <span style={{ fontSize: '10px', color: '#0284C7', fontWeight: 600 }}>[{obs.label}]</span>
            <span style={{ fontSize: '10px' }}>{obs.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
