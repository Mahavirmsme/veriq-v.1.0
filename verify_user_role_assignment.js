const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR USER-ROLE ASSIGNMENT VERIFICATION ON PORT ${PORT} ===`);
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

    const uid = Date.now().toString().slice(-5);
    console.log('\n--- 1. Provision Test Organization ---');
    const orgRes = await request('POST', '/api/v1/organizations', {}, {
        name: `UserRole Test Corp ${uid}`,
        code: `URC${uid}`,
        industry: 'CONSTRUCTION',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Bob Builder Admin',
        contactEmail: `urc${uid}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Org Status:', orgRes.status);
    const orgId = orgRes.body.data.id;
    const headers = { 'X-Tenant-Id': orgId };

    console.log('\n--- 2. Create User ---');
    const userRes = await request('POST', '/api/v1/users', headers, {
        firstName: 'Bob',
        lastName: 'Builder',
        email: `bob_${uid}@veriq.com`,
        passwordHash: 'hashed_pwd_99',
        status: 'ACTIVE'
    });
    console.log('User Status:', userRes.status);
    const userId = userRes.body.data.id;

    console.log('\n--- 3. Create Custom Roles ---');
    const role1Res = await request('POST', '/api/v1/roles', headers, {
        roleCode: `ROLE_BUILDER_${uid}`,
        roleName: `Builder Role ${uid}`,
        description: 'Construction manager role'
    });
    const role1Id = role1Res.body.data.id;

    const role2Res = await request('POST', '/api/v1/roles', headers, {
        roleCode: `ROLE_INSPECTOR_${uid}`,
        roleName: `Inspector Role ${uid}`,
        description: 'Quality inspector role'
    });
    const role2Id = role2Res.body.data.id;
    console.log('Roles Created:', role1Res.status, role2Res.status);

    console.log('\n--- 4. Assign Roles to User (POST /api/v1/users/{userId}/roles) ---');
    const assignRes = await request('POST', `/api/v1/users/${userId}/roles`, headers, {
        roleIds: [role1Id, role2Id]
    });
    console.log('Assign Roles Status (Expected 200):', assignRes.status);
    console.log('Assigned Roles Count:', assignRes.body.data.roles.length);

    console.log('\n--- 5. Get Roles Assigned to User (GET /api/v1/users/{userId}/roles) ---');
    const userRolesRes = await request('GET', `/api/v1/users/${userId}/roles`, headers);
    console.log('Get User Roles Status (Expected 200):', userRolesRes.status);
    console.log('Assigned Roles:', userRolesRes.body.data.roles.map(r => r.roleCode));

    console.log('\n--- 6. Get Users Assigned to Role (GET /api/v1/roles/{roleId}/users) ---');
    const roleUsersRes = await request('GET', `/api/v1/roles/${role1Id}/users`, headers);
    console.log('Get Role Users Status (Expected 200):', roleUsersRes.status);
    console.log('Assigned Users:', roleUsersRes.body.data.users.map(u => u.email));

    console.log('\n--- 7. Remove Single Role from User (DELETE /api/v1/users/{userId}/roles/{roleId}) ---');
    const removeRes = await request('DELETE', `/api/v1/users/${userId}/roles/${role2Id}`, headers);
    console.log('Remove Role Status (Expected 200):', removeRes.status);

    console.log('\n--- 8. Verify Remaining Roles for User ---');
    const postRemoveRes = await request('GET', `/api/v1/users/${userId}/roles`, headers);
    console.log('Remaining Roles Count (Expected 1):', postRemoveRes.body.data.roles.length);
    console.log('Remaining Role Code:', postRemoveRes.body.data.roles[0].roleCode);

    console.log('\n--- 9. Tenant Isolation Audit (Cross-tenant User Lookup -> Expected 404) ---');
    const otherHeaders = { 'X-Tenant-Id': '00000000-0000-0000-0000-000000000099' };
    const isolateRes = await request('GET', `/api/v1/users/${userId}/roles`, otherHeaders);
    console.log('Cross-tenant User Roles Access Status (Expected 404):', isolateRes.status);

    console.log('\n--- 10. Regression Check on Previous Modules ---');
    const regOrg = await request('GET', '/api/v1/organizations');
    const regUser = await request('GET', '/api/v1/users', headers);
    const regRole = await request('GET', '/api/v1/roles', headers);
    const regPerm = await request('GET', '/api/v1/permissions');
    console.log('Orgs API Status:', regOrg.status);
    console.log('Users API Status:', regUser.status);
    console.log('Roles API Status:', regRole.status);
    console.log('Permissions Catalog Count (Expected 37):', regPerm.body.data.length);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('Role Assignment Status:', assignRes.status);
    console.log('User Roles Listing Status:', userRolesRes.status);
    console.log('Role Users Listing Status:', roleUsersRes.status);
    console.log('Role Removal Status:', removeRes.status);
    console.log('Remaining Roles Count:', postRemoveRes.body.data.roles.length);
    console.log('Tenant Isolation Status:', isolateRes.status);
    console.log('Catalog Integrity Count:', regPerm.body.data.length);

    if (assignRes.status === 200 &&
        userRolesRes.body.data.roles.length === 2 &&
        removeRes.status === 200 &&
        postRemoveRes.body.data.roles.length === 1 &&
        isolateRes.status === 404 &&
        regPerm.body.data.length === 37) {
        console.log('\nPHASE-10 USER-ROLE ASSIGNMENT VERIFICATION PASSED SUCCESSFULLY!');
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
