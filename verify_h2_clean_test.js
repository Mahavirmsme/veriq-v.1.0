const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

function killJava() {
    try {
        cp.execSync('powershell -Command "Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"');
    } catch (e) {}
}

async function verifyH2CleanTest() {
    killJava();
    await new Promise(r => setTimeout(r, 1000));

    const scratchDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch';
    const testDir = path.join(scratchDir, 'clean_h2_test');
    const installDir = path.join(testDir, 'app');
    const setupExe = path.join(scratchDir, 'veriq', 'VERIQ_Evaluation_Setup.exe');

    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(installDir, { recursive: true });

    // 1. Silent install of setup executable to isolated target directory
    cp.execSync(`"${setupExe}" /VERYSILENT /SUPPRESSMSGBOXES /DIR="${installDir}"`);

    // 2. Launch start-veriq.bat inside clean environment (No system JAVA_HOME/PostgreSQL)
    const javaExe = path.join(installDir, 'jre', 'bin', 'java.exe');
    const jarPath = path.join(installDir, 'veriq-backend-1.0.0-SNAPSHOT.jar');

    const cleanEnv = Object.assign({}, process.env);
    delete cleanEnv.JAVA_HOME;
    delete cleanEnv.SPRING_PROFILES_ACTIVE;
    delete cleanEnv.SPRING_DATASOURCE_URL;
    delete cleanEnv.SPRING_DATASOURCE_USERNAME;
    delete cleanEnv.SPRING_DATASOURCE_PASSWORD;

    let serverConsoleOutput = '';
    const proc = cp.spawn(javaExe, ['-jar', jarPath, '--spring.profiles.active=eval'], {
        cwd: installDir,
        env: cleanEnv
    });

    proc.stdout.on('data', d => { serverConsoleOutput += d.toString(); });
    proc.stderr.on('data', d => { serverConsoleOutput += d.toString(); });

    for (let i = 1; i <= 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (serverConsoleOutput.includes('Started VeriqApplication') || serverConsoleOutput.includes('APPLICATION FAILED TO START')) {
            break;
        }
    }

    console.log('=== CLEAN H2 FLYWAY MIGRATION CONSOLE LOG ===');
    console.log(serverConsoleOutput);

    killJava();
    process.exit(0);
}

verifyH2CleanTest();
