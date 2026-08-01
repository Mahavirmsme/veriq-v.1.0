-- Flyway Migration V8: Create Engineering Node Schema for Engineering Design Workspace (AUDIT-011)
-- Engineering Node represents the smallest Engineering Design Unit inside a Deployment Zone

CREATE TABLE IF NOT EXISTS engineering_node (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_zone_id UUID NOT NULL REFERENCES deployment_zone(id) ON DELETE CASCADE,
    node_code VARCHAR(50) NOT NULL,
    node_number INTEGER NOT NULL,
    chainage NUMERIC(12, 3) NOT NULL,
    node_status VARCHAR(20) NOT NULL DEFAULT 'VALIDATED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_engineering_node_zone_id ON engineering_node(deployment_zone_id);
CREATE INDEX idx_engineering_node_code ON engineering_node(node_code);
CREATE INDEX idx_engineering_node_chainage ON engineering_node(chainage);
