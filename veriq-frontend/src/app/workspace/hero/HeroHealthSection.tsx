import React from 'react';

export const HeroHealthSection: React.FC = () => {
  const healthIndicators = [
    { label: 'Factor of Safety (FoS)', placeholder: '[ FoS Placeholder ]' },
    { label: 'Risk Level', placeholder: '[ Risk Placeholder ]' },
    { label: 'Structural Health', placeholder: '[ Structural Placeholder ]' },
    { label: 'Sensor Coverage', placeholder: '[ Coverage Placeholder ]' },
    { label: 'Reliability Index', placeholder: '[ Reliability Placeholder ]' },
    { label: 'Trend Indicator', placeholder: '[ Trend Placeholder ]' }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Health Summary</span>
        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>Reserved for Health Engine</span>
      </div>

      <div className="veriq-hero-health-grid">
        {healthIndicators.map((item, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder">
            <span className="veriq-hero-card-label">{item.label}</span>
            <span className="veriq-hero-card-value">{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
