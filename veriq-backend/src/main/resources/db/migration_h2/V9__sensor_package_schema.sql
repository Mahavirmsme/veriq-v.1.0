-- Flyway Migration V9: Create Sensor Package Schema for Engineering Design Workspace (AUDIT-012)
-- Sensor Package represents the Engineering Instrumentation Design for an Engineering Node

CREATE TABLE IF NOT EXISTS sensor_package (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    engineering_node_id UUID NOT NULL UNIQUE REFERENCES engineering_node(id) ON DELETE CASCADE,
    package_status VARCHAR(20) NOT NULL DEFAULT 'VALIDATED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_package_item (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    sensor_package_id UUID NOT NULL REFERENCES sensor_package(id) ON DELETE CASCADE,
    sensor_type VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    measurement_parameter VARCHAR(150),
    engineering_purpose VARCHAR(255),
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sensor_package_node_id ON sensor_package(engineering_node_id);

CREATE INDEX idx_sensor_package_item_pkg_id ON sensor_package_item(sensor_package_id);
