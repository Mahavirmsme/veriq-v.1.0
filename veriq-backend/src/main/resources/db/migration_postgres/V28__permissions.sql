-- Flyway Migration V28: Global Permissions Master & Catalog v1.0 (PostgreSQL)

DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_category ON permissions(category);
CREATE INDEX idx_permissions_code ON permissions(permission_code);

CREATE TABLE role_permissions (
    role_permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id)
);

-- Seed 37 Approved Global Permission Tokens
INSERT INTO permissions (id, permission_code, category, display_name, description)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'user.read', 'USER_MGMT', 'Read Users', 'View organization-scoped user profiles and directory listings.'),
    ('a0000000-0000-0000-0000-000000000002', 'user.create', 'USER_MGMT', 'Create User', 'Provision new organization-scoped user accounts.'),
    ('a0000000-0000-0000-0000-000000000003', 'user.update', 'USER_MGMT', 'Update User', 'Edit profile details, status, department, and designation.'),
    ('a0000000-0000-0000-0000-000000000004', 'user.delete', 'USER_MGMT', 'Delete User', 'Deactivate or remove user accounts from organization context.'),
    ('a0000000-0000-0000-0000-000000000005', 'user.assign_role', 'USER_MGMT', 'Assign User Roles', 'Attach or detach roles to organization users.'),
    ('a0000000-0000-0000-0000-000000000006', 'department.read', 'MASTER_DATA', 'Read Departments', 'View organization-scoped department master directory.'),
    ('a0000000-0000-0000-0000-000000000007', 'department.create', 'MASTER_DATA', 'Create Department', 'Provision new department records within the organization.'),
    ('a0000000-0000-0000-0000-000000000008', 'department.update', 'MASTER_DATA', 'Update Department', 'Edit department name, code, or status.'),
    ('a0000000-0000-0000-0000-000000000009', 'department.delete', 'MASTER_DATA', 'Delete Department', 'Remove department records from organization context.'),
    ('a0000000-0000-0000-0000-000000000010', 'designation.read', 'MASTER_DATA', 'Read Designations', 'View organization-scoped designation master directory.'),
    ('a0000000-0000-0000-0000-000000000011', 'designation.create', 'MASTER_DATA', 'Create Designation', 'Provision new designation records within the organization.'),
    ('a0000000-0000-0000-0000-000000000012', 'designation.update', 'MASTER_DATA', 'Update Designation', 'Edit designation title, code, or status.'),
    ('a0000000-0000-0000-0000-000000000013', 'designation.delete', 'MASTER_DATA', 'Delete Designation', 'Remove designation records from organization context.'),
    ('a0000000-0000-0000-0000-000000000014', 'role.read', 'ROLE_MGMT', 'Read Roles', 'View system roles and organization-scoped custom roles.'),
    ('a0000000-0000-0000-0000-000000000015', 'role.create', 'ROLE_MGMT', 'Create Role', 'Author new custom organization-scoped roles.'),
    ('a0000000-0000-0000-0000-000000000016', 'role.update', 'ROLE_MGMT', 'Update Role', 'Modify name, description, or status of custom roles.'),
    ('a0000000-0000-0000-0000-000000000017', 'role.delete', 'ROLE_MGMT', 'Delete Role', 'Remove non-system custom roles from organization context.'),
    ('a0000000-0000-0000-0000-000000000018', 'role.assign_permission', 'ROLE_MGMT', 'Assign Role Permissions', 'Attach or detach permissions to custom organization roles.'),
    ('a0000000-0000-0000-0000-000000000019', 'permission.read', 'ROLE_MGMT', 'Read Permissions', 'Inspect the global read-only catalog of system permissions.'),
    ('a0000000-0000-0000-0000-000000000020', 'session.read', 'AUTH_SESSION', 'Read Active Sessions', 'View active user sessions, IP logs, and device metadata.'),
    ('a0000000-0000-0000-0000-000000000021', 'session.revoke', 'AUTH_SESSION', 'Revoke Session', 'Terminate active user sessions remotely.'),
    ('a0000000-0000-0000-0000-000000000022', 'config.author', 'CONFIG_ENG', 'Author Digital Twin', 'Author structural digital twin models and bridge nodes.'),
    ('a0000000-0000-0000-0000-000000000023', 'config.validate', 'CONFIG_ENG', 'Validate Configuration', 'Run rule validation on digital twin configurations.'),
    ('a0000000-0000-0000-0000-000000000024', 'config.publish', 'CONFIG_ENG', 'Publish Configuration', 'Publish authored digital twin versions.'),
    ('a0000000-0000-0000-0000-000000000025', 'config.commission', 'CONFIG_ENG', 'Commission Infrastructure', 'Commission published configurations to live monitoring.'),
    ('a0000000-0000-0000-0000-000000000026', 'engine.job_submit', 'EXEC_ENGINE', 'Submit Analytical Job', 'Dispatch computation jobs to execution pipeline.'),
    ('a0000000-0000-0000-0000-000000000027', 'engine.job_cancel', 'EXEC_ENGINE', 'Cancel Analytical Job', 'Terminate running execution jobs.'),
    ('a0000000-0000-0000-0000-000000000028', 'engine.pipeline_configure', 'EXEC_ENGINE', 'Configure Pipeline', 'Modify computation pipeline execution parameters.'),
    ('a0000000-0000-0000-0000-000000000029', 'runtime.observe', 'RUNTIME_OPS', 'Observe Telemetry', 'Stream live telemetry and sensor packet streams.'),
    ('a0000000-0000-0000-0000-000000000030', 'runtime.execute', 'RUNTIME_OPS', 'Execute Command', 'Dispatch operational execution commands to nodes.'),
    ('a0000000-0000-0000-0000-000000000031', 'runtime.override', 'RUNTIME_OPS', 'Override Telemetry', 'Apply manual sensor state or telemetry overrides.'),
    ('a0000000-0000-0000-0000-000000000032', 'runtime.halt', 'RUNTIME_OPS', 'Halt Runtime', 'Halt active node execution or telemetry streaming.'),
    ('a0000000-0000-0000-0000-000000000033', 'analytics.read', 'INTELLIGENCE', 'Read Intelligence', 'Inspect structural risk analytics and health scores.'),
    ('a0000000-0000-0000-0000-000000000034', 'analytics.export', 'INTELLIGENCE', 'Export Analytics', 'Export risk analytical reports and intelligence data.'),
    ('a0000000-0000-0000-0000-000000000035', 'health_score.override', 'INTELLIGENCE', 'Override Health Score', 'Apply manual overrides to structural health scores.'),
    ('a0000000-0000-0000-0000-000000000036', 'audit.read', 'AUDIT_SEC', 'Read Audit Logs', 'Inspect security logs, rejected packets, and system audit trails.'),
    ('a0000000-0000-0000-0000-000000000037', 'audit.export', 'AUDIT_SEC', 'Export Audit Logs', 'Export compliance audit trail logs.');
