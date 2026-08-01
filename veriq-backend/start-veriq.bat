@echo off
title VERIQ Enterprise Platform Launcher

echo =======================================================
echo          VERIQ Enterprise Platform Launcher v1.1
echo =======================================================
echo.

:: 1. Force use of bundled JRE/JDK (Ignore system JAVA_HOME and PATH)
set "APP_DIR=%~dp0"
set "JAVA_HOME=%APP_DIR%jre"
set "JAVA_EXE=%APP_DIR%jre\bin\java.exe"

if not exist "%JAVA_EXE%" (
    set "JAVA_EXE=%APP_DIR%..\jre\bin\java.exe"
)

if not exist "%JAVA_EXE%" (
    echo [ERROR] Bundled Java Runtime Environment JRE was not found at:
    echo "%JAVA_EXE%"
    echo.
    echo Please reinstall VERIQ Platform Evaluation package.
    echo.
    if not exist "%APP_DIR%logs" mkdir "%APP_DIR%logs"
    echo [%DATE% %TIME%] [ERROR] Bundled JRE missing at %JAVA_EXE% >> "%APP_DIR%logs\startup.log"
    pause
    exit /b 1
)

:: 2. STEP 1: Check whether VERIQ is already running on http://localhost:8080
echo [INFO] Checking if VERIQ platform is already running...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if ($r.StatusCode -eq 200) { [Environment]::Exit(0) } } catch {}; [Environment]::Exit(1)" >nul 2>&1

if %ERRORLEVEL% equ 0 (
    echo.
    echo [INFO] VERIQ is already running.
    echo [INFO] Opening platform in default browser...
    start http://localhost:8080
    echo.
    echo [SUCCESS] VERIQ instance reused. Exiting launcher.
    timeout /t 3 >nul
    exit /b 0
)

:: 3. STEP 2: Locate the VERIQ backend executable JAR
set "JAR_PATH=%APP_DIR%veriq-backend-1.0.0-SNAPSHOT.jar"

if not exist "%JAR_PATH%" (
    set "JAR_PATH=%APP_DIR%target\veriq-backend-1.0.0-SNAPSHOT.jar"
)

if not exist "%JAR_PATH%" (
    set "JAR_PATH=%APP_DIR%veriq-backend\target\veriq-backend-1.0.0-SNAPSHOT.jar"
)

if not exist "%JAR_PATH%" (
    echo [ERROR] Could not locate veriq-backend-1.0.0-SNAPSHOT.jar!
    echo Please ensure the backend JAR exists in installation directory.
    echo.
    if not exist "%APP_DIR%logs" mkdir "%APP_DIR%logs"
    echo [%DATE% %TIME%] [ERROR] Backend executable JAR missing at %JAR_PATH% >> "%APP_DIR%logs\startup.log"
    pause
    exit /b 1
)

if not exist "%APP_DIR%logs" mkdir "%APP_DIR%logs"
echo [%DATE% %TIME%] [INFO] Launching VERIQ Server using bundled Java: %JAVA_EXE% >> "%APP_DIR%logs\startup.log"

echo [INFO] Found VERIQ platform package: %JAR_PATH%
echo [INFO] Using bundled Java runtime: %JAVA_EXE%
echo [INFO] Starting VERIQ Spring Boot Server...
echo.

:: Start Spring Boot JAR using BUNDLED Java runtime in a dedicated server window
start "VERIQ Server Console" "%JAVA_EXE%" -jar "%JAR_PATH%"

:: 4. STEP 3: Poll http://localhost:8080 every 1 second (Max 60 seconds)
echo [INFO] Waiting for VERIQ server initialization - Timeout 60s...
set ATTEMPT=0

:POLL_CHECK
set /a ATTEMPT+=1
if %ATTEMPT% gtr 60 goto STARTUP_FAILED

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop; if ($r.StatusCode -eq 200) { [Environment]::Exit(0) } } catch {}; [Environment]::Exit(1)" >nul 2>&1

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] VERIQ server is ready - Detected at attempt %ATTEMPT%/60.
    echo [%DATE% %TIME%] [SUCCESS] VERIQ server online at attempt %ATTEMPT% >> "%APP_DIR%logs\startup.log"
    goto STARTUP_SUCCESS
)

timeout /t 1 /nobreak >nul
goto POLL_CHECK

:STARTUP_SUCCESS
echo [INFO] Opening platform in default browser...
start http://localhost:8080
echo [SUCCESS] VERIQ launcher complete.
timeout /t 3 >nul
exit /b 0

:STARTUP_FAILED
echo.
echo [ERROR] VERIQ failed to start within 60 seconds.
echo Details captured in startup log: %APP_DIR%logs\startup.log
echo Please review console logs in VERIQ Server Console window.
echo.
echo [%DATE% %TIME%] [ERROR] Startup timed out after 60 seconds >> "%APP_DIR%logs\startup.log"
pause
exit /b 1
