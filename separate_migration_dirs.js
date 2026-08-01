const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, 'veriq-backend', 'src', 'main', 'resources', 'db');
const h2Old = path.join(resDir, 'migration', 'h2');
const pgOld = path.join(resDir, 'migration', 'postgresql');

const h2New = path.join(resDir, 'migration_h2');
const pgNew = path.join(resDir, 'migration_postgres');

if (fs.existsSync(h2Old)) {
    fs.renameSync(h2Old, h2New);
}
if (fs.existsSync(pgOld)) {
    fs.renameSync(pgOld, pgNew);
}
if (fs.existsSync(path.join(resDir, 'migration'))) {
    fs.rmSync(path.join(resDir, 'migration'), { recursive: true, force: true });
}

console.log('Successfully separated migration directories into db/migration_h2 and db/migration_postgres');
