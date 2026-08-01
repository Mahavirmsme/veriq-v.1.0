-- Flyway Migration V16: Create Asset State Repository Schema (AUDIT-022)
-- Authoritative runtime state store for Asset aggregated health

CREATE TABLE IF NOT EXISTS asset_state_record (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    asset_id UUID NOT NULL UNIQUE REFERENCES asset(id) ON DELETE CASCADE,
    current_health VARCHAR(30) NOT NULL,
    previous_health VARCHAR(30),
    total_regions INT NOT NULL DEFAULT 0,
    healthy_regions INT NOT NULL DEFAULT 0,
    warning_regions INT NOT NULL DEFAULT 0,
    critical_regions INT NOT NULL DEFAULT 0,
    offline_regions INT NOT NULL DEFAULT 0,
    evaluation_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    evaluation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_state_record_asset_id ON asset_state_record(asset_id);
