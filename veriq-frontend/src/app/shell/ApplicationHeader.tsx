import React from 'react';
import './ApplicationHeader.css';

/**
 * Permanent VERIQ Application Header.
 * Structural component providing global identity and action placeholders.
 * Pure layout - zero business logic, zero authentication, zero search logic.
 */
export const ApplicationHeader: React.FC = () => {
  return (
    <header className="veriq-app-header">
      {/* Left: Product Identity & Workspace Context */}
      <div className="veriq-header-brand-section">
        {/* Product Logo Placeholder */}
        <div className="veriq-header-logo-box">
          V
        </div>

        {/* Product Name */}
        <div className="veriq-header-product-name">
          VERIQ Infrastructure Intelligence
        </div>

        <div className="veriq-header-divider" />

        {/* Current Workspace Title */}
        <div className="veriq-header-workspace-title">
          Operations Command Center
        </div>
      </div>

      {/* Right: Permanent Action Placeholders */}
      <div className="veriq-header-actions-section">
        {/* Global Search Placeholder */}
        <div className="veriq-header-search-placeholder">
          [ GLOBAL SEARCH PLACEHOLDER ]
        </div>

        {/* Notification Placeholder */}
        <div className="veriq-header-notification-placeholder">
          [ N ]
        </div>

        {/* User Profile Placeholder */}
        <div className="veriq-header-profile-placeholder">
          [ USER PROFILE PLACEHOLDER ]
        </div>
      </div>
    </header>
  );
};
