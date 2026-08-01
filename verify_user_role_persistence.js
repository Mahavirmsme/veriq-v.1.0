const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const jarPath = path.join(__dirname, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');
const dbDir = path.join(__dirname, 'verify_role_test');

if (fs.existsSync(dbDir)) {
    fs.rmSync(dbDir, { recursive: true, force: true });
}
fs.mkdirSync(dbDir, { recursive: true });

const PORT = 8085;

console.log(`--- STARTING VERIQ BACKEND ON PORT ${PORT} IN VERIFY WORKSPACE ---`);
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
        console.error('Server failed to start in time. Log snippet:\n', outputLog.slice(-1000));
        child.kill();
        process.exit(1);
    }

    console.log('1. Testing Create User with Assigned Roles ("ADMIN", "CONFIG_ENGINEER")...');
    const timestamp = Date.now();
    const createRes = await post('/api/v1/users', {
        firstName: 'Test',
        lastName: 'Engineer',
        email: `test.engineer.${timestamp}@veriq.io`,
        passwordHash: '$2a$10$e8w9u/8p0xY0',
        status: 'ACTIVE',
        assignedRoles: ['ADMIN', 'CONFIG_ENGINEER'],
        defaultRole: 'ADMIN'
    });

    console.log('Create User Response Status:', createRes.status);
    console.log('Create User Response Body:', JSON.stringify(createRes.body, null, 2));

    const userId = createRes.body.data.id;
    const initialAssignedRoles = createRes.body.data.assignedRoles;
    const initialDefaultRole = createRes.body.data.defaultRole;

    console.log('2. Verifying Get User By ID returned assigned roles & default role...');
    const getRes = await get(`/api/v1/users/${userId}`);
    console.log('Get User Response Body:', JSON.stringify(getRes.body, null, 2));

    console.log('3. Testing Update User with New Assigned Roles ("CHIEF_ENGINEER")...');
    const updateRes = await put(`/api/v1/users/${userId}`, {
        firstName: 'UpdatedName',
        lastName: 'Engineer',
        status: 'ACTIVE',
        assignedRoles: ['CHIEF_ENGINEER'],
        defaultRole: 'CHIEF_ENGINEER'
    });

    console.log('Update User Response Status:', updateRes.status);
    console.log('Update User Response Body:', JSON.stringify(updateRes.body, null, 2));

    const updatedRoles = updateRes.body.data.assignedRoles;
    const updatedDefaultRole = updateRes.body.data.defaultRole;

    child.kill();

    console.log('=== VERIFICATION SUMMARY ===');
    console.log('Initial Assigned Roles:', initialAssignedRoles);
    console.log('Initial Default Role:', initialDefaultRole);
    console.log('Updated Assigned Roles:', updatedRoles);
    console.log('Updated Default Role:', updatedDefaultRole);

    if (
        initialAssignedRoles.includes('ADMIN') &&
        initialAssignedRoles.includes('CONFIG_ENGINEER') &&
        initialDefaultRole === 'ADMIN' &&
        updatedRoles.includes('CHIEF_ENGINEER') &&
        updatedDefaultRole === 'CHIEF_ENGINEER'
    ) {
        console.log('USER ROLE PERSISTENCE VERIFICATION PASSED SUCCESSFULLY!');
    } else {
        console.error('VERIFICATION FAILED!');
        process.exit(1);
    }
}

runVerification().catch((err) => {
    console.error('Execution error:', err);
    child.kill();
    process.exit(1);
});
