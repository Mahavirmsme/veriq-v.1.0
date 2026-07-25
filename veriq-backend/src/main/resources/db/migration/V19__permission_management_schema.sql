CREATE TABLE IF NOT EXISTS permissions (
    permission_id UUID PRIMARY KEY,
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    permission_name VARCHAR(255) NOT NULL,
    permission_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Permissions Data
INSERT INTO permissions (permission_id, permission_code, permission_name, permission_description)
VALUES 
    ('11111111-1111-1111-1111-222222222221', 'ADMINISTRATION', 'Administration Workspace Access', 'Grants access to System Administration Workspace.'),
    ('11111111-1111-1111-1111-222222222222', 'CONFIGURATION', 'Project Configuration Access', 'Grants access to Project Configuration & Digital Infrastructure Authoring.'),
    ('11111111-1111-1111-1111-222222222223', 'OPERATIONS', 'Operations Command Center Access', 'Grants access to Operations Command Center & Engineering Infrastructure Monitoring.'),
    ('11111111-1111-1111-1111-222222222224', 'VIEW_REPORTS', 'View Operational Reports', 'Grants permission to view system analytics & operational reports.'),
    ('11111111-1111-1111-1111-222222222225', 'MANAGE_USERS', 'Manage Platform Users', 'Grants permission to create, update, and manage platform user accounts.'),
    ('11111111-1111-1111-1111-222222222226', 'MANAGE_ROLES', 'Manage Platform Roles', 'Grants permission to configure roles and permission policies.')
ON CONFLICT (permission_code) DO NOTHING;
