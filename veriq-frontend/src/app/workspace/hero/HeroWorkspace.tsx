import React from 'react';
import './HeroWorkspace.css';
import { HeroHeader } from './HeroHeader';
import { HeroStatusSection } from './HeroStatusSection';
import { HeroHealthSection } from './HeroHealthSection';
import { HeroMetadataSection } from './HeroMetadataSection';
import { useEngineeringContext } from '../context/useEngineeringContext';

/**
 * Permanent VERIQ Hero Engineering Workspace (Region-3).
 * Subscribes to EngineeringContext Engine for automatic single-object context synchronization.
 * Primary Visual Focal Point of the Enterprise Platform.
 */
export const HeroWorkspace: React.FC = () => {
  const { selectedEngineeringObject } = useEngineeringContext();

  return (
    <div className="veriq-hero-container">
      {/* Section 1: Engineering Object Identity */}
      <HeroHeader
        objectType={selectedEngineeringObject.type}
        objectName={selectedEngineeringObject.name}
        parentObject={selectedEngineeringObject.parentObject || 'System Hierarchy'}
      />

      {/* Section 2: Engineering Status Summary */}
      <HeroStatusSection />

      {/* Section 3: Engineering Health Summary */}
      <HeroHealthSection />

      {/* Section 4: Engineering Metadata */}
      <HeroMetadataSection />

      {/* Section 5: Reserved Area for Future Modules */}
      <div className="veriq-hero-reserved-section">
        [ Reserved Stage Area for Future Engineering Modules ]
      </div>
    </div>
  );
};

export default HeroWorkspace;
