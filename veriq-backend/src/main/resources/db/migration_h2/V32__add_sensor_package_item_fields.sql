-- Flyway Migration V32: Add Sensor Package Engineering Parameters
-- Adds sampling_seconds, warning_threshold, and critical_threshold to sensor_package_item table

ALTER TABLE sensor_package_item ADD COLUMN IF NOT EXISTS sampling_seconds INT DEFAULT 1;
ALTER TABLE sensor_package_item ADD COLUMN IF NOT EXISTS warning_threshold VARCHAR(100);
ALTER TABLE sensor_package_item ADD COLUMN IF NOT EXISTS critical_threshold VARCHAR(100);
