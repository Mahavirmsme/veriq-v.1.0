CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY,
    role_code VARCHAR(100) NOT NULL UNIQUE,
    role_name VARCHAR(255) NOT NULL,
    role_description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed System Roles
INSERT INTO roles (id, role_code, role_name, role_description, is_system_role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'ADMIN', 'System Administrator', 'Full System Administration, User Management, License, & Security Policy control.', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'CONFIG_ENGINEER', 'Configuration Engineer', 'Digital Infrastructure Authoring, Hierarchy Design, Publishing & Commissioning.', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'CHIEF_ENGINEER', 'Chief Engineer', 'WRD Headquarters Command Center access & statewide risk overview.', TRUE),
    ('44444444-4444-4444-4444-444444444444', 'ASSET_MANAGER', 'Asset Manager', 'Asset Command Dashboard access & regional sector oversight.', TRUE),
    ('55555555-5555-5555-5555-555555555555', 'REGIONAL_ENGINEER', 'Regional Engineer', 'Region Operations Dashboard access & Linear Ribbon investigation.', TRUE),
    ('66666666-6666-6666-6666-666666666666', 'FIELD_ENGINEER', 'Field Engineer', 'Node Engineering Workspace access & field telemetry inspection.', TRUE)
ON CONFLICT (role_code) DO NOTHING;
