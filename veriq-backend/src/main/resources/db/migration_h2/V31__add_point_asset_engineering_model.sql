-- Flyway Migration V31: Add Point Asset Engineering Model Fields
-- Adds start_chainage, structure_length_meters, and end_chainage to point_asset table

ALTER TABLE point_asset ADD COLUMN IF NOT EXISTS start_chainage NUMERIC(12, 3);
ALTER TABLE point_asset ADD COLUMN IF NOT EXISTS structure_length_meters NUMERIC(12, 2);
ALTER TABLE point_asset ADD COLUMN IF NOT EXISTS end_chainage NUMERIC(12, 3);

-- Backward compatibility update for existing seed records
UPDATE point_asset
SET start_chainage = location_chainage
WHERE start_chainage IS NULL AND location_chainage IS NOT NULL;
