-- Flyway Migration V25: Create Point Asset Schema and Link Deployment Zones
-- Enforces Frozen VERIQ Domain Hierarchy: Project -> Asset -> Point Asset -> Deployment Zone

CREATE TABLE IF NOT EXISTS point_asset (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
    point_asset_code VARCHAR(50) NOT NULL,
    point_asset_name VARCHAR(150) NOT NULL,
    point_asset_type VARCHAR(100) NOT NULL,
    location_chainage NUMERIC(12, 3),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_point_asset_asset_id ON point_asset(asset_id);
CREATE INDEX IF NOT EXISTS idx_point_asset_code ON point_asset(point_asset_code);

ALTER TABLE deployment_zone ADD COLUMN IF NOT EXISTS point_asset_id UUID REFERENCES point_asset(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_deployment_zone_point_asset_id ON deployment_zone(point_asset_id);

-- Seed Sample Point Assets linked to existing Assets
INSERT INTO point_asset (id, asset_id, point_asset_code, point_asset_name, point_asset_type, location_chainage)
SELECT 
    'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'::uuid,
    a.id,
    'BR-27',
    'Bridge 27 (Yamuna Crossing)',
    'Bridge',
    145.200
FROM asset a WHERE a.asset_nature = 'Linear' OR a.asset_code = 'SM-01' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO point_asset (id, asset_id, point_asset_code, point_asset_name, point_asset_type, location_chainage)
SELECT 
    'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c'::uuid,
    a.id,
    'BR-41',
    'Bridge 41 (Overpass Structure)',
    'Bridge',
    230.500
FROM asset a WHERE a.asset_nature = 'Linear' OR a.asset_code = 'SM-01' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO point_asset (id, asset_id, point_asset_code, point_asset_name, point_asset_type, location_chainage)
SELECT 
    'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d'::uuid,
    a.id,
    'DAM-02',
    'Dam 02 (Spillway Complex)',
    'Dam',
    0.000
FROM asset a WHERE a.asset_nature = 'Point' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO point_asset (id, asset_id, point_asset_code, point_asset_name, point_asset_type, location_chainage)
SELECT 
    'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e'::uuid,
    a.id,
    'PS-11',
    'Pump Station 11 (Intake Plant)',
    'Pump Station',
    0.000
FROM asset a WHERE a.asset_nature = 'Point' LIMIT 1
ON CONFLICT DO NOTHING;
