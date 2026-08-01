const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR FRONTEND INTEGRATION VERIFICATION ON PORT ${PORT} ===`);
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
    const results = [];

    console.log('\n--- 1. Organization Context Integration ---');
    const orgRes = await request('POST', '/api/v1/organizations', {}, {
        name: `FE Test Corp ${uid}`,
        code: `FE${uid}`,
        industry: 'SOFTWARE',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'FE Lead',
        contactEmail: `fe${uid}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Create Organization Status:', orgRes.status);
    const orgId = orgRes.body.data.id;
    const headers = { 'X-Tenant-Id': orgId };

    const getOrgsRes = await request('GET', '/api/v1/organizations');
    console.log('Get Organizations Status:', getOrgsRes.status);
    results.push({ module: 'Organization Context', status: getOrgsRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 2. User Management Integration ---');
    const userRes = await request('POST', '/api/v1/users', headers, {
        firstName: 'Frontend',
        lastName: 'User',
        email: `fe_user_${uid}@veriq.com`,
        passwordHash: 'fe_pwd_123',
        status: 'ACTIVE'
    });
    console.log('Create User Status:', userRes.status);
    const userId = userRes.body.data.id;

    const getUsersRes = await request('GET', '/api/v1/users', headers);
    console.log('Get Users Status:', getUsersRes.status);
    results.push({ module: 'User Management', status: getUsersRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 3. Authentication Integration ---');
    const loginRes = await request('POST', '/api/v1/auth/login', {}, { username: `fe_user_${uid}@veriq.com`, password: 'fe_pwd_123' });
    console.log('Login Endpoint Status (Expected 200):', loginRes.status);
    results.push({ module: 'Authentication', status: loginRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 4. Department Management Integration ---');
    const deptRes = await request('POST', '/api/v1/departments', headers, {
        code: `DEP_${uid}`,
        name: `Engineering ${uid}`,
        status: 'ACTIVE'
    });
    console.log('Create Department Status:', deptRes.status);

    const getDeptsRes = await request('GET', '/api/v1/departments', headers);
    console.log('Get Departments Status:', getDeptsRes.status);
    results.push({ module: 'Department Management', status: getDeptsRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 5. Designation Management Integration ---');
    const desgRes = await request('POST', '/api/v1/designations', headers, {
        code: `DSG_${uid}`,
        title: `Architect ${uid}`,
        status: 'ACTIVE'
    });
    console.log('Create Designation Status:', desgRes.status);

    const getDesgsRes = await request('GET', '/api/v1/designations', headers);
    console.log('Get Designations Status:', getDesgsRes.status);
    results.push({ module: 'Designation Management', status: getDesgsRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 6. Role Management Integration ---');
    const roleRes = await request('POST', '/api/v1/roles', headers, {
        roleCode: `ROLE_FE_${uid}`,
        roleName: `Frontend Role ${uid}`,
        description: 'FE Role'
    });
    console.log('Create Role Status:', roleRes.status);
    const roleId = roleRes.body.data.id;

    const getRolesRes = await request('GET', '/api/v1/roles', headers);
    console.log('Get Roles Status:', getRolesRes.status);
    results.push({ module: 'Role Management', status: getRolesRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 7. Permission Catalog Integration ---');
    const permsRes = await request('GET', '/api/v1/permissions');
    console.log('Permission Catalog Status:', permsRes.status, 'Count:', permsRes.body.data.length);
    results.push({ module: 'Permission Catalog (37 Tokens)', status: permsRes.status === 200 && permsRes.body.data.length === 37 ? 'PASS' : 'FAIL' });

    console.log('\n--- 8. Role-Permission Assignment Integration ---');
    const assignRolePermRes = await request('POST', `/api/v1/roles/${roleId}/permissions`, headers, {
        permissionCodes: ['user.read', 'analytics.read']
    });
    console.log('Assign Role Permissions Status:', assignRolePermRes.status);
    results.push({ module: 'Role-Permission Assignment', status: assignRolePermRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 9. User-Role Assignment Integration ---');
    const assignUserRoleRes = await request('POST', `/api/v1/users/${userId}/roles`, headers, {
        roleIds: [roleId]
    });
    console.log('Assign User Roles Status:', assignUserRoleRes.status);
    results.push({ module: 'User-Role Assignment', status: assignUserRoleRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 10. Effective Permission Resolution Integration ---');
    const effPermRes = await request('GET', `/api/v1/users/${userId}/effective-permissions`, headers);
    console.log('Effective Permissions Status:', effPermRes.status, 'Permissions:', effPermRes.body.data.effectivePermissions);
    results.push({ module: 'Effective Permission Resolution', status: effPermRes.status === 200 ? 'PASS' : 'FAIL' });

    console.log('\n--- 11. Audit Logs Integration ---');
    const auditLogsRes = await request('GET', '/api/v1/audit-logs', headers);
    console.log('Audit Logs Status:', auditLogsRes.status);
    results.push({ module: 'Audit Logs', status: auditLogsRes.status === 200 ? 'PASS' : 'FAIL' });

    child.kill('SIGKILL');

    console.log('\n=== FRONTEND INTEGRATION MATRIX SUMMARY ===');
    results.forEach(r => console.log(`✓ ${r.module}: ${r.status}`));

    const allPassed = results.every(r => r.status === 'PASS');
    if (allPassed) {
        console.log('\nALL 11 FRONTEND INTEGRATION MODULES VERIFIED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('\nFRONTEND INTEGRATION VERIFICATION FAILED!');
        process.exit(1);
    }
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    child.kill('SIGKILL');
    process.exit(1);
});
