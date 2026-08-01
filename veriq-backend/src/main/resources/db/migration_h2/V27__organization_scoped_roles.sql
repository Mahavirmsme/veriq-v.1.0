-- Flyway Migration V27: Organization Scoped Roles (H2)

ALTER TABLE roles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organization(id) ON DELETE CASCADE;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_roles_organization_id ON roles(organization_id);
