import React from 'react';

interface CriticalIssuesSectionProps {
  criticalText?: string;
  highText?: string;
  mediumText?: string;
}

export const CriticalIssuesSection: React.FC<CriticalIssuesSectionProps> = ({
  criticalText = 'Zero critical structural anomalies detected across active nodes.',
  highText = 'Schedule Routine Pore Water Calibration for Sub-Zone DZ-01.',
  mediumText = 'Review Chainage CH 18.50km piezometer battery level.'
}) => {
  const issueLevels = [
    { level: 'Critical', text: criticalText, color: '#DC2626' },
    { level: 'High', text: highText, color: '#D97706' },
    { level: 'Medium', text: mediumText, color: '#2563EB' }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Critical Issues</span>
        <span style={{ color: '#DC2626', fontWeight: 700 }}>Priority Ranked</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {issueLevels.map((issue, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 8px' }}>
            <span style={{ fontSize: '10px', color: issue.color, fontWeight: 800 }}>
              [{issue.level}]
            </span>
            <span style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{issue.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
