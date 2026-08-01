import React from 'react';

interface HeroStatusSectionProps {
  overallHealth?: string;
  operationalState?: string;
  engineeringState?: string;
  monitoringState?: string;
  inspectionState?: string;
}

export const HeroStatusSection: React.FC<HeroStatusSectionProps> = ({
  overallHealth = 'STABLE',
  operationalState = 'COMMISSIONED & ACTIVE',
  engineeringState = 'VERIFIED DESIGN',
  monitoringState = 'ONLINE STREAMING',
  inspectionState = 'COMPLIANT'
}) => {
  const statusCards = [
    { label: 'Overall Health', value: overallHealth, color: '#059669' },
    { label: 'Operational State', value: operationalState, color: '#2563EB' },
    { label: 'Engineering State', value: engineeringState, color: '#4F46E5' },
    { label: 'Monitoring State', value: monitoringState, color: '#0284C7' },
    { label: 'Inspection State', value: inspectionState, color: '#16A34A' }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Status Summary</span>
        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Live State Rollup</span>
      </div>

      <div className="veriq-hero-status-grid">
        {statusCards.map((card, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <span className="veriq-hero-card-label">{card.label}</span>
            <span className="veriq-hero-card-value" style={{ color: card.color, fontWeight: 700, fontSize: '11px' }}>
              {card.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
