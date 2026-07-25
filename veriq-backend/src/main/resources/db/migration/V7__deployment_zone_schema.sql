-- Flyway Migration V7: Create Deployment Zone Schema for Engineering Design Workspace (AUDIT-010)
-- Deployment Zone represents engineering deployment segmentation inside a Region

CREATE TABLE IF NOT EXISTS deployment_zone (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NOT NULL REFERENCES region(id) ON DELETE CASCADE,
    zone_code VARCHAR(50) NOT NULL,
    zone_name VARCHAR(150) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'High',
    start_chainage NUMERIC(12, 3) NOT NULL,
    end_chainage NUMERIC(12, 3) NOT NULL,
    zone_length NUMERIC(12, 3) NOT NULL,
    node_spacing NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
    total_nodes INTEGER NOT NULL DEFAULT 1,
    zone_status VARCHAR(20) NOT NULL DEFAULT 'VALIDATED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deployment_zone_region_id ON deployment_zone(region_id);
CREATE INDEX idx_deployment_zone_code ON deployment_zone(zone_code);
