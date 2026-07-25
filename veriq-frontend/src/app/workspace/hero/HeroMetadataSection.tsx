import React from 'react';

export const HeroMetadataSection: React.FC = () => {
  const metadataRows = [
    { label: 'Object ID', placeholder: '[ Object ID Placeholder ]' },
    { label: 'Created Date', placeholder: '[ Created Date Placeholder ]' },
    { label: 'Updated Date', placeholder: '[ Updated Date Placeholder ]' },
    { label: 'Authority Owner', placeholder: '[ Owner Placeholder ]' },
    { label: 'Location / Chainage', placeholder: '[ Location Placeholder ]' },
    { label: 'Hierarchy Path', placeholder: '[ Path Placeholder ]' }
  ];

  return (
    <div className="veriq-hero-section">
      <div className="veriq-hero-section-title">
        <span>Engineering Metadata</span>
        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>Attributes</span>
      </div>

      <div className="veriq-hero-metadata-grid">
        {metadataRows.map((item, idx) => (
          <div key={idx} className="veriq-hero-card-placeholder" style={{ height: '44px' }}>
            <span className="veriq-hero-card-label">{item.label}</span>
            <span className="veriq-hero-card-value" style={{ fontSize: '10px' }}>{item.placeholder}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
