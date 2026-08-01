import React from 'react';

interface NodeSummarySectionProps {
  totalNodes?: number;
  healthyNodes?: number;
  warningNodes?: number;
  criticalNodes?: number;
}

export const NodeSummarySection: React.FC<NodeSummarySectionProps> = ({
  totalNodes = 2,
  healthyNodes = 2,
  warningNodes = 0,
  criticalNodes = 0
}) => {
  const items = [
    { label: 'Total Nodes', value: `${totalNodes} Configured`, color: '#1E293B' },
    { label: 'Healthy', value: `${healthyNodes} Healthy (${totalNodes > 0 ? Math.round((healthyNodes/totalNodes)*100) : 100}%)`, color: '#059669' },
    { label: 'Warning', value: `${warningNodes} Warning`, color: warningNodes > 0 ? '#D97706' : '#64748B' },
    { label: 'Critical', value: `${criticalNodes} Critical`, color: criticalNodes > 0 ? '#DC2626' : '#64748B' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Node Summary</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => (
          <div key={idx} className="veriq-opsintel-item-placeholder" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px' }}>
            <span style={{ color: '#64748B', fontWeight: 600, fontSize: '10px' }}>{item.label}:</span>
            <span style={{ color: item.color, fontWeight: 700, fontSize: '11px' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
