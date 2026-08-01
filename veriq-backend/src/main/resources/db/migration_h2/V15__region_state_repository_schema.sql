-- Flyway Migration V15: Create Region State Repository Schema (AUDIT-021)
-- Authoritative runtime state store for Region aggregated health

CREATE TABLE IF NOT EXISTS region_state_record (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    region_id UUID NOT NULL UNIQUE REFERENCES region(id) ON DELETE CASCADE,
    current_health VARCHAR(30) NOT NULL,
    previous_health VARCHAR(30),
    total_zones INT NOT NULL DEFAULT 0,
    healthy_zones INT NOT NULL DEFAULT 0,
    warning_zones INT NOT NULL DEFAULT 0,
    critical_zones INT NOT NULL DEFAULT 0,
    offline_zones INT NOT NULL DEFAULT 0,
    evaluation_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    evaluation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_region_state_record_region_id ON region_state_record(region_id);
