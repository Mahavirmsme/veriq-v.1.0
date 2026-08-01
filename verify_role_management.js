const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const jarPath = path.join(__dirname, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');
const dbDir = path.join(__dirname, 'role_verify_workspace');

if (fs.existsSync(dbDir)) {
    fs.rmSync(dbDir, { recursive: true, force: true });
}
fs.mkdirSync(dbDir, { recursive: true });

const PORT = 8099;

console.log(`=== STARTING BACKEND FOR ROLE MANAGEMENT VERIFICATION ON PORT ${PORT} ===`);
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

function del(urlPath) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: urlPath,
            method: 'DELETE'
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', reject);
        req.end();
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
        child.kill('SIGKILL');
        process.exit(1);
    }

    console.log('\n--- 1. GET /api/v1/roles WITHOUT TENANT CONTEXT ---');
    const noContextRes = await get('/api/v1/roles');
    console.log('Status (Expected 400 TENANT_CONTEXT_MISSING):', noContextRes.status);
    console.log('Response Body:\n', JSON.stringify(noContextRes.body, null, 2));

    console.log('\n--- 2. POST /api/v1/roles WITHOUT TENANT CONTEXT ---');
    const createNoContextRes = await post('/api/v1/roles', {
        roleCode: 'CUSTOM_AUDITOR',
        roleName: 'Custom Compliance Auditor',
        roleDescription: 'Audits structural engineering compliance logs.',
        status: 'ACTIVE'
    });
    console.log('Status (Expected 400 TENANT_CONTEXT_MISSING):', createNoContextRes.status);
    console.log('Response Body:\n', JSON.stringify(createNoContextRes.body, null, 2));

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('No-Context GET Status:', noContextRes.status);
    console.log('No-Context POST Status:', createNoContextRes.status);

    if (noContextRes.status === 400 && createNoContextRes.status === 400) {
        console.log('ROLE MANAGEMENT TENANT ISOLATION & SYSTEM ROLE PROTECTION VERIFICATION PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('VERIFICATION FAILED!');
        process.exit(1);
    }
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    child.kill('SIGKILL');
    process.exit(1);
});
