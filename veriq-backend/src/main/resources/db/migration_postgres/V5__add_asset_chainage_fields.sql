-- Flyway Migration V5: Add Linear Asset Chainage Fields
-- Adds start_chainage, end_chainage, and total_length to asset table

ALTER TABLE asset
    ADD COLUMN IF NOT EXISTS start_chainage NUMERIC(12, 3),
    ADD COLUMN IF NOT EXISTS end_chainage NUMERIC(12, 3),
    ADD COLUMN IF NOT EXISTS total_length NUMERIC(12, 3);
