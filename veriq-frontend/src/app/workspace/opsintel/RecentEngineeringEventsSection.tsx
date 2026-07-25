import React from 'react';

export const RecentEngineeringEventsSection: React.FC = () => {
  const items = [
    { type: 'Inspection', placeholder: '[ Event: Inspection Completed ]' },
    { type: 'Telemetry', placeholder: '[ Event: Sensor Offline ]' },
    { type: 'Lifecycle', placeholder: '[ Event: Node Commissioned ]' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Recent Engineering Events</span>
        <span>Event Log</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => (
          <div key={idx} className="veriq-opsintel-item-placeholder">
            <span style={{ color: '#D97706', fontWeight: 600 }}>[{item.type}]</span>
            <span>{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
