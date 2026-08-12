@echo off
echo Compiling veriq-launcher.exe...
"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /target:winexe /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:"C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-launcher.exe" "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-launcher.cs"

echo Compiling VERIQ-2.1.0-Setup.exe...
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-setup.iss"

echo Writing compilation report...
dir "C:\Users\HP\.gemini\antigravity\scratch\veriq\VERIQ-2.1.0-Release\VERIQ-2.1.0-Setup.exe" "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-launcher.exe" "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-setup.iss" > "C:\Users\HP\.gemini\antigravity\scratch\veriq\make-report.txt"

echo Done.
