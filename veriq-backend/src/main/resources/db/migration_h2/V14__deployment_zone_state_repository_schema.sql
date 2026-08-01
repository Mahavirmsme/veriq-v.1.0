-- Flyway Migration V14: Create Deployment Zone State Repository Schema (AUDIT-020)
-- Authoritative runtime state store for Deployment Zone aggregated health

CREATE TABLE IF NOT EXISTS deployment_zone_state_record (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    deployment_zone_id UUID NOT NULL UNIQUE REFERENCES deployment_zone(id) ON DELETE CASCADE,
    current_health VARCHAR(30) NOT NULL,
    previous_health VARCHAR(30),
    total_nodes INT NOT NULL DEFAULT 0,
    healthy_nodes INT NOT NULL DEFAULT 0,
    warning_nodes INT NOT NULL DEFAULT 0,
    critical_nodes INT NOT NULL DEFAULT 0,
    offline_nodes INT NOT NULL DEFAULT 0,
    evaluation_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    evaluation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zone_state_record_zone_id ON deployment_zone_state_record(deployment_zone_id);
