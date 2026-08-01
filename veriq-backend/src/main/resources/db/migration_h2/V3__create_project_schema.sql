-- Flyway Migration V3: Create Project Schema for Milestone-2
-- Milestone-2 Frozen Schema: Strictly 8 fields (id, organization_id, project_name, project_code, project_description, project_status, created_at, updated_at)

CREATE TABLE IF NOT EXISTS project (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_description TEXT,
    project_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_organization_id ON project(organization_id);

CREATE INDEX idx_project_code ON project(project_code);

CREATE INDEX idx_project_status ON project(project_status);
