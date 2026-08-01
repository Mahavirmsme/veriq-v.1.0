-- Flyway Migration V6: Create Region Schema for Engineering Design Workspace (AUDIT-009)
-- Region represents engineering segmentation of a Linear Asset

CREATE TABLE IF NOT EXISTS region (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
    region_code VARCHAR(50) NOT NULL,
    region_name VARCHAR(150) NOT NULL,
    start_chainage NUMERIC(12, 3) NOT NULL,
    end_chainage NUMERIC(12, 3) NOT NULL,
    region_length NUMERIC(12, 3) NOT NULL,
    region_status VARCHAR(20) NOT NULL DEFAULT 'VALIDATED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_region_asset_id ON region(asset_id);

CREATE INDEX idx_region_code ON region(region_code);
