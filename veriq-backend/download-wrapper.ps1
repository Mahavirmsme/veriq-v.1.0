# Download Maven Wrapper Jar Script
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wrapperJar = Join-Path $PSScriptRoot ".mvn\wrapper\maven-wrapper.jar"
$wrapperUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

$wrapperDir = Split-Path $wrapperJar
if (-not (Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
}

if (-not (Test-Path $wrapperJar)) {
    Write-Host "Downloading Maven Wrapper JAR to $wrapperJar ..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperJar -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
}
