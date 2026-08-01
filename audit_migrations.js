const fs = require('fs');
const path = require('path');

const migrationDir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db', 'migration');
const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort((a, b) => {
    const numA = parseInt(a.match(/^V(\d+)/)[1]);
    const numB = parseInt(b.match(/^V(\d+)/)[1]);
    return numA - numB;
});

console.log('========================================================================');
console.log(' FLYWAY MIGRATION COMPATIBILITY AUDIT REPORT (25 MIGRATION FILES)');
console.log('========================================================================\n');

files.forEach(file => {
    const content = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    const issues = [];

    if (content.includes('gen_random_uuid()')) issues.push('gen_random_uuid() [H2 2.2 syntax error]');
    if (content.includes('ON CONFLICT')) issues.push('ON CONFLICT [PostgreSQL upsert syntax]');
    if (/JSONB?/i.test(content)) issues.push('JSON/JSONB type [PostgreSQL specific]');
    if (/ILIKE/i.test(content)) issues.push('ILIKE operator [PostgreSQL specific]');

    console.log(`[FILE]: ${file}`);
    if (issues.length > 0) {
        console.log(`  Categorization: POSTGRESQL SPECIFIC`);
        console.log(`  Incompatibilities: ${issues.join(', ')}`);
    } else {
        console.log(`  Categorization: CROSS-COMPATIBLE / H2 COMPATIBLE`);
    }
    console.log('');
});
