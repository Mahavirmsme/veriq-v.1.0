import React from 'react';

interface HeroHealthSectionProps {
  factorOfSafety?: string;
  riskLevel?: string;
  structuralHealth?: string;
  sensorCoverage?: string;
  reliabilityIndex?: string;
  trendIndicator?: string;
}

export const HeroHealthSection: React.FC<HeroHealthSectionProps> = ({
  factorOfSafety = 'N/A',
  riskLevel = 'N/A',
  structuralHealth = 'N/A',
  sensorCoverage = 'N/A',
  reliabilityIndex = 'N/A',
  trendIndicator = 'N/A'
}) => {
  const healthIndicators = [
    { label: 'Factor of Safety (FoS)', value: factorOfSafety, color: '#059669' },
    { label: 'Risk Level', value: riskLevel, color: '#2563EB' },
    { label: 'Structural Health', value: structuralHealth, color: '#0284C7' },
    { label: 'Sensor Coverage', value: sensorCoverage, color: '#16A34A' },
    { label: 'Reliability Index', value: reliabilityIndex, color: '#4F46E5' },
    { label: 'Trend Indicator', value: trendIndicator, color: '#0D9488' }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Health Summary</span>
        <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 700 }}>Live Evaluation Engine Rollup</span>
      </div>

      <div className="veriq-hero-health-grid">
        {healthIndicators.map((item, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <span className="veriq-hero-card-label">{item.label}</span>
            <span className="veriq-hero-card-value" style={{ color: item.color, fontWeight: 800, fontSize: '12px' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
