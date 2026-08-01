export interface BusinessAction {
  id: string;
  name: string;
  description: string;
  tokens: string[];
}

export interface WorkspacePermissionGroup {
  id: string;
  title: string;
  description: string;
  actions: BusinessAction[];
}

export const WORKSPACE_PERMISSIONS: WorkspacePermissionGroup[] = [
  {
    id: 'portfolio',
    title: 'Portfolio Center',
    description: 'Executive Portfolio Overview & Cross-Project Explorer',
    actions: [
      { id: 'portfolio_view', name: 'View', description: 'View infrastructure overview, projects, and assets', tokens: ['portfolio.read', 'project.read', 'asset.read', 'region.read', 'portfolio.view'] },
      { id: 'portfolio_filter', name: 'Filter', description: 'Apply filters and query asset explorers', tokens: ['portfolio.explore', 'project.read', 'asset.read'] },
      { id: 'portfolio_export', name: 'Export', description: 'Export portfolio summary reports', tokens: ['portfolio.export', 'report.generate'] },
      { id: 'portfolio_print', name: 'Print', description: 'Print executive portfolio views', tokens: ['portfolio.print'] }
    ]
  },
  {
    id: 'config',
    title: 'Project Configuration',
    description: 'Digital Infrastructure Modeling & Package Setup',
    actions: [
      { id: 'config_read', name: 'Read', description: 'Read configured projects, assets, and deployment zones', tokens: ['configuration.read', 'project.read', 'asset.read', 'region.read', 'node.read'] },
      { id: 'config_create', name: 'Create', description: 'Create new projects and asset structures', tokens: ['configuration.create', 'project.create', 'asset.create'] },
      { id: 'config_modify', name: 'Modify', description: 'Edit existing project configuration topologies', tokens: ['configuration.update', 'project.update', 'asset.update'] },
      { id: 'config_validate', name: 'Validate', description: 'Validate pre-commissioning package consistency', tokens: ['configuration.validate', 'node.validate'] },
      { id: 'config_publish', name: 'Publish', description: 'Publish configuration definitions to runtime engine', tokens: ['config.publish', 'configuration.publish', 'runtime.write'] }
    ]
  },
  {
    id: 'commissioning',
    title: 'Commissioning',
    description: 'Field Commissioning & Sensor Installation Verification',
    actions: [
      { id: 'comm_execute', name: 'Execute', description: 'Execute live sensor package commissioning runs', tokens: ['commissioning.execute', 'config.publish', 'runtime.write', 'engine.job.submit'] },
      { id: 'comm_verify', name: 'Verify', description: 'Verify telemetry signals and field calibration', tokens: ['commissioning.verify', 'node.verify', 'telemetry.read'] },
      { id: 'comm_rollback', name: 'Rollback', description: 'Rollback failed commissioning installations', tokens: ['commissioning.rollback', 'runtime.rollback'] }
    ]
  },
  {
    id: 'ops',
    title: 'Operations Command Center',
    description: 'Live Runtime Monitoring & Command Operations',
    actions: [
      { id: 'ops_view_runtime', name: 'View Runtime', description: 'Observe live node telemetry and health metrics', tokens: ['runtime.observe', 'node.view', 'ops.read', 'sensor.read'] },
      { id: 'ops_execute', name: 'Execute Operations', description: 'Execute operational commands and runtime overrides', tokens: ['ops.execute', 'runtime.write', 'command.send'] },
      { id: 'ops_ack_alerts', name: 'Acknowledge Alerts', description: 'Acknowledge and resolve operational alarms', tokens: ['alert.acknowledge', 'ops.alerts'] },
      { id: 'ops_recommendations', name: 'Engineering Recommendations', description: 'Review and approve AI engineering recommendations', tokens: ['recommendation.view', 'intel.read', 'decision.approve'] }
    ]
  },
  {
    id: 'engineering',
    title: 'Engineering Workspace',
    description: 'Diagnostic Analysis & Structural Health Decision Support',
    actions: [
      { id: 'eng_view', name: 'View', description: 'View engineering topology and diagnostic views', tokens: ['workspace.view', 'node.view', 'engineering.read'] },
      { id: 'eng_analyze', name: 'Analyze', description: 'Analyze telemetry trend lines and diagnostic models', tokens: ['runtime.observe', 'analytics.execute', 'telemetry.analyze'] },
      { id: 'eng_decision', name: 'Decision Support', description: 'Evaluate risk models and structural health index', tokens: ['intel.view', 'decision.support', 'risk.evaluate'] }
    ]
  },
  {
    id: 'administration',
    title: 'Administration Workspace',
    description: 'User, Role, Audit & Enterprise Governance',
    actions: [
      { id: 'admin_users', name: 'User Management', description: 'Manage user directory and primary role assignments', tokens: ['user.read', 'user.create', 'user.update', 'user.assign_role'] },
      { id: 'admin_roles', name: 'Role Management', description: 'Manage role definitions and workspace permission matrix', tokens: ['role.read', 'role.create', 'role.update', 'role.assign_permissions'] },
      { id: 'admin_audit', name: 'Audit Access', description: 'Access security audit trails and compliance logs', tokens: ['audit.read', 'audit.export'] },
      { id: 'admin_settings', name: 'Settings', description: 'Manage organization settings and system configuration', tokens: ['settings.read', 'settings.update'] }
    ]
  }
];

/**
 * Maps an array of assigned business action IDs to the list of underlying internal permission tokens.
 */
export const resolveInternalTokensFromBusinessActions = (selectedActionIds: string[]): string[] => {
  const tokenSet = new Set<string>();
  const safeSelected = Array.isArray(selectedActionIds) ? selectedActionIds : [];
  
  WORKSPACE_PERMISSIONS.forEach(group => {
    group.actions.forEach(action => {
      if (safeSelected.includes(action.id)) {
        action.tokens.forEach(tok => tokenSet.add(tok));
      }
    });
  });
  return Array.from(tokenSet);
};

/**
 * Maps an array of internal permission tokens (from backend/role) back to selected business action IDs.
 */
export const resolveBusinessActionsFromInternalTokens = (assignedTokens: string[]): string[] => {
  const safeTokens = Array.isArray(assignedTokens) ? assignedTokens : [];
  const tokenSet = new Set(safeTokens.map(t => String(t).toLowerCase()));
  const selectedActionIds: string[] = [];

  WORKSPACE_PERMISSIONS.forEach(group => {
    group.actions.forEach(action => {
      const hasAnyToken = action.tokens.some(tok => tokenSet.has(tok.toLowerCase()));
      if (hasAnyToken) {
        selectedActionIds.push(action.id);
      }
    });
  });

  return selectedActionIds;
};
