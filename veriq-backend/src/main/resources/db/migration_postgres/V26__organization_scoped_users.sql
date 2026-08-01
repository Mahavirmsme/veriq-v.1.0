-- Flyway Migration V26: Organization Scoped Users, Departments, and Designations

CREATE TABLE IF NOT EXISTS department (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_department_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS designation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_designation_org_code UNIQUE (organization_id, code)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organization(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES department(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS designation_id UUID REFERENCES designation(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

INSERT INTO organization (id, name, code, organization_type, contact_person, contact_mobile, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Triparna Systems', 'TRIPARNA', 'Enterprise', 'Primary Admin', 'N/A', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO department (id, organization_id, name, code, status)
VALUES ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Engineering', 'ENG', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO designation (id, organization_id, title, code, status)
VALUES ('e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Senior Engineer', 'SR_ENG', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;
