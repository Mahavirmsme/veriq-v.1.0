import React from 'react';
import './OperationalIntelligencePanel.css';
import { DeploymentZoneSummarySection } from './DeploymentZoneSummarySection';
import { NodeSummarySection } from './NodeSummarySection';
import { EngineeringTimelineSection } from './EngineeringTimelineSection';
import { RecentEngineeringEventsSection } from './RecentEngineeringEventsSection';
import { FutureOperationalIntelligenceSection } from './FutureOperationalIntelligenceSection';

/**
 * Permanent VERIQ Operational Intelligence Panel (Region-5).
 * Organized bottom supporting operational awareness panel.
 */
export const OperationalIntelligencePanel: React.FC = () => {
  return (
    <div className="veriq-opsintel-container">
      <div className="veriq-opsintel-header">
        <span className="veriq-opsintel-header-title">Operational Intelligence & Awareness</span>
        <span style={{ fontSize: '10px', color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>
          Region-5 :: Supporting Stage
        </span>
      </div>

      <div className="veriq-opsintel-grid">
        {/* Section 1: Deployment Zone Summary */}
        <DeploymentZoneSummarySection />

        {/* Section 2: Node Summary */}
        <NodeSummarySection />

        {/* Section 3: Engineering Timeline */}
        <EngineeringTimelineSection />

        {/* Section 4: Recent Engineering Events */}
        <RecentEngineeringEventsSection />

        {/* Section 5: Future Operational Intelligence */}
        <FutureOperationalIntelligenceSection />
      </div>
    </div>
  );
};

export default OperationalIntelligencePanel;
