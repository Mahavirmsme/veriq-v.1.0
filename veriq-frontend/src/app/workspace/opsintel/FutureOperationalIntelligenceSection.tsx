import React from 'react';

interface FutureOperationalIntelligenceSectionProps {
  evidenceInsight?: string;
}

export const FutureOperationalIntelligenceSection: React.FC<FutureOperationalIntelligenceSectionProps> = ({
  evidenceInsight = 'Operational Advisory: Node stability displacement remains 0.0mm/year under steady-state seepage conditions with Factor of Safety > 1.80.'
}) => {
  return (
    <div className="veriq-opsintel-section" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
      <div className="veriq-opsintel-section-title">
        <span>Operational Advisory</span>
      </div>

      <div className="veriq-opsintel-future-box" style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', fontSize: '10px', fontWeight: 500, padding: '8px' }}>
        {evidenceInsight}
      </div>
    </div>
  );
};
