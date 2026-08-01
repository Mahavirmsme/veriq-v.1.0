-- Flyway Migration V12: Create Rejected Telemetry Packet Log Schema (AUDIT-017)
-- Engineering evidence gatekeeper audit log for rejected untrusted packets

CREATE TABLE IF NOT EXISTS rejected_packet_log (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    sensor_code VARCHAR(50),
    validation_stage VARCHAR(50) NOT NULL,
    rejection_reason VARCHAR(255) NOT NULL,
    raw_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rejected_packet_sensor_code ON rejected_packet_log(sensor_code);
