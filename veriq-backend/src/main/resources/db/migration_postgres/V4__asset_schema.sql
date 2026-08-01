-- Flyway Migration V4: Create Asset Schema for Milestone-3
-- Milestone-3 Frozen Schema: Strictly 10 fields (id, project_id, asset_name, asset_code, asset_description, asset_class, asset_nature, asset_status, created_at, updated_at)

CREATE TABLE IF NOT EXISTS asset (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    asset_name VARCHAR(150) NOT NULL,
    asset_code VARCHAR(50) NOT NULL UNIQUE,
    asset_description TEXT,
    asset_class VARCHAR(100) NOT NULL,
    asset_nature VARCHAR(20) NOT NULL CHECK (asset_nature IN ('Linear', 'Point')),
    asset_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_project_id ON asset(project_id);
CREATE INDEX idx_asset_code ON asset(asset_code);
CREATE INDEX idx_asset_class ON asset(asset_class);
CREATE INDEX idx_asset_nature ON asset(asset_nature);
CREATE INDEX idx_asset_status ON asset(asset_status);
