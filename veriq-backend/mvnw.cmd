@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper Startup Batch Script for VERIQ
@REM ----------------------------------------------------------------------------

@setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if not exist %MAVEN_WRAPPER_JAR% (
    echo Error: Could not find %MAVEN_WRAPPER_JAR%
    exit /b 1
)

set JAVA_EXE=java
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\java.exe" set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
)

%JAVA_EXE% -classpath %MAVEN_WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
if errorlevel 1 goto error
goto end

:error
exit /b 1

:end
@endlocal
