import React from 'react';

interface ObservationSectionProps {
  structuralObservation?: string;
  monitoringObservation?: string;
}

export const ObservationSection: React.FC<ObservationSectionProps> = ({
  structuralObservation = 'Piezometer Pore Pressure & Tiltmeter incline within structural tolerance bounds.',
  monitoringObservation = 'Telemetry stream ACTIVE with 0 dropped packets in past 24 hours.'
}) => {
  const observations = [
    { label: 'Structural', text: structuralObservation },
    { label: 'Monitoring', text: monitoringObservation }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Engineering Observations</span>
        <span style={{ color: '#0284C7', fontWeight: 700 }}>Evaluated</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {observations.map((obs, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 8px' }}>
            <span style={{ fontSize: '10px', color: '#0284C7', fontWeight: 700 }}>[{obs.label}]</span>
            <span style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{obs.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
