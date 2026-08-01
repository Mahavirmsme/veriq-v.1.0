CREATE TABLE IF NOT EXISTS platform_bootstrap_status (
    id UUID PRIMARY KEY,
    initialized BOOLEAN NOT NULL DEFAULT FALSE,
    platform_name VARCHAR(255),
    organization_name VARCHAR(255),
    deployment_environment VARCHAR(255),
    admin_name VARCHAR(255),
    admin_email VARCHAR(255),
    admin_password_hash VARCHAR(255),
    initialized_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
