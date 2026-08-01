const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');
const frontendDir = path.join(__dirname, 'veriq-frontend');

console.log(`=== STARTING VERIFICATION FOR ADMIN ORGANIZATION PROFILE (PHASE-UI-ADMIN-ORG-1) ON PORT ${PORT} ===`);

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

    // 1. Platform Bootstrap Org Creation
    console.log('\n--- 1. Platform Bootstrap Organization ---');
    const bootstrapOrgRes = await request('POST', '/api/v1/organizations', {}, {
        name: `Veriq Enterprise Corp ${uid}`,
        code: `VEC${uid}`,
        industry: 'SOFTWARE',
        tier: 'ENTERPRISE',
        organizationType: 'ENTERPRISE',
        contactPerson: 'Platform Bootstrap Admin',
        contactEmail: `admin_${uid}@vec.com`,
        contactMobile: '+919988776655'
    });
    console.log('Bootstrap Org Status:', bootstrapOrgRes.status);
    const orgId = bootstrapOrgRes.body.data.id;
    const orgCode = bootstrapOrgRes.body.data.code;
    const orgName = bootstrapOrgRes.body.data.name;

    checks.push({
        name: 'Platform Bootstrap Org Available',
        status: bootstrapOrgRes.status === 201 ? 'PASS' : 'FAIL',
        details: `Created Org ID: ${orgId}`
    });

    // 2. Load Organization Profile via Tenant Context
    console.log('\n--- 2. Load Organization Profile (Automatic Tenant Resolution) ---');
    const profileRes = await request('GET', `/api/v1/organizations/${orgId}`);
    console.log('Fetch Profile Status:', profileRes.status);
    checks.push({
        name: 'Auto-load Organization Profile',
        status: profileRes.status === 200 && profileRes.body.data.name === orgName ? 'PASS' : 'FAIL',
        details: `Loaded Org Name: ${profileRes.body.data.name}`
    });

    // 3. Save Organization Profile Changes
    console.log('\n--- 3. Update Organization Profile Information ---');
    const updateRes = await request('PUT', `/api/v1/organizations/${orgId}`, {}, {
        name: orgName, // Preserve locked name
        organizationType: 'GOVERNMENT',
        status: 'ACTIVE',
        description: 'Updated Enterprise Profile Scope',
        contactPerson: 'Lead Administrator Updated',
        designation: 'VP of Technology',
        contactEmail: `updated_${uid}@vec.com`,
        contactMobile: '+919876500000',
        city: 'Metropolis',
        state: 'State Zero',
        country: 'India',
        pinCode: '500001'
    });
    console.log('Save Profile Status:', updateRes.status);
    checks.push({
        name: 'Save Profile Changes (Approved Editable Fields)',
        status: updateRes.status === 200 && updateRes.body.data.contactPerson === 'Lead Administrator Updated' ? 'PASS' : 'FAIL',
        details: `Updated Contact Email: ${updateRes.body.data.contactEmail}`
    });

    // 4. Verify Locked Fields Integrity
    console.log('\n--- 4. Verify Locked Fields (Name, Code, ID) ---');
    const verifyLockedRes = await request('GET', `/api/v1/organizations/${orgId}`);
    const lockedValid = verifyLockedRes.body.data.name === orgName && verifyLockedRes.body.data.code === orgCode && verifyLockedRes.body.data.id === orgId;
    checks.push({
        name: 'Locked Fields Preserved (Name, Code, ID)',
        status: lockedValid ? 'PASS' : 'FAIL',
        details: `Org Name (${orgName}) and Code (${orgCode}) intact`
    });

    // 5. Frontend Build Verification
    console.log('\n--- 5. Frontend Production Build Check ---');
    let buildSuccess = false;
    try {
        const res = cp.spawnSync('npm', ['run', 'build'], { cwd: frontendDir, shell: true, encoding: 'utf-8' });
        if (res.status === 0) {
            buildSuccess = true;
        } else {
            console.error('Build output error:', res.stderr || res.stdout);
            buildSuccess = false;
        }
    } catch (e) {
        console.error('Build exec error:', e);
        buildSuccess = false;
    }
    checks.push({
        name: 'Frontend Build (0 TS Errors)',
        status: buildSuccess ? 'PASS' : 'FAIL',
        details: `Vite production bundle compiled cleanly`
    });

    child.kill('SIGKILL');

    console.log('\n=== ORGANIZATION PROFILE VERIFICATION MATRIX ===');
    checks.forEach(c => console.log(`[${c.status}] ${c.name} -> ${c.details}`));

    const allPassed = checks.every(c => c.status === 'PASS');
    if (allPassed) {
        console.log('\nPHASE-UI-ADMIN-ORG-1 VERIFIED SUCCESSFULLY!');
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
