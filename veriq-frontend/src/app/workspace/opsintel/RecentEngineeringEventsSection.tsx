import React from 'react';

interface RecentEngineeringEventsSectionProps {
  events?: { type: string; details: string; timestamp: string }[];
}

export const RecentEngineeringEventsSection: React.FC<RecentEngineeringEventsSectionProps> = ({
  events = [
    { type: 'Commissioning', details: 'Status set to COMMISSIONED', timestamp: '10:15 AM' },
    { type: 'Runtime', details: 'Sensors set to PROVISIONED', timestamp: '10:16 AM' }
  ]
}) => {
  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Recent Events</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
        {events.map((item, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#D97706', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>[{item.type}]</span>
              <span style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace' }}>{item.timestamp}</span>
            </div>
            <span style={{ fontSize: '10px', color: '#1E293B', fontWeight: 600 }}>{item.details}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
