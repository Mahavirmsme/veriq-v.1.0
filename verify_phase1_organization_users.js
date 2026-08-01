const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const jarPath = path.join(__dirname, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');
const dbDir = path.join(__dirname, 'phase1_verify_workspace');

if (fs.existsSync(dbDir)) {
    fs.rmSync(dbDir, { recursive: true, force: true });
}
fs.mkdirSync(dbDir, { recursive: true });

const PORT = 8094;

console.log(`=== STARTING BACKEND FOR PHASE-1 VERIFICATION ON PORT ${PORT} ===`);
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

    console.log('\n--- 1. POST /api/v1/users (CREATE USER WITH TENANT CONTEXT INTERFACE) ---');
    const timestamp = Date.now();
    const deptId = "d0000000-0000-0000-0000-000000000001";
    const desgId = "e0000000-0000-0000-0000-000000000001";

    const createRes = await post('/api/v1/users', {
        firstName: 'TenantUser',
        lastName: 'Phase1',
        email: `tenant.user.${timestamp}@veriq.io`,
        passwordHash: '$2a$10$e8w9u/8p0xY0',
        departmentId: deptId,
        designationId: desgId,
        status: 'ACTIVE',
        assignedRoles: ['ADMIN'],
        defaultRole: 'ADMIN'
    });

    console.log('Create Status:', createRes.status);
    console.log('Create Response Body:\n', JSON.stringify(createRes.body, null, 2));

    const userId = createRes.body.data.id;
    const returnedDeptId = createRes.body.data.departmentId;
    const returnedDesgId = createRes.body.data.designationId;

    console.log('\n--- 2. GET /api/v1/users/{id} ---');
    const getRes = await get(`/api/v1/users/${userId}`);
    console.log('Get Response Body:\n', JSON.stringify(getRes.body, null, 2));

    console.log('\n--- 3. PUT /api/v1/users/{id} ---');
    const updateRes = await put(`/api/v1/users/${userId}`, {
        firstName: 'TenantUserUpdated',
        lastName: 'Phase1',
        departmentId: deptId,
        designationId: desgId,
        status: 'ACTIVE'
    });

    console.log('Update Status:', updateRes.status);
    console.log('Update Response Body:\n', JSON.stringify(updateRes.body, null, 2));

    child.kill();

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('Created User ID:', userId);
    console.log('Persisted Department ID:', returnedDeptId);
    console.log('Persisted Designation ID:', returnedDesgId);

    if (returnedDeptId === deptId && returnedDesgId === desgId) {
        console.log('TENANT CONTEXT RESOLVER INTERFACE VERIFICATION PASSED SUCCESSFULLY!');
    } else {
        console.error('VERIFICATION FAILED!');
        process.exit(1);
    }
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    child.kill();
    process.exit(1);
});
