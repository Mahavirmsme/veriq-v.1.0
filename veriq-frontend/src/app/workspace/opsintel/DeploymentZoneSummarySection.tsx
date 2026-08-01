import React from 'react';

interface DeploymentZoneSummarySectionProps {
  zoneName?: string;
  healthStatus?: string;
  activeNodesCount?: number;
  alertCount?: number;
}

export const DeploymentZoneSummarySection: React.FC<DeploymentZoneSummarySectionProps> = ({
  zoneName = 'Zone DZ-01',
  healthStatus = 'STABLE',
  activeNodesCount = 2,
  alertCount = 0
}) => {
  const items = [
    { label: 'Zone Name', value: zoneName, color: '#0F172A' },
    { label: 'Health Status', value: healthStatus, color: '#059669' },
    { label: 'Active Nodes', value: `${activeNodesCount} Nodes Online`, color: '#2563EB' },
    { label: 'Alert Count', value: `${alertCount} Active Alerts`, color: alertCount > 0 ? '#DC2626' : '#16A34A' }
  ];

  return (
    <div className="veriq-opsintel-section">
      <div className="veriq-opsintel-section-title">
        <span>Deployment Zone Summary</span>
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
