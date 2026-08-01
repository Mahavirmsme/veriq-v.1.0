const fs = require('fs');
const path = require('path');

const h2Dir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db', 'migration_h2');
const files = fs.readdirSync(h2Dir).filter(f => f.endsWith('.sql'));

files.forEach(f => {
    const p = path.join(h2Dir, f);
    let content = fs.readFileSync(p, 'utf8');

    // Convert multi-clause ALTER TABLE into separate ALTER TABLE statements for H2
    if (content.includes('ALTER TABLE')) {
        const statements = content.split(';');
        const newStatements = statements.map(stmt => {
            if (stmt.includes('ALTER TABLE')) {
                const match = stmt.match(/ALTER\s+TABLE\s+([^\s]+)/i);
                if (match) {
                    const tableName = match[1];
                    // Check ADD COLUMN or DROP COLUMN
                    if (stmt.includes('ADD COLUMN') || stmt.includes('DROP COLUMN')) {
                        const firstClauseIdx = stmt.search(/(ADD|DROP)\s+COLUMN/i);
                        if (firstClauseIdx !== -1) {
                            const clausesPart = stmt.substring(firstClauseIdx);
                            const clauses = clausesPart.split(/,\s*(?=(ADD|DROP)\s+COLUMN)/i);
                            // Filter out captured groups from regex split
                            const realClauses = clauses.filter(c => c.toUpperCase().startsWith('ADD') || c.toUpperCase().startsWith('DROP'));
                            if (realClauses.length > 1) {
                                return realClauses.map(c => `ALTER TABLE ${tableName} ${c.trim()}`).join(';\n');
                            }
                        }
                    }
                }
            }
            return stmt;
        });
        content = newStatements.join(';');
        fs.writeFileSync(p, content, 'utf8');
    }
});

console.log('Successfully updated H2 ALTER TABLE ADD/DROP statements');
