import React from 'react';

export const CriticalIssuesSection: React.FC = () => {
  const issueLevels = [
    { level: 'Critical', placeholder: '[ Critical Issue Placeholder ]' },
    { level: 'High', placeholder: '[ High Priority Placeholder ]' },
    { level: 'Medium', placeholder: '[ Medium Priority Placeholder ]' }
  ];

  return (
    <div className="veriq-decision-section">
      <div className="veriq-decision-section-label">
        <span>Critical Issues</span>
        <span>Priority Ranked</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {issueLevels.map((issue, idx) => (
          <div key={idx} className="veriq-decision-item-placeholder">
            <span style={{ fontSize: '10px', color: issue.level === 'Critical' ? '#DC2626' : issue.level === 'High' ? '#D97706' : '#2563EB', fontWeight: 600 }}>
              [{issue.level}]
            </span>
            <span style={{ fontSize: '10px' }}>{issue.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
