import React from 'react';
import './Workspace.css';
import { EngineeringContextProvider } from './context/EngineeringContextProvider';
import { ApplicationHeaderPlaceholder } from './components/ApplicationHeaderPlaceholder';
import { EngineeringNavigation } from './navigation/EngineeringNavigation';
import { HeroWorkspace } from './hero/HeroWorkspace';
import { EngineeringDecisionPanel } from './decision/EngineeringDecisionPanel';
import { OperationalIntelligencePanel } from './opsintel/OperationalIntelligencePanel';

/**
 * Permanent VERIQ Engineering Workspace Foundation.
 * Single viewport (1920x1080) desktop CSS Grid layout with zero scrolling.
 * Encloses EngineeringContextProvider for workspace-wide context synchronization.
 * Encloses exactly five permanent workspace regions:
 * 1. Application Header (header)
 * 2. Engineering Navigation (nav) -> Houses live Engineering Navigation Tree
 * 3. Hero Engineering Workspace (hero) -> Houses Hero Engineering Workspace
 * 4. Engineering Decision Panel (decision) -> Houses Engineering Decision Panel
 * 5. Operational Intelligence Area (ops) -> Houses Operational Intelligence Panel
 */
export const Workspace: React.FC = () => {
  return (
    <EngineeringContextProvider>
      <div className="veriq-workspace-container">
        {/* Region 1: Application Header */}
        <header className="veriq-region-header">
          <ApplicationHeaderPlaceholder />
        </header>

        {/* Region 2: Engineering Navigation (Live Tree) */}
        <aside className="veriq-region-nav">
          <EngineeringNavigation />
        </aside>

        {/* Region 3: Hero Engineering Workspace */}
        <main className="veriq-region-hero">
          <HeroWorkspace />
        </main>

        {/* Region 4: Engineering Decision Panel */}
        <aside className="veriq-region-decision">
          <EngineeringDecisionPanel />
        </aside>

        {/* Region 5: Operational Intelligence Area */}
        <section className="veriq-region-ops">
          <OperationalIntelligencePanel />
        </section>
      </div>
    </EngineeringContextProvider>
  );
};

export default Workspace;
