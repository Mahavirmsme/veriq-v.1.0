-- Flyway Migration V34: Add V34 Engineering Specification and Geometry Fields (PostgreSQL)
-- Adds seepage_path_length, foundation_embedment_depth, and sensor_span_distance to node_engineering_geometry
-- Adds design_significant_wave_height, design_peak_wave_period, and unsaturated_friction_angle to asset_engineering_specification

ALTER TABLE node_engineering_geometry
    ADD COLUMN IF NOT EXISTS seepage_path_length NUMERIC(12, 4) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS foundation_embedment_depth NUMERIC(12, 4) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS sensor_span_distance NUMERIC(12, 4) DEFAULT NULL;

ALTER TABLE asset_engineering_specification
    ADD COLUMN IF NOT EXISTS design_significant_wave_height NUMERIC(8, 4) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS design_peak_wave_period NUMERIC(8, 4) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS unsaturated_friction_angle NUMERIC(8, 4) DEFAULT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_seepage_path_length') THEN
        ALTER TABLE node_engineering_geometry
            ADD CONSTRAINT chk_seepage_path_length CHECK (seepage_path_length IS NULL OR seepage_path_length > 0.0000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_foundation_embedment_depth') THEN
        ALTER TABLE node_engineering_geometry
            ADD CONSTRAINT chk_foundation_embedment_depth CHECK (foundation_embedment_depth IS NULL OR foundation_embedment_depth >= 0.0000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_sensor_span_distance') THEN
        ALTER TABLE node_engineering_geometry
            ADD CONSTRAINT chk_sensor_span_distance CHECK (sensor_span_distance IS NULL OR sensor_span_distance > 0.0000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_design_significant_wave_height') THEN
        ALTER TABLE asset_engineering_specification
            ADD CONSTRAINT chk_design_significant_wave_height CHECK (design_significant_wave_height IS NULL OR design_significant_wave_height >= 0.0000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_design_peak_wave_period') THEN
        ALTER TABLE asset_engineering_specification
            ADD CONSTRAINT chk_design_peak_wave_period CHECK (design_peak_wave_period IS NULL OR design_peak_wave_period > 0.0000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_unsaturated_friction_angle') THEN
        ALTER TABLE asset_engineering_specification
            ADD CONSTRAINT chk_unsaturated_friction_angle CHECK (unsaturated_friction_angle IS NULL OR (unsaturated_friction_angle >= 0.0000 AND unsaturated_friction_angle <= 90.0000));
    END IF;
END $$;
