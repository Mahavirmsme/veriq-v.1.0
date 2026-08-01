import React from 'react';

interface EngineeringTimelineSectionProps {
  timelineEvents?: { label: string; text: string; date: string }[];
}

export const EngineeringTimelineSection: React.FC<EngineeringTimelineSectionProps> = ({
  timelineEvents = [
    { label: 'Runtime', text: 'Sensors Active', date: '2026-07-26' },
    { label: 'Commissioning', text: 'Commissioning Complete', date: '2026-07-25' }
  ]
}) => {
  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Engineering Timeline</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
        {timelineEvents.map((item, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#2563EB', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>[{item.label}]</span>
              <span style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace' }}>{item.date}</span>
            </div>
            <span style={{ fontSize: '10px', color: '#1E293B', fontWeight: 600 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
