const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR ROLE-PERMISSION MAPPING VERIFICATION ON PORT ${PORT} ===`);
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

    const uniqueId = Date.now().toString().slice(-5);
    console.log('\n--- 1. Provision Test Organization ---');
    const orgRes = await request('POST', '/api/v1/organizations', {}, {
        name: `RolePermission Test Corp ${uniqueId}`,
        code: `RPM${uniqueId}`,
        industry: 'FINTECH',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Test Admin',
        contactEmail: `rpmc${uniqueId}@veriq.com`,
        contactMobile: '+919876543210'
    });
    console.log('Org Status:', orgRes.status);
    if (orgRes.status !== 201) {
        console.error('Org creation failed:', JSON.stringify(orgRes.body, null, 2));
    }
    const orgId = orgRes.body.data.id;
    console.log('Org ID:', orgId);

    const headers = { 'X-Tenant-Id': orgId };

    console.log('\n--- 2. Create Custom Role ---');
    const roleRes = await request('POST', '/api/v1/roles', headers, {
        roleCode: `SEC_AUDITOR_${uniqueId}`,
        roleName: `Security Auditor ${uniqueId}`,
        description: 'Audits platform security logs and access'
    });
    console.log('Role Status:', roleRes.status);
    if (roleRes.status !== 201) {
        console.error('Role creation failed:', JSON.stringify(roleRes.body, null, 2));
    }
    const roleId = roleRes.body.data.id;
    console.log('Role ID:', roleId);

    console.log('\n--- 3. Fetch Global Permissions ---');
    const permRes = await request('GET', '/api/v1/permissions');
    console.log('Permissions Status:', permRes.status);
    const permissions = permRes.body.data;
    console.log('Total Permissions in Catalog:', permissions.length);

    const userReadPerm = permissions.find(p => p.permissionCode === 'user.read');
    const auditReadPerm = permissions.find(p => p.permissionCode === 'audit.read');

    console.log('\n--- 4. Assign Permissions to Role (POST /api/v1/roles/{roleId}/permissions) ---');
    const assignRes = await request('POST', `/api/v1/roles/${roleId}/permissions`, headers, {
        permissionIds: [userReadPerm.id, auditReadPerm.id]
    });
    console.log('Assign Status:', assignRes.status);
    console.log('Assigned Permissions Count:', assignRes.body.data.permissions.length);

    console.log('\n--- 5. Get Permissions for Role (GET /api/v1/roles/{roleId}/permissions) ---');
    const rolePermsRes = await request('GET', `/api/v1/roles/${roleId}/permissions`, headers);
    console.log('Get Role Perms Status:', rolePermsRes.status);
    console.log('Permissions for Role:', rolePermsRes.body.data.permissions.map(p => p.permissionCode));

    console.log('\n--- 6. Get Roles containing Permission (GET /api/v1/permissions/{permissionId}/roles) ---');
    const permRolesRes = await request('GET', `/api/v1/permissions/${auditReadPerm.id}/roles`, headers);
    console.log('Get Perm Roles Status:', permRolesRes.status);
    console.log('Roles for audit.read:', permRolesRes.body.data.roles.map(r => r.roleCode));

    console.log('\n--- 7. Remove Single Permission from Role (DELETE /api/v1/roles/{roleId}/permissions/{permissionId}) ---');
    const removeRes = await request('DELETE', `/api/v1/roles/${roleId}/permissions/${auditReadPerm.id}`, headers);
    console.log('Remove Status:', removeRes.status);

    console.log('\n--- 8. Verify Remaining Permissions for Role ---');
    const postRemoveRes = await request('GET', `/api/v1/roles/${roleId}/permissions`, headers);
    console.log('Post-Remove Permissions Count (Expected 1):', postRemoveRes.body.data.permissions.length);
    console.log('Remaining Permission:', postRemoveRes.body.data.permissions[0].permissionCode);

    console.log('\n--- 9. System Role Protection Audit ---');
    const systemRolesRes = await request('GET', '/api/v1/roles', headers);
    const systemAdminRole = systemRolesRes.body.data.find(r => r.isSystemRole && r.roleCode === 'SYSTEM_ADMIN');

    if (systemAdminRole) {
        console.log('Testing assignment to System Role:', systemAdminRole.roleCode);
        const sysAssignRes = await request('POST', `/api/v1/roles/${systemAdminRole.id}/permissions`, headers, {
            permissionIds: [auditReadPerm.id]
        });
        console.log('System Role Assign Status (Expected 400):', sysAssignRes.status);
        console.log('Error Message:', sysAssignRes.body.message);
    }

    console.log('\n--- 10. Tenant Isolation Audit ---');
    const otherHeaders = { 'X-Tenant-Id': '00000000-0000-0000-0000-000000000099' };
    const isolateRes = await request('GET', `/api/v1/roles/${roleId}/permissions`, otherHeaders);
    console.log('Cross-tenant Role Access Status (Expected 404):', isolateRes.status);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('Org Provisioning Status:', orgRes.status);
    console.log('Custom Role Creation Status:', roleRes.status);
    console.log('Permission Assignment Status:', assignRes.status);
    console.log('Role Permissions Listing Status:', rolePermsRes.status);
    console.log('Permission Roles Listing Status:', permRolesRes.status);
    console.log('Permission Removal Status:', removeRes.status);
    console.log('Remaining Count:', postRemoveRes.body.data.permissions.length);
    console.log('Tenant Isolation Status:', isolateRes.status);

    if (assignRes.status === 200 && rolePermsRes.body.data.permissions.length === 2 &&
        removeRes.status === 200 && postRemoveRes.body.data.permissions.length === 1 && isolateRes.status === 404) {
        console.log('\nPHASE-8 ROLE-PERMISSION MAPPING VERIFICATION PASSED SUCCESSFULLY!');
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
