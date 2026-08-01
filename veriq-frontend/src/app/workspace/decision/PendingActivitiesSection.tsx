import React from 'react';

interface PendingActivitiesSectionProps {
  inspectionTask?: string;
  validationTask?: string;
}

export const PendingActivitiesSection: React.FC<PendingActivitiesSectionProps> = ({
  inspectionTask = 'Sub-Zone DZ-01 Monthly Embankment Stability Survey',
  validationTask = 'Post-Commissioning Telemetry Packet Integrity Check'
}) => {
  const activities = [
    { type: 'Inspection', text: inspectionTask },
    { type: 'Validation', text: validationTask }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Pending Activities</span>
        <span style={{ color: '#475569', fontWeight: 600 }}>Queue</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {activities.map((act, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder" style={{ height: '32px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px' }}>
            <span style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>{act.type}:</span>
            <span style={{ fontSize: '11px', color: '#1E293B', fontWeight: 500 }}>{act.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
