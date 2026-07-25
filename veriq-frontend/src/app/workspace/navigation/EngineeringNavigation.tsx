import React from 'react';
import './EngineeringNavigation.css';
import { EngineeringTree } from './EngineeringTree';

/**
 * Permanent VERIQ Engineering Navigation Container (Region-2).
 * Houses the live expandable/collapsible engineering hierarchy tree.
 * Clean enterprise white background styling.
 */
export const EngineeringNavigation: React.FC = () => {
  return (
    <div className="veriq-nav-container">
      <div className="veriq-nav-header">
        <span className="veriq-nav-header-title">Engineering Hierarchy</span>
        <span style={{ fontSize: '10px', color: '#2563EB', fontFamily: 'monospace', fontWeight: 600 }}>
          Live Tree
        </span>
      </div>

      <EngineeringTree />
    </div>
  );
};

export default EngineeringNavigation;
