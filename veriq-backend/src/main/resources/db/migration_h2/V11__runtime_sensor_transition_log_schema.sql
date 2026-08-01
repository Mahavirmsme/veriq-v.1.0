-- Flyway Migration V11: Create Runtime Sensor Transition Audit Log Schema
-- Permanent history of system-controlled operational state transitions

CREATE TABLE IF NOT EXISTS runtime_sensor_transition_log (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    runtime_sensor_id UUID NOT NULL REFERENCES runtime_sensor(id) ON DELETE CASCADE,
    previous_state VARCHAR(50) NOT NULL,
    new_state VARCHAR(50) NOT NULL,
    transition_owner VARCHAR(100) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_runtime_sensor_trans_sensor_id ON runtime_sensor_transition_log(runtime_sensor_id);
