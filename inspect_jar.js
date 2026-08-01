const fs = require('fs');

const buf = fs.readFileSync('veriq-backend/target/veriq-backend-1.0.0-SNAPSHOT.jar');
let str = buf.toString('latin1');
let matches = str.match(/BOOT-INF\/classes\/db\/[^\x00"']+/g) || [];
let unique = [...new Set(matches)];
console.log('=== REAL MIGRATION FOLDERS IN JAR ===');
console.log(unique.filter(x => x.endsWith('.sql')).join('\n'));
