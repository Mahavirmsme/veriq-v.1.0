const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR AUDIT LOGGING VERIFICATION ON PORT ${PORT} ===`);
const mvnw = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';
const child = cp.spawn(mvnw, [
    'spring-boot:run',
    '-Dspring-boot.run.profiles=eval',
    `-Dspring-boot.run.arguments=--server.port=${PORT}`
], {
    cwd: backendDir,
    env: process.env,
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe']
});

let outputLog = '';
child.stdout.on('data', (d) => { outputLog += d.toString(); });
child.stderr.on('data', (d) => { outputLog += d.toString(); });

function request(method, urlPath, headers = {}, bodyData = null) {
    return new Promise((resolve, reject) => {
        const url = `http://localhost:${PORT}${urlPath}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let parsed = null;
                try { parsed = JSON.parse(body); } catch (e) { parsed = body; }
                resolve({ status: res.statusCode, body: parsed });
            });
        });
        req.on('error', reject);
        if (bodyData) {
            req.write(JSON.stringify(bodyData));
        }
        req.end();
    });
}

async function runVerification() {
    let started = false;
    for (let i = 0; i < 45; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (outputLog.includes('Started VeriqApplication')) {
            started = true;
            break;
        }
    }

    if (!started) {
        console.error('Server startup failed. Log:\n', outputLog);
        child.kill('SIGKILL');
        process.exit(1);
    }

    const uid1 = Date.now().toString().slice(-5);
    const uid2 = (Date.now() + 1).toString().slice(-5);

    console.log('\n--- 1. Provision Test Organizations ---');
    const org1Res = await request('POST', '/api/v1/organizations', {}, {
        name: `Audit Corp Alpha ${uid1}`,
        code: `AUD1${uid1}`,
        industry: 'FINANCE',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Audit Officer',
        contactEmail: `officer${uid1}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Org 1 Status:', org1Res.status);
    const org1Id = org1Res.body.data.id;

    const org2Res = await request('POST', '/api/v1/organizations', {}, {
        name: `Audit Corp Beta ${uid2}`,
        code: `AUD2${uid2}`,
        industry: 'RETAIL',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Beta Officer',
        contactEmail: `officer${uid2}@veriq.com`,
        contactMobile: '+919876543211'
    });
    console.log('Org 2 Status:', org2Res.status);
    const org2Id = org2Res.body.data.id;

    const headersOrg1 = { 'X-Tenant-Id': org1Id };
    const headersOrg2 = { 'X-Tenant-Id': org2Id };

    console.log('\n--- 2. Create User in Org 1 ---');
    const userRes = await request('POST', '/api/v1/users', headersOrg1, {
        firstName: 'Dave',
        lastName: 'Auditor',
        email: `dave_${uid1}@veriq.com`,
        passwordHash: 'auditor_pwd_123',
        status: 'ACTIVE'
    });
    console.log('User Status:', userRes.status);
    const daveId = userRes.body.data.id;

    console.log('\n--- 3. Publish Audit Events for Org 1 ---');
    const log1Res = await request('POST', '/api/v1/audit-logs/test/publish', headersOrg1, {
        userId: daveId,
        organizationId: org1Id,
        action: 'USER_LOGIN',
        resourceType: 'USER',
        resourceId: daveId,
        result: 'SUCCESS',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Chrome/120.0',
        details: 'User Dave logged in successfully'
    });
    console.log('Publish Log 1 Status (Expected 201):', log1Res.status);
    const auditLogId = log1Res.body.data.id;

    const log2Res = await request('POST', '/api/v1/audit-logs/test/publish', headersOrg1, {
        userId: daveId,
        organizationId: org1Id,
        action: 'ROLE_ASSIGN',
        resourceType: 'ROLE',
        resourceId: 'role-12345',
        result: 'SUCCESS',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Chrome/120.0',
        details: 'Assigned ANALYST role to Dave'
    });
    console.log('Publish Log 2 Status (Expected 201):', log2Res.status);

    console.log('\n--- 4. Query All Audit Logs (GET /api/v1/audit-logs) ---');
    const allLogsRes = await request('GET', '/api/v1/audit-logs', headersOrg1);
    console.log('Get All Audit Logs Status (Expected 200):', allLogsRes.status);
    console.log('Total Audit Logs in Org 1 (Expected > 0):', allLogsRes.body.data.length);

    console.log('\n--- 5. Query Single Audit Log by ID (GET /api/v1/audit-logs/{id}) ---');
    const singleLogRes = await request('GET', `/api/v1/audit-logs/${auditLogId}`, headersOrg1);
    console.log('Get Single Audit Log Status (Expected 200):', singleLogRes.status);
    console.log('Audit Log Action:', singleLogRes.body.data.action);

    console.log('\n--- 6. Query Audit Logs by User (GET /api/v1/audit-logs/user/{userId}) ---');
    const userLogsRes = await request('GET', `/api/v1/audit-logs/user/${daveId}`, headersOrg1);
    console.log('Get Audit Logs by User Status (Expected 200):', userLogsRes.status);
    console.log('User Audit Logs Count:', userLogsRes.body.data.length);

    console.log('\n--- 7. Query Audit Logs by Resource (GET /api/v1/audit-logs/resource/{type}/{id}) ---');
    const resourceLogsRes = await request('GET', `/api/v1/audit-logs/resource/USER/${daveId}`, headersOrg1);
    console.log('Get Resource Audit Logs Status (Expected 200):', resourceLogsRes.status);
    console.log('Resource Audit Logs Count:', resourceLogsRes.body.data.length);

    console.log('\n--- 8. Tenant Isolation Audit (Query Org 2 Logs -> Expected 0 records for Org 1 user) ---');
    const org2LogsRes = await request('GET', '/api/v1/audit-logs', headersOrg2);
    console.log('Get Org 2 Audit Logs Status (Expected 200):', org2LogsRes.status);
    console.log('Total Audit Logs in Org 2 (Expected 0):', org2LogsRes.body.data.length);

    console.log('\n--- 9. Regression Check on Previous Modules ---');
    const regOrg = await request('GET', '/api/v1/organizations');
    const regUser = await request('GET', '/api/v1/users', headersOrg1);
    const regRole = await request('GET', '/api/v1/roles', headersOrg1);
    const regPerm = await request('GET', '/api/v1/permissions');
    const regEffPerm = await request('GET', `/api/v1/users/${daveId}/effective-permissions`, headersOrg1);
    console.log('Orgs API Status:', regOrg.status);
    console.log('Users API Status:', regUser.status);
    console.log('Roles API Status:', regRole.status);
    console.log('Permissions Catalog Count (Expected 37):', regPerm.body.data.length);
    console.log('Effective Permissions API Status:', regEffPerm.status);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('1. Audit Log Creation Status:', log1Res.status);
    console.log('2. All Audit Logs Endpoint Status:', allLogsRes.status);
    console.log('3. Single Audit Log Endpoint Status:', singleLogRes.status);
    console.log('4. Audit Logs by User Status:', userLogsRes.status);
    console.log('5. Audit Logs by Resource Status:', resourceLogsRes.status);
    console.log('6. Tenant Isolation Count (Org 2 = 0):', org2LogsRes.body.data.length);
    console.log('7. Catalog Integrity Count (Expected 37):', regPerm.body.data.length);

    if (log1Res.status === 201 &&
        allLogsRes.status === 200 &&
        allLogsRes.body.data.length >= 2 &&
        singleLogRes.status === 200 &&
        userLogsRes.status === 200 &&
        resourceLogsRes.status === 200 &&
        org2LogsRes.status === 200 &&
        org2LogsRes.body.data.length === 0 &&
        regPerm.body.data.length === 37) {
        console.log('\nPHASE-12 AUDIT LOGGING VERIFICATION PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('\nVERIFICATION FAILED!');
        process.exit(1);
    }
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    child.kill('SIGKILL');
    process.exit(1);
});
