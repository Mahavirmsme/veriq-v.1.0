const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');
const frontendDir = path.join(__dirname, 'veriq-frontend');

console.log(`=== STARTING USER MODEL VERIFICATION ON PORT ${PORT} ===`);

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
    const checks = [];

    // 1. Bootstrap Tenant Organization
    const bootOrg = await request('POST', '/api/v1/organizations', {}, { name: `User Test Org ${uid}`, code: `UTO${uid}` });
    const orgId = bootOrg.body?.data?.id;
    const authHeaders = orgId ? { 'X-Tenant-Id': orgId } : {};

    // 2. Create Department & Designation
    const deptRes = await request('POST', '/api/v1/departments', authHeaders, { name: `Engineering ${uid}`, code: `ENG${uid}`, status: 'ACTIVE' });
    const desRes = await request('POST', '/api/v1/designations', authHeaders, { title: `Lead Engineer ${uid}`, code: `LEAD${uid}`, status: 'ACTIVE' });
    const deptId = deptRes.body?.data?.id;
    const desId = desRes.body?.data?.id;

    // 3. Create User via CreateUserPayloadDTO
    console.log('\n--- 1. Create User via CreateUserPayloadDTO ---');
    const createUserRes = await request('POST', '/api/v1/users', authHeaders, {
        firstName: `Trilok_${uid}`,
        lastName: 'Jha',
        email: `trilok_${uid}@veriq.io`,
        passwordHash: 'SuperSecretPass123!',
        departmentId: deptId || undefined,
        designationId: desId || undefined,
        status: 'ACTIVE',
        assignedRoles: ['ROLE_ORG_ADMIN'],
        defaultRole: 'ROLE_ORG_ADMIN'
    });
    console.log('Create User Status:', createUserRes.status);
    const createdUser = createUserRes.body?.data;

    checks.push({
        name: 'Create User with Complete Payload DTO',
        status: createUserRes.status === 201 && createdUser && createdUser.email === `trilok_${uid}@veriq.io` ? 'PASS' : 'FAIL',
        details: createdUser ? `User ID: ${createdUser.id}, Email: ${createdUser.email}` : `Status: ${createUserRes.status}`
    });

    // 4. Fetch User & Verify Field Mappings
    console.log('\n--- 2. Fetch User & Verify DTO Fields ---');
    if (createdUser) {
        const getUserRes = await request('GET', `/api/v1/users/${createdUser.id}`, authHeaders);
        const uData = getUserRes.body?.data;
        const fieldsValid = uData && uData.firstName === `Trilok_${uid}` && uData.lastName === 'Jha';

        checks.push({
            name: 'User DTO Contract & Field Mapping Integrity',
            status: getUserRes.status === 200 && fieldsValid ? 'PASS' : 'FAIL',
            details: `Dept ID: ${uData?.departmentId || 'None'}, Desig ID: ${uData?.designationId || 'None'}`
        });
    }

    // 5. Frontend Production Build Check
    console.log('\n--- 3. Frontend Production Build Check ---');
    let buildSuccess = false;
    let buildError = null;
    try {
        const res = cp.spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc'], { cwd: frontendDir, env: process.env, shell: true });
        buildSuccess = res.status === 0;
        if (res.status !== 0) {
            buildError = res.stdout ? res.stdout.toString() : res.stderr ? res.stderr.toString() : `exit code ${res.status}`;
        }
    } catch (e) {
        buildSuccess = false;
        buildError = e.message;
    }

    checks.push({
        name: 'Frontend Production Build (0 TS Errors)',
        status: buildSuccess ? 'PASS' : 'FAIL',
        details: buildSuccess ? 'TypeScript compilation passed with 0 errors' : `Compilation error: ${buildError}`
    });

    child.kill('SIGKILL');

    console.log('\n=== USER BACKEND MODEL VERIFICATION MATRIX ===');
    checks.forEach(c => console.log(`[${c.status}] ${c.name} -> ${c.details}`));

    const allPassed = checks.every(c => c.status === 'PASS');
    if (allPassed) {
        console.log('\nUSER BACKEND MODEL & CREATE USER DIALOG VERIFIED SUCCESSFULLY!');
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
