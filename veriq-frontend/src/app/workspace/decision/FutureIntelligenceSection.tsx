import React from 'react';

interface FutureIntelligenceSectionProps {
  predictiveInsight?: string;
}

export const FutureIntelligenceSection: React.FC<FutureIntelligenceSectionProps> = ({
  predictiveInsight = 'Predictive Trend: Factor of Safety projected to remain > 1.80 through monsoon season.'
}) => {
  return (
    <div className="veriq-decision-future-box" style={{ background: '#FAF5FF', border: '1px solid #E9D5FF' }}>
      <div className="veriq-decision-section-label" style={{ color: '#7C3AED', fontWeight: 700 }}>
        <span>Future Intelligence</span>
        <span>Predictive AI</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B21A8', fontSize: '11px', fontWeight: 600, textAlign: 'center', padding: '6px' }}>
        {predictiveInsight}
      </div>
    </div>
  );
};
