-- Flyway Migration V10: Create Commissioning and Runtime Sensor Schema (AUDIT-013)
-- Commissioning converts Engineering Design (Sensor Package) into Runtime Sensor Infrastructure

CREATE TABLE IF NOT EXISTS commissioning_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineering_node_id UUID NOT NULL UNIQUE REFERENCES engineering_node(id) ON DELETE CASCADE,
    sensor_package_id UUID NOT NULL REFERENCES sensor_package(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    commissioned_date TIMESTAMP WITH TIME ZONE,
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS runtime_sensor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commissioning_record_id UUID NOT NULL REFERENCES commissioning_record(id) ON DELETE CASCADE,
    engineering_node_id UUID NOT NULL REFERENCES engineering_node(id) ON DELETE CASCADE,
    sensor_code VARCHAR(50) NOT NULL UNIQUE,
    sensor_type VARCHAR(100) NOT NULL,
    measurement_parameter VARCHAR(150),
    sensor_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissioning_record_node_id ON commissioning_record(engineering_node_id);
CREATE INDEX idx_runtime_sensor_node_id ON runtime_sensor(engineering_node_id);
CREATE INDEX idx_runtime_sensor_code ON runtime_sensor(sensor_code);
