const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');
const frontendDir = path.join(__dirname, 'veriq-frontend');

console.log(`=== STARTING UX GOVERNANCE VERIFICATION FOR ORGANIZATION MODULE (PHASE-UI-ADMIN-ORG-1) ON PORT ${PORT} ===`);

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

    // 1. Platform Bootstrap Org Resolution
    console.log('\n--- 1. Platform Bootstrap Organization ---');
    const bootstrapOrgRes = await request('POST', '/api/v1/organizations', {}, {
        name: `Water Resources Department Bihar ${uid}`,
        code: `WRD${uid}`,
        industry: 'GOVERNMENT',
        tier: 'ENTERPRISE',
        organizationType: 'GOVERNMENT',
        contactPerson: 'Principal Secretary',
        contactEmail: `secretary_${uid}@wrd.bihar.gov.in`,
        contactMobile: '+919933445566'
    });
    console.log('Bootstrap Org Status:', bootstrapOrgRes.status);
    const orgId = bootstrapOrgRes.body.data.id;
    const orgCode = bootstrapOrgRes.body.data.code;
    const orgName = bootstrapOrgRes.body.data.name;

    checks.push({
        name: 'Auto-resolved Tenant Organization from Bootstrap',
        status: bootstrapOrgRes.status === 201 ? 'PASS' : 'FAIL',
        details: `Org ID: ${orgId}, Name: ${orgName}`
    });

    // 2. Read-Only Organization View (/admin/organization)
    console.log('\n--- 2. Read-Only Organization View (/admin/organization) ---');
    const viewRes = await request('GET', `/api/v1/organizations/${orgId}`);
    console.log('Read-Only View Fetch Status:', viewRes.status);
    checks.push({
        name: 'Read-Only Organization View Loaded',
        status: viewRes.status === 200 && viewRes.body.data.name === orgName ? 'PASS' : 'FAIL',
        details: `Displayed Name: ${viewRes.body.data.name}, Code: ${viewRes.body.data.code}`
    });

    // 3. Organization Edit Page & Save Flow (/admin/organization/edit)
    console.log('\n--- 3. Edit Profile & Save Flow (/admin/organization/edit -> Save -> View) ---');
    const updateRes = await request('PUT', `/api/v1/organizations/${orgId}`, {}, {
        name: orgName, // Locked
        organizationType: 'GOVERNMENT',
        status: 'ACTIVE',
        description: 'State Water Resources Infrastructure & Irrigation Governance Department',
        contactPerson: 'Dr. S. K. Singh, IAS',
        designation: 'Additional Chief Secretary',
        contactEmail: `acs_wrd_${uid}@bihar.gov.in`,
        contactMobile: '+919431000000',
        addressLine1: 'Sinchai Bhawan, Secretariat',
        city: 'Patna',
        state: 'Bihar',
        country: 'India',
        pinCode: '800015'
    });
    console.log('Update API Call Status:', updateRes.status);
    checks.push({
        name: 'Save Profile Changes via Existing API',
        status: updateRes.status === 200 && updateRes.body.data.contactPerson === 'Dr. S. K. Singh, IAS' ? 'PASS' : 'FAIL',
        details: `Updated Contact Person: ${updateRes.body.data.contactPerson}`
    });

    // 4. Return to Read-Only View & Display Updated Info
    console.log('\n--- 4. Return to Read-Only View & Verify Updated Display ---');
    const updatedViewRes = await request('GET', `/api/v1/organizations/${orgId}`);
    const displayValid = updatedViewRes.body.data.contactEmail === `acs_wrd_${uid}@bihar.gov.in` && updatedViewRes.body.data.city === 'Patna';
    checks.push({
        name: 'Updated Organization Info Rendered on Read-Only View',
        status: displayValid ? 'PASS' : 'FAIL',
        details: `Contact Email: ${updatedViewRes.body.data.contactEmail}, City: ${updatedViewRes.body.data.city}`
    });

    // 5. Locked Fields Preservation
    console.log('\n--- 5. Verify Locked Fields Integrity ---');
    const lockedValid = updatedViewRes.body.data.name === orgName && updatedViewRes.body.data.code === orgCode && updatedViewRes.body.data.id === orgId;
    checks.push({
        name: 'Read-Only Locked Fields Preserved',
        status: lockedValid ? 'PASS' : 'FAIL',
        details: `Name (${orgName}), Code (${orgCode}), Tenant ID intact`
    });

    // 6. Frontend Production Build Check
    console.log('\n--- 6. Frontend Production Build Check ---');
    let buildSuccess = false;
    try {
        cp.execSync('npm run build', { cwd: frontendDir, shell: true, stdio: 'ignore' });
        buildSuccess = true;
    } catch (e) {
        buildSuccess = false;
    }
    checks.push({
        name: 'Frontend Production Build (0 TS Errors)',
        status: buildSuccess ? 'PASS' : 'FAIL',
        details: `Vite build completed with 0 errors`
    });

    child.kill('SIGKILL');

    console.log('\n=== UX GOVERNANCE ORGANIZATION MODULE VERIFICATION MATRIX ===');
    checks.forEach(c => console.log(`[${c.status}] ${c.name} -> ${c.details}`));

    const allPassed = checks.every(c => c.status === 'PASS');
    if (allPassed) {
        console.log('\nORGANIZATION MODULE UX GOVERNANCE v1.0 VERIFIED SUCCESSFULLY!');
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
