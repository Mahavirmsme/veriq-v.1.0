import React from 'react';
import './Workspace.css';
import { ContextSelectorBar } from './components/ContextSelectorBar';
import { EngineeringNavigation } from './navigation/EngineeringNavigation';
import { HeroWorkspace } from './hero/HeroWorkspace';
import { OperationalIntelligencePanel } from './opsintel/OperationalIntelligencePanel';

/**
 * Operations Command Center Page (/ops/dashboard).
 * Unified Single-Viewport Desktop Workspace Console.
 */
export const Workspace: React.FC = () => {
  return (
    <div className="veriq-workspace-container">
      {/* 1. Full-Width Context Selector Bar */}
      <nav className="veriq-region-contextbar">
        <ContextSelectorBar />
      </nav>

      {/* 2. Main Unified Engineering Workspace Console (3 Aligned Columns) */}
      <main className="veriq-main-console">
        {/* LEFT COLUMN: SYSTEM STATUS */}
        <div className="veriq-console-column veriq-col-left">
          <EngineeringNavigation />
        </div>

        {/* CENTER COLUMN: ENGINEERING STATE */}
        <div className="veriq-console-column veriq-col-center">
          <HeroWorkspace />
        </div>

        {/* RIGHT COLUMN: ENGINEERING INTELLIGENCE */}
        <div className="veriq-console-column veriq-col-right">
          <OperationalIntelligencePanel />
        </div>
      </main>
    </div>
  );
};

export default Workspace;


