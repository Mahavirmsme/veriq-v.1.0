const cp = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 8100;
const backendDir = path.join(__dirname, 'veriq-backend');

console.log(`=== STARTING BACKEND FOR PERMISSION MASTER VERIFICATION ON PORT ${PORT} ===`);
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

    console.log('\n--- 1. GET /api/v1/permissions ---');
    const allRes = await get('/api/v1/permissions');
    console.log('Status:', allRes.status);
    console.log('Total Permissions Count (Expected 37):', allRes.body.data ? allRes.body.data.length : 0);

    console.log('\n--- 2. GET /api/v1/permissions/code/user.read ---');
    const codeRes = await get('/api/v1/permissions/code/user.read');
    console.log('Status:', codeRes.status);
    console.log('Permission Data:\n', JSON.stringify(codeRes.body, null, 2));

    console.log('\n--- 3. GET /api/v1/permissions/category/USER_MGMT ---');
    const catRes = await get('/api/v1/permissions/category/USER_MGMT');
    console.log('Status:', catRes.status);
    console.log('USER_MGMT Count (Expected 5):', catRes.body.data ? catRes.body.data.length : 0);

    child.kill('SIGKILL');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('All Permissions Status:', allRes.status);
    console.log('Permissions Count:', allRes.body.data ? allRes.body.data.length : 0);
    console.log('By-Code Status:', codeRes.status);
    console.log('By-Category Status:', catRes.status);

    if (allRes.status === 200 && allRes.body.data.length === 37 && codeRes.status === 200 && catRes.status === 200) {
        console.log('\nPERMISSION MASTER GLOBAL READ-ONLY CATALOG VERIFICATION PASSED SUCCESSFULLY!');
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
