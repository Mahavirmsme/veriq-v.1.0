-- Flyway Migration V24: Support Direct Point Asset Deployment Zones and Seed Point Assets
-- Allows deployment_zone to reference asset_id directly for Point Assets (bypassing region_id)

ALTER TABLE deployment_zone ALTER COLUMN region_id DROP NOT NULL;

ALTER TABLE deployment_zone ADD COLUMN IF NOT EXISTS asset_id UUID REFERENCES asset(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_deployment_zone_asset_id ON deployment_zone(asset_id);

-- Seed Default Point Assets if not already present
INSERT INTO asset (id, project_id, asset_name, asset_code, asset_description, asset_class, asset_nature, asset_status)
SELECT 
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    p.id,
    'Bridge 27 (Yamuna Crossing)',
    'BR-27',
    'Cable-Stayed Major River Bridge',
    'Bridge',
    'Point',
    'ACTIVE'
FROM project p LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO asset (id, project_id, asset_name, asset_code, asset_description, asset_class, asset_nature, asset_status)
SELECT 
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    p.id,
    'Kosi Hydro Dam Complex',
    'KDC-01',
    'Hydroelectric Power Dam & Sluice Gates',
    'Dam',
    'Point',
    'ACTIVE'
FROM project p LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO deployment_zone (id, asset_id, zone_code, zone_name, priority, start_chainage, end_chainage, zone_length, node_spacing, total_nodes, zone_status)
SELECT 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PZ-01', 'Deck & Pier Abutment Zone', 'High', 0.000, 1.000, 1.000, 100.00, 5, 'VALIDATED'
FROM asset WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

INSERT INTO deployment_zone (id, asset_id, zone_code, zone_name, priority, start_chainage, end_chainage, zone_length, node_spacing, total_nodes, zone_status)
SELECT 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PZ-02', 'Tower Pylon & Stay Cable Zone', 'Very High', 1.000, 2.000, 1.000, 50.00, 10, 'VALIDATED'
FROM asset WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
