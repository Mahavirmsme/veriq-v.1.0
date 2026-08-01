const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const jarPath = path.join(__dirname, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');
const dbDir = path.join(__dirname, 'full_verify_workspace');

if (fs.existsSync(dbDir)) {
    fs.rmSync(dbDir, { recursive: true, force: true });
}
fs.mkdirSync(dbDir, { recursive: true });

const PORT = 8088;

console.log(`=== STARTING BACKEND FOR FULL VERIFICATION ON PORT ${PORT} ===`);
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

function put(urlPath, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: urlPath,
            method: 'PUT',
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

async function runVerification() {
    let started = false;
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (outputLog.includes('Started VeriqApplication')) {
            started = true;
            break;
        }
    }

    if (!started) {
        console.error('Server startup failed. Log:\n', outputLog.slice(-1000));
        child.kill();
        process.exit(1);
    }

    console.log('\n--- 1. POST /api/v1/users (CREATE USER) ---');
    const timestamp = Date.now();
    const createRes = await post('/api/v1/users', {
        firstName: 'Verification',
        lastName: 'User',
        email: `verify.${timestamp}@veriq.io`,
        passwordHash: '$2a$10$e8w9u/8p0xY0',
        status: 'ACTIVE',
        assignedRoles: ['ADMIN', 'CONFIG_ENGINEER'],
        defaultRole: 'ADMIN'
    });
    console.log('Status:', createRes.status);
    console.log(JSON.stringify(createRes.body, null, 2));

    const userId = createRes.body.data.id;

    console.log('\n--- 2. GET /api/v1/users (LIST ALL USERS) ---');
    const listRes = await get('/api/v1/users');
    console.log('Status:', listRes.status);
    console.log(JSON.stringify(listRes.body, null, 2));

    console.log('\n--- 3. GET /api/v1/users/{id} (FETCH CREATED USER) ---');
    const getRes = await get(`/api/v1/users/${userId}`);
    console.log('Status:', getRes.status);
    console.log(JSON.stringify(getRes.body, null, 2));

    console.log('\n--- 4. PUT /api/v1/users/{id} (UPDATE USER ROLES TO CHIEF_ENGINEER) ---');
    const updateRes = await put(`/api/v1/users/${userId}`, {
        firstName: 'Verification',
        lastName: 'UserUpdated',
        status: 'ACTIVE',
        assignedRoles: ['CHIEF_ENGINEER'],
        defaultRole: 'CHIEF_ENGINEER'
    });
    console.log('Status:', updateRes.status);
    console.log(JSON.stringify(updateRes.body, null, 2));

    console.log('\n--- 5. GET /api/v1/users/{id} (AFTER UPDATE) ---');
    const getAfterUpdateRes = await get(`/api/v1/users/${userId}`);
    console.log('Status:', getAfterUpdateRes.status);
    console.log(JSON.stringify(getAfterUpdateRes.body, null, 2));

    child.kill();
    console.log('\n=== FULL VERIFICATION COMPLETE ===');
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    child.kill();
    process.exit(1);
});
