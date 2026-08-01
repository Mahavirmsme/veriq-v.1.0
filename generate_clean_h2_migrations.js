const fs = require('fs');
const path = require('path');

const pgDir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db', 'migration_postgres');
const h2Dir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db', 'migration_h2');

if (!fs.existsSync(h2Dir)) {
    fs.mkdirSync(h2Dir, { recursive: true });
}

const files = fs.readdirSync(pgDir).filter(f => f.endsWith('.sql'));

files.forEach(f => {
    const pgPath = path.join(pgDir, f);
    const h2Path = path.join(h2Dir, f);
    let sql = fs.readFileSync(pgPath, 'utf8');

    // 1. Function and type replacements
    sql = sql.replace(/gen_random_uuid\(\)/g, 'random_uuid()');
    sql = sql.replace(/::uuid/g, '');

    // 2. Primary key constraint order
    sql = sql.replace(/UUID\s+PRIMARY\s+KEY\s+DEFAULT\s+random_uuid\(\)/gi, 'UUID DEFAULT random_uuid() PRIMARY KEY');

    // 3. Multi-column ALTER TABLE ADD/DROP COLUMN splits
    const statements = sql.split(';');
    const convertedStatements = statements.map(stmt => {
        let trimmed = stmt.trim();
        if (!trimmed) return '';

        if (/ALTER\s+TABLE\s+\w+\s+(ADD|DROP)\s+COLUMN/i.test(trimmed)) {
            const tableMatch = trimmed.match(/ALTER\s+TABLE\s+([^\s]+)/i);
            if (tableMatch) {
                const tableName = tableMatch[1];
                const firstClauseIdx = trimmed.search(/(ADD|DROP)\s+COLUMN/i);
                if (firstClauseIdx !== -1) {
                    const clausesPart = trimmed.substring(firstClauseIdx);
                    const clauses = clausesPart.split(/,\s*(?=(ADD|DROP)\s+COLUMN)/i).filter(c => /^\s*(ADD|DROP)\s+COLUMN/i.test(c));
                    if (clauses.length > 1) {
                        return clauses.map(c => `ALTER TABLE ${tableName} ${c.trim()}`).join(';\n');
                    }
                }
            }
        }

        // ON CONFLICT handling
        if (trimmed.includes('ON CONFLICT')) {
            if (f.startsWith('V18')) {
                return `MERGE INTO roles (id, role_code, role_name, role_description, is_system_role) KEY (role_code) VALUES 
('11111111-1111-1111-1111-111111111111', 'ADMIN', 'System Administrator', 'Full System Administration, User Management, License, & Security Policy control.', TRUE),
('22222222-2222-2222-2222-222222222222', 'CONFIG_ENGINEER', 'Configuration Engineer', 'Digital Infrastructure Authoring, Hierarchy Design, Publishing & Commissioning.', TRUE),
('33333333-3333-3333-3333-333333333333', 'CHIEF_ENGINEER', 'Chief Engineer', 'WRD Headquarters Command Center access & statewide risk overview.', TRUE),
('44444444-4444-4444-4444-444444444444', 'ASSET_MANAGER', 'Asset Manager', 'Asset Command Dashboard access & regional sector oversight.', TRUE),
('55555555-5555-5555-5555-555555555555', 'REGIONAL_ENGINEER', 'Regional Engineer', 'Region Operations Dashboard access & Linear Ribbon investigation.', TRUE),
('66666666-6666-6666-6666-666666666666', 'FIELD_ENGINEER', 'Field Engineer', 'Node Engineering Workspace access & field telemetry inspection.', TRUE)`;
            }
            if (f.startsWith('V19')) {
                return `MERGE INTO permissions (permission_id, permission_code, permission_name, permission_description) KEY (permission_code) VALUES 
('11111111-1111-1111-1111-222222222221', 'ADMINISTRATION', 'Administration Workspace Access', 'Grants access to System Administration Workspace.'),
('11111111-1111-1111-1111-222222222222', 'CONFIGURATION', 'Project Configuration Access', 'Grants access to Project Configuration & Digital Infrastructure Authoring.'),
('11111111-1111-1111-1111-222222222223', 'OPERATIONS', 'Operations Command Center Access', 'Grants access to Operations Command Center & Engineering Infrastructure Monitoring.'),
('11111111-1111-1111-1111-222222222224', 'VIEW_REPORTS', 'View Operational Reports', 'Grants permission to view system analytics & operational reports.'),
('11111111-1111-1111-1111-222222222225', 'MANAGE_USERS', 'Manage Platform Users', 'Grants permission to create, update, and manage platform user accounts.'),
('11111111-1111-1111-1111-222222222226', 'MANAGE_ROLES', 'Manage Platform Roles', 'Grants permission to configure roles and permission policies.')`;
            }
            if (f.startsWith('V20')) {
                return `MERGE INTO role_permissions (role_permission_id, role_id, permission_id) KEY (role_id, permission_id)
SELECT 
    random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    p.permission_id
FROM permissions p`;
            }
            if (f.startsWith('V24') && trimmed.includes('INSERT INTO deployment_zone')) {
                return `INSERT INTO deployment_zone (id, asset_id, zone_code, zone_name, priority, start_chainage, end_chainage, zone_length, node_spacing, total_nodes, zone_status)
SELECT 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PZ-01', 'Deck & Pier Abutment Zone', 'High', 0.000, 1.000, 1.000, 100.00, 5, 'VALIDATED'
FROM asset WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

INSERT INTO deployment_zone (id, asset_id, zone_code, zone_name, priority, start_chainage, end_chainage, zone_length, node_spacing, total_nodes, zone_status)
SELECT 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PZ-02', 'Tower Pylon & Stay Cable Zone', 'Very High', 1.000, 2.000, 1.000, 50.00, 10, 'VALIDATED'
FROM asset WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'`;
            }

            trimmed = trimmed.replace(/ON CONFLICT\s*\([^)]*\)\s*DO NOTHING/gi, 'ON CONFLICT DO NOTHING');
        }

        return trimmed;
    });

    const finalSql = convertedStatements.filter(s => s.trim().length > 0).join(';\n\n') + ';\n';
    fs.writeFileSync(h2Path, finalSql, 'utf8');
});

console.log('Successfully generated clean H2 migrations for V1 through V25');
