-- Flyway Migration V1: Initial Schema Baseline (FROZEN)
-- Tier 1 of 10-Tier Architecture: PostgreSQL Database Tables

CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    industry VARCHAR(50) NOT NULL,
    tier VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    description TEXT,
    contact_email VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organization_code ON organization(code);
CREATE INDEX idx_organization_status ON organization(status);
