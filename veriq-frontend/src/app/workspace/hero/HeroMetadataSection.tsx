import React from 'react';

interface HeroMetadataSectionProps {
  objectId?: string;
  createdDate?: string;
  updatedDate?: string;
  authorityOwner?: string;
  locationChainage?: string;
  hierarchyPath?: string;
}

export const HeroMetadataSection: React.FC<HeroMetadataSectionProps> = ({
  objectId = 'asset-kosi-left-embankment',
  createdDate = '2026-01-15 08:30:00',
  updatedDate = '2026-07-26 10:00:00',
  authorityOwner = 'Water Resources Department Bihar',
  locationChainage = 'CH 0.00km - 42.50km',
  hierarchyPath = 'Water Resources Department Bihar > Kosi Embankment Protection Project'
}) => {
  const metadataRows = [
    { label: 'Object ID', value: objectId },
    { label: 'Created Date', value: createdDate },
    { label: 'Updated Date', value: updatedDate },
    { label: 'Authority Owner', value: authorityOwner },
    { label: 'Location / Chainage', value: locationChainage },
    { label: 'Hierarchy Path', value: hierarchyPath }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Metadata</span>
        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Object Attributes</span>
      </div>

      <div className="veriq-hero-metadata-grid">
        {metadataRows.map((item, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder" style={{ height: '44px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <span className="veriq-hero-card-label">{item.label}</span>
            <span className="veriq-hero-card-value" style={{ fontSize: '11px', color: '#1E293B', fontWeight: 600 }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
