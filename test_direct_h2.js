const cp = require('child_process');
const fs = require('fs');
const path = require('path');

function killJava() {
    try {
        cp.execSync('powershell -Command "Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"');
    } catch (e) {}
}

async function testDirectH2() {
    killJava();
    await new Promise(r => setTimeout(r, 1000));

    const scratchDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\veriq';
    const testDir = path.join(scratchDir, 'direct_h2_test');

    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });

    const javaExe = path.join(scratchDir, 'jre', 'bin', 'java.exe');
    const jarPath = path.join(scratchDir, 'veriq-backend', 'target', 'veriq-backend-1.0.0-SNAPSHOT.jar');

    let consoleOutput = '';
    const proc = cp.spawn(javaExe, ['-jar', jarPath, '--spring.profiles.active=eval'], {
        cwd: testDir
    });

    proc.stdout.on('data', d => { consoleOutput += d.toString(); });
    proc.stderr.on('data', d => { consoleOutput += d.toString(); });

    for (let i = 1; i <= 45; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (consoleOutput.includes('Started VeriqApplication') || consoleOutput.includes('APPLICATION FAILED TO START')) {
            break;
        }
    }

    console.log('=== DIRECT H2 TEST CONSOLE OUTPUT ===');
    console.log(consoleOutput);

    killJava();
    process.exit(0);
}

testDirectH2();
