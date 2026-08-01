$urls = @(
    "http://localhost:8080/",
    "http://localhost:8080/assets/index-3bxHUa1j.css",
    "http://localhost:8080/assets/index-CmtEyZEH.js",
    "http://localhost:8080/ops/dashboard"
)

$out = @()
foreach ($url in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing
        $out += "[SUCCESS] $url -> Status: $($res.StatusCode), Type: $($res.Headers['Content-Type']), Size: $($res.Content.Length) bytes"
    } catch {
        $out += "[ERROR] $url -> $($_.Exception.Message)"
    }
}
$out | Set-Content -Path "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-backend\test_results.txt" -Encoding utf8
