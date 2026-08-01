import React from 'react';
import './Workspace.css';
import { ContextSelectorBar } from './components/ContextSelectorBar';
import { EngineeringNavigation } from './navigation/EngineeringNavigation';
import { HeroWorkspace } from './hero/HeroWorkspace';
import { EngineeringDecisionPanel } from './decision/EngineeringDecisionPanel';
import { OperationalIntelligencePanel } from './opsintel/OperationalIntelligencePanel';

/**
 * Permanent VERIQ Engineering Workspace Foundation & Operations Command Center.
 * Single viewport desktop CSS Grid layout with zero scrolling.
 * Single Application Header at PlatformShell level (No duplicate internal header).
 */
export const Workspace: React.FC = () => {
  return (
    <div className="veriq-workspace-container">
      {/* Independent Context Selector Bar Navigation Layer */}
      <nav className="veriq-region-contextbar">
        <ContextSelectorBar />
      </nav>

      {/* Region 2: Left Operational Panel */}
      <aside className="veriq-region-nav">
        <EngineeringNavigation />
      </aside>

      {/* Region 3: Hero Engineering Focus Workspace */}
      <main className="veriq-region-hero">
        <HeroWorkspace />
      </main>

      {/* Region 4: Decision Guidance Panel */}
      <aside className="veriq-region-decision">
        <EngineeringDecisionPanel />
      </aside>

      {/* Region 5: Operational Intelligence Panel */}
      <section className="veriq-region-ops">
        <OperationalIntelligencePanel />
      </section>
    </div>
  );
};

export default Workspace;
