-- Flyway Migration V2: Update Organization Schema for AUDIT-010
-- Preserves V1 history while adding AUDIT-010 fields and removing obsolete columns

ALTER TABLE organization
    ADD COLUMN IF NOT EXISTS organization_type VARCHAR(50) NOT NULL DEFAULT 'Enterprise',
    ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100) NOT NULL DEFAULT 'Primary Contact',
    ADD COLUMN IF NOT EXISTS designation VARCHAR(100),
    ADD COLUMN IF NOT EXISTS contact_mobile VARCHAR(30) NOT NULL DEFAULT 'N/A',
    ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS state VARCHAR(100),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100),
    ADD COLUMN IF NOT EXISTS pin_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS project_count INT NOT NULL DEFAULT 0;

ALTER TABLE organization
    DROP COLUMN IF EXISTS industry,
    DROP COLUMN IF EXISTS tier;
