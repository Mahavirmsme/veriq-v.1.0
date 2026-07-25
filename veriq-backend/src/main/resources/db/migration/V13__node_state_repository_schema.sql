-- Flyway Migration V13: Create Node State Repository Schema (AUDIT-019A)
-- Authoritative runtime state store for every Engineering Node

CREATE TABLE IF NOT EXISTS node_state_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineering_node_id UUID NOT NULL UNIQUE REFERENCES engineering_node(id) ON DELETE CASCADE,
    current_health VARCHAR(30) NOT NULL,
    previous_health VARCHAR(30),
    evaluation_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    observation_count INT NOT NULL DEFAULT 0,
    evaluation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    health_source VARCHAR(100) NOT NULL DEFAULT 'Node Health Engine',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_node_state_record_node_id ON node_state_record(engineering_node_id);
