const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR AUTHORIZATION GUARD VERIFICATION ON PORT ${PORT} ===`);
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
        name: `AuthGuard Corp Alpha ${uid1}`,
        code: `AG1${uid1}`,
        industry: 'FINTECH',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Admin Alpha',
        contactEmail: `alpha${uid1}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Org 1 Status:', org1Res.status);
    const org1Id = org1Res.body.data.id;

    const org2Res = await request('POST', '/api/v1/organizations', {}, {
        name: `AuthGuard Corp Beta ${uid2}`,
        code: `AG2${uid2}`,
        industry: 'HEALTHCARE',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Admin Beta',
        contactEmail: `beta${uid2}@veriq.com`,
        contactMobile: '+919876543211'
    });
    console.log('Org 2 Status:', org2Res.status);
    const org2Id = org2Res.body.data.id;

    const headersOrg1 = { 'X-Tenant-Id': org1Id };
    const headersOrg2 = { 'X-Tenant-Id': org2Id };

    console.log('\n--- 2. Provision Test User in Org 1 ---');
    const userRes = await request('POST', '/api/v1/users', headersOrg1, {
        firstName: 'Alice',
        lastName: 'Analyst',
        email: `alice_${uid1}@veriq.com`,
        passwordHash: 'secret_hash_12345',
        status: 'ACTIVE'
    });
    console.log('User Creation Status:', userRes.status);
    if (userRes.status !== 201) {
        console.error('User creation failed:', JSON.stringify(userRes.body, null, 2));
    }
    const aliceId = userRes.body.data.id;
    console.log('User ID:', aliceId);

    console.log('\n--- 3. Create Custom Role in Org 1 ---');
    const roleRes = await request('POST', '/api/v1/roles', headersOrg1, {
        roleCode: `ROLE_ANALYST_${uid1}`,
        roleName: `Analyst Role ${uid1}`,
        description: 'Read-only analyst role'
    });
    console.log('Role Creation Status:', roleRes.status);
    const roleId = roleRes.body.data.id;
    console.log('Role ID:', roleId);

    console.log('\n--- 4. Assign Role to User ---');
    const userRoleRes = await request('POST', '/api/v1/user-roles', headersOrg1, {
        userId: aliceId,
        roleId: roleId
    });
    console.log('User-Role Assignment Status:', userRoleRes.status);

    console.log('\n--- 5. Assign user.read Permission to Role ---');
    const rolePermRes = await request('POST', `/api/v1/roles/${roleId}/permissions`, headersOrg1, {
        permissionCodes: ['user.read']
    });
    console.log('Role-Permission Assignment Status:', rolePermRes.status);

    console.log('\n--- 6. Test Authorized Request (user.read) ---');
    const authHeaders = {
        'X-Tenant-Id': org1Id,
        'X-User-Id': aliceId
    };
    const grantedRes = await request('GET', '/api/v1/authorization/test/user-read', authHeaders);
    console.log('Authorized Request Status (Expected 200):', grantedRes.status);
    console.log('Authorized Request Body:', grantedRes.body);

    console.log('\n--- 7. Test Missing Permission Request (audit.read -> Expected 403) ---');
    const forbiddenRes = await request('GET', '/api/v1/authorization/test/audit-read', authHeaders);
    console.log('Missing Permission Request Status (Expected 403):', forbiddenRes.status);
    console.log('Missing Permission Error Message:', forbiddenRes.body.message);

    console.log('\n--- 8. Test Tenant Isolation (Same User, Org Beta Context -> Expected 403) ---');
    const crossTenantHeaders = {
        'X-Tenant-Id': org2Id,
        'X-User-Id': aliceId
    };
    const crossTenantRes = await request('GET', '/api/v1/authorization/test/user-read', crossTenantHeaders);
    console.log('Cross-tenant Request Status (Expected 403):', crossTenantRes.status);

    console.log('\n--- 9. Test Unauthenticated Request (Missing X-User-Id -> Expected 403) ---');
    const unauthHeaders = { 'X-Tenant-Id': org1Id };
    const unauthRes = await request('GET', '/api/v1/authorization/test/user-read', unauthHeaders);
    console.log('Unauthenticated Request Status (Expected 403):', unauthRes.status);

    console.log('\n--- 10. Regression Check on Previous Frozen Modules ---');
    const regOrg = await request('GET', '/api/v1/organizations');
    const regPerm = await request('GET', '/api/v1/permissions');
    const regRole = await request('GET', '/api/v1/roles', headersOrg1);
    console.log('Regression Check - Orgs API Status:', regOrg.status);
    console.log('Regression Check - Permissions API Status (37 catalog tokens):', regPerm.status, regPerm.body.data.length);
    console.log('Regression Check - Roles API Status:', regRole.status);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('1. Authorized Access (200 OK):', grantedRes.status);
    console.log('2. Missing Permission Blocked (403 Forbidden):', forbiddenRes.status);
    console.log('3. Cross-Tenant Request Blocked (403 Forbidden):', crossTenantRes.status);
    console.log('4. Unauthenticated Request Blocked (403 Forbidden):', unauthRes.status);
    console.log('5. Catalog Integrity (37 Tokens):', regPerm.body.data.length);

    if (grantedRes.status === 200 &&
        forbiddenRes.status === 403 &&
        crossTenantRes.status === 403 &&
        unauthRes.status === 403 &&
        regPerm.body.data.length === 37) {
        console.log('\nPHASE-9 AUTHORIZATION GUARD VERIFICATION PASSED SUCCESSFULLY!');
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
