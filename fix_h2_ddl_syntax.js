const fs = require('fs');
const path = require('path');

const h2Dir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db', 'migration_h2');

const files = fs.readdirSync(h2Dir).filter(f => f.endsWith('.sql'));

files.forEach(f => {
    const p = path.join(h2Dir, f);
    let content = fs.readFileSync(p, 'utf8');

    // Fix H2 primary key default constraint order: PRIMARY KEY DEFAULT random_uuid() -> DEFAULT random_uuid() PRIMARY KEY
    content = content.replace(/UUID\s+PRIMARY\s+KEY\s+DEFAULT\s+random_uuid\(\)/gi, 'UUID DEFAULT random_uuid() PRIMARY KEY');
    
    fs.writeFileSync(p, content, 'utf8');
});

console.log('Successfully updated H2 constraint ordering in all H2 migration files');
