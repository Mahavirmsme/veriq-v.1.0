import React from 'react';

interface RecommendedActionsSectionProps {
  inspectText?: string;
  monitorText?: string;
  maintainText?: string;
}

export const RecommendedActionsSection: React.FC<RecommendedActionsSectionProps> = ({
  inspectText = 'Perform visual check on Node N-1420 crest embankment settlement.',
  monitorText = 'Continuous 10Hz pore pressure telemetry logging active.',
  maintainText = 'Calibrate piezometer baseline zero point during scheduled window.'
}) => {
  const actions = [
    { action: 'Inspect', text: inspectText },
    { action: 'Monitor', text: monitorText },
    { action: 'Maintain', text: maintainText }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Recommended Actions</span>
        <span style={{ color: '#2563EB', fontWeight: 700 }}>Engineering Guidance</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {actions.map((act, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 8px' }}>
            <span style={{ fontSize: '11px', color: '#334155', fontWeight: 500, flex: 1 }}>{act.text}</span>
            <span className="veriq-decision-action-btn" style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>
              {act.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
