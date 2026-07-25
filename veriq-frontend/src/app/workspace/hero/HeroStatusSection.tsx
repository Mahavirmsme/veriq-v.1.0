import React from 'react';

export const HeroStatusSection: React.FC = () => {
  const statusCards = [
    { label: 'Overall Health', placeholder: '[ Health Placeholder ]' },
    { label: 'Operational State', placeholder: '[ Operational Placeholder ]' },
    { label: 'Engineering State', placeholder: '[ Engineering Placeholder ]' },
    { label: 'Monitoring State', placeholder: '[ Monitoring Placeholder ]' },
    { label: 'Inspection State', placeholder: '[ Inspection Placeholder ]' }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Status Summary</span>
        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>5 Status Cards</span>
      </div>

      <div className="veriq-hero-status-grid">
        {statusCards.map((card, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder">
            <span className="veriq-hero-card-label">{card.label}</span>
            <span className="veriq-hero-card-value">{card.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
