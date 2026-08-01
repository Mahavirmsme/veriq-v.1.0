const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const jarPath = path.join(__dirname, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');
const dbDir = path.join(__dirname, 'db_evidence_workspace');

if (fs.existsSync(dbDir)) {
    fs.rmSync(dbDir, { recursive: true, force: true });
}
fs.mkdirSync(dbDir, { recursive: true });

const PORT = 8089;

console.log(`=== STARTING BACKEND FOR DB EVIDENCE ON PORT ${PORT} ===`);
const child = cp.spawn('java', ['-jar', jarPath, '--spring.profiles.active=eval', `--server.port=${PORT}`], {
    cwd: dbDir,
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe']
});

let outputLog = '';
child.stdout.on('data', (d) => { outputLog += d.toString(); });
child.stderr.on('data', (d) => { outputLog += d.toString(); });

function post(urlPath, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: urlPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function get(urlPath) {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', reject);
    });
}

async function run() {
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (outputLog.includes('Started VeriqApplication')) break;
    }

    const timestamp = Date.now();
    const createRes = await post('/api/v1/users', {
        firstName: 'Empirical',
        lastName: 'TestUser',
        email: `empirical.user.${timestamp}@veriq.io`,
        passwordHash: '$2a$10$e8w9u/8p0xY0',
        status: 'ACTIVE',
        assignedRoles: ['ADMIN', 'CONFIG_ENGINEER'],
        defaultRole: 'ADMIN'
    });

    const user = createRes.body.data;
    console.log('CREATED_USER_JSON:', JSON.stringify(user, null, 2));

    const listRes = await get('/api/v1/users');
    console.log('ALL_USERS_JSON:', JSON.stringify(listRes.body, null, 2));

    child.kill();
}

run().catch(err => {
    console.error(err);
    child.kill();
});
