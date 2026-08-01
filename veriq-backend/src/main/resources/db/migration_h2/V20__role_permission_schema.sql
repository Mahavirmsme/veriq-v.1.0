CREATE TABLE IF NOT EXISTS role_permissions (
    role_permission_id UUID PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id)
);

MERGE INTO role_permissions (role_permission_id, role_id, permission_id) KEY (role_id, permission_id)
SELECT 
    random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    p.permission_id
FROM permissions p;
