import React from 'react';
import './EngineeringDecisionPanel.css';
import { ObservationSection } from './ObservationSection';
import { CriticalIssuesSection } from './CriticalIssuesSection';
import { RecommendedActionsSection } from './RecommendedActionsSection';
import { PendingActivitiesSection } from './PendingActivitiesSection';
import { FutureIntelligenceSection } from './FutureIntelligenceSection';

/**
 * Permanent VERIQ Engineering Decision Panel (Region-4).
 * Visually secondary action-oriented guidance panel.
 */
export const EngineeringDecisionPanel: React.FC = () => {
  return (
    <div className="veriq-decision-container">
      <div className="veriq-decision-header-title">
        <span className="veriq-decision-header-text">Decision Guidance</span>
        <span style={{ fontSize: '10px', color: '#2563EB', fontFamily: 'monospace', fontWeight: 600 }}>
          Region-4
        </span>
      </div>

      {/* Section 1: Engineering Observations */}
      <ObservationSection />

      {/* Section 2: Critical Issues */}
      <CriticalIssuesSection />

      {/* Section 3: Recommended Actions */}
      <RecommendedActionsSection />

      {/* Section 4: Pending Activities */}
      <PendingActivitiesSection />

      {/* Section 5: Reserved Future Intelligence */}
      <FutureIntelligenceSection />
    </div>
  );
};

export default EngineeringDecisionPanel;
