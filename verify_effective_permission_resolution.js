const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR EFFECTIVE PERMISSION RESOLUTION VERIFICATION ON PORT ${PORT} ===`);
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
        name: `EffPerm Corp Alpha ${uid1}`,
        code: `EP1${uid1}`,
        industry: 'SOFTWARE',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Charlie Lead',
        contactEmail: `charlie${uid1}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Org 1 Status:', org1Res.status);
    const org1Id = org1Res.body.data.id;

    const org2Res = await request('POST', '/api/v1/organizations', {}, {
        name: `EffPerm Corp Beta ${uid2}`,
        code: `EP2${uid2}`,
        industry: 'FINTECH',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Other Admin',
        contactEmail: `other${uid2}@veriq.com`,
        contactMobile: '+919876543211'
    });
    console.log('Org 2 Status:', org2Res.status);
    const org2Id = org2Res.body.data.id;

    const headersOrg1 = { 'X-Tenant-Id': org1Id };
    const headersOrg2 = { 'X-Tenant-Id': org2Id };

    console.log('\n--- 2. Create User Charlie ---');
    const userRes = await request('POST', '/api/v1/users', headersOrg1, {
        firstName: 'Charlie',
        lastName: 'Dev',
        email: `charlie_${uid1}@veriq.com`,
        passwordHash: 'charlie_pwd_123',
        status: 'ACTIVE'
    });
    console.log('User Status:', userRes.status);
    const charlieId = userRes.body.data.id;

    console.log('\n--- 3. Create Developer & Tester Roles ---');
    const roleDevRes = await request('POST', '/api/v1/roles', headersOrg1, {
        roleCode: `ROLE_DEV_${uid1}`,
        roleName: `Developer Role ${uid1}`,
        description: 'Developer role with user.read and audit.read'
    });
    const roleDevId = roleDevRes.body.data.id;

    const roleTestRes = await request('POST', '/api/v1/roles', headersOrg1, {
        roleCode: `ROLE_TEST_${uid1}`,
        roleName: `Tester Role ${uid1}`,
        description: 'Tester role with user.read and analytics.read'
    });
    const roleTestId = roleTestRes.body.data.id;

    console.log('\n--- 4. Assign Canonical Catalog Permissions to Roles (Overlapping user.read) ---');
    await request('POST', `/api/v1/roles/${roleDevId}/permissions`, headersOrg1, {
        permissionCodes: ['user.read', 'audit.read']
    });
    await request('POST', `/api/v1/roles/${roleTestId}/permissions`, headersOrg1, {
        permissionCodes: ['user.read', 'analytics.read']
    });

    console.log('\n--- 5. Assign Both Roles to User Charlie ---');
    await request('POST', `/api/v1/users/${charlieId}/roles`, headersOrg1, {
        roleIds: [roleDevId, roleTestId]
    });

    console.log('\n--- 6. Test GET /api/v1/users/{userId}/effective-permissions ---');
    const effPermRes = await request('GET', `/api/v1/users/${charlieId}/effective-permissions`, headersOrg1);
    console.log('Effective Permissions Status (Expected 200):', effPermRes.status);
    console.log('User Email:', effPermRes.body.data.userEmail);
    console.log('Assigned Roles:', effPermRes.body.data.assignedRoleCodes);
    console.log('Effective Permissions (Unique, Sorted):', effPermRes.body.data.effectivePermissions);
    console.log('Total Effective Permissions (Expected 3):', effPermRes.body.data.totalEffectivePermissions);

    console.log('\n--- 7. Test GET /api/v1/users/me/effective-permissions ---');
    const meHeaders = {
        'X-Tenant-Id': org1Id,
        'X-User-Id': charlieId
    };
    const meEffPermRes = await request('GET', '/api/v1/users/me/effective-permissions', meHeaders);
    console.log('Current User Effective Perms Status (Expected 200):', meEffPermRes.status);
    console.log('Current User Effective Perms Count:', meEffPermRes.body.data.totalEffectivePermissions);

    console.log('\n--- 8. Test Unauthenticated /me/effective-permissions (Expected 403) ---');
    const unauthMeRes = await request('GET', '/api/v1/users/me/effective-permissions', headersOrg1);
    console.log('Unauthenticated /me Request Status (Expected 403):', unauthMeRes.status);

    console.log('\n--- 9. Test Tenant Isolation Audit (Cross-tenant User Effective Perms -> Expected 404) ---');
    const crossTenantRes = await request('GET', `/api/v1/users/${charlieId}/effective-permissions`, headersOrg2);
    console.log('Cross-tenant Effective Perms Access Status (Expected 404):', crossTenantRes.status);

    console.log('\n--- 10. Regression Check on Previous Modules ---');
    const regOrg = await request('GET', '/api/v1/organizations');
    const regUser = await request('GET', '/api/v1/users', headersOrg1);
    const regRole = await request('GET', '/api/v1/roles', headersOrg1);
    const regPerm = await request('GET', '/api/v1/permissions');
    const regUserRole = await request('GET', `/api/v1/users/${charlieId}/roles`, headersOrg1);
    const regRolePerm = await request('GET', `/api/v1/roles/${roleDevId}/permissions`, headersOrg1);
    console.log('Orgs API Status:', regOrg.status);
    console.log('Users API Status:', regUser.status);
    console.log('Roles API Status:', regRole.status);
    console.log('Permissions Catalog Count (Expected 37):', regPerm.body.data.length);
    console.log('User Roles API Status:', regUserRole.status);
    console.log('Role Permissions API Status:', regRolePerm.status);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('1. User Effective Perms Status:', effPermRes.status);
    console.log('2. Deduplicated Permission Count (Expected 3):', effPermRes.body.data.totalEffectivePermissions);
    console.log('3. Current User (/me) Status:', meEffPermRes.status);
    console.log('4. Unauthenticated (/me) Blocked:', unauthMeRes.status);
    console.log('5. Tenant Isolation Status:', crossTenantRes.status);
    console.log('6. Catalog Integrity Count (Expected 37):', regPerm.body.data.length);

    if (effPermRes.status === 200 &&
        effPermRes.body.data.totalEffectivePermissions === 3 &&
        meEffPermRes.status === 200 &&
        unauthMeRes.status === 403 &&
        crossTenantRes.status === 404 &&
        regPerm.body.data.length === 37) {
        console.log('\nPHASE-11 EFFECTIVE PERMISSION RESOLUTION VERIFICATION PASSED SUCCESSFULLY!');
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
