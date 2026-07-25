import React from 'react';
import './ApplicationShell.css';
import { ApplicationHeader } from './ApplicationHeader';
import { Workspace } from '../workspace/Workspace';

/**
 * Permanent VERIQ Application Shell.
 * Renders the permanent ApplicationHeader on top and reuses the frozen Workspace component below it.
 * Zero workspace modifications, zero layout changes to Workspace.
 */
export const ApplicationShell: React.FC = () => {
  return (
    <div className="veriq-app-shell">
      {/* Permanent Application Header */}
      <ApplicationHeader />

      {/* Reused Workspace Body (Frozen Foundation) */}
      <div className="veriq-app-shell-body">
        <Workspace />
      </div>
    </div>
  );
};

export default ApplicationShell;
