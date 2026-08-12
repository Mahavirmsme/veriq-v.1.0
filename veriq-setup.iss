; =====================================================================
; VERIQ Infrastructure Intelligence Platform 2.1.5 Inno Setup Script
; Official Standalone Enterprise Offline Distribution Package
; =====================================================================

#define MyAppName "VERIQ Infrastructure Intelligence Platform"
#define MyAppShortName "VERIQ Platform"
#define MyAppVersion "2.1.5"
#define MyAppPublisher "VERIQ Systems"
#define MyAppURL "http://localhost:8080"
#define MyAppExeName "veriq-launcher.exe"

[Setup]
AppId={{8F2C4D6E-1A3B-5C7D-9E0F-4A6B8C2D4E6F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={commonpf}\VERIQ Platform
DefaultGroupName={#MyAppShortName}
DisableProgramGroupPage=yes
OutputDir=C:\Users\HP\.gemini\antigravity\scratch\veriq\VERIQ-2.1.5-Release
OutputBaseFilename=VERIQ-2.1.5-Setup
Compression=lzma2/max
SolidCompression=no
WizardStyle=modern
PrivilegesRequired=admin
UninstallDisplayName={#MyAppName} {#MyAppVersion}
AppMutex=VERIQ_PLATFORM_STANDALONE_LAUNCHER_215,VERIQ_PLATFORM_STANDALONE_LAUNCHER_214,VERIQ_PLATFORM_STANDALONE_LAUNCHER_213,VERIQ_PLATFORM_STANDALONE_LAUNCHER_212,VERIQ_PLATFORM_STANDALONE_LAUNCHER_211,VERIQ_PLATFORM_STANDALONE_LAUNCHER_210
CloseApplications=yes
CloseApplicationsFilter=*veriq-launcher.exe*

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\veriq-launcher.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\backend\veriq-backend.jar"; DestDir: "{app}\backend"; Flags: ignoreversion
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\frontend\dist\*"; DestDir: "{app}\frontend\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\jre\*"; DestDir: "{app}\jre"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\postgresql\*"; DestDir: "{app}\postgresql"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "*.pid,*.log,*.tmp,postmaster.pid"
Source: "C:\Users\HP\.gemini\antigravity\scratch\veriq\config\*"; DestDir: "{app}\config"; Flags: ignoreversion recursesubdirs createallsubdirs

[Dirs]
Name: "{app}\runtime"; Permissions: users-modify
Name: "{app}\logs"; Permissions: users-modify
Name: "{app}\postgresql\data"; Permissions: users-modify

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\{#MyAppExeName}"; IconIndex: 0
Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon; IconFilename: "{app}\{#MyAppExeName}"; IconIndex: 0
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon; IconFilename: "{app}\{#MyAppExeName}"; IconIndex: 0

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch VERIQ Infrastructure Intelligence Platform"; Flags: postinstall nowait skipifsilent

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
begin
  if CurStep = ssInstall then
  begin
    // Safely terminate any running VERIQ launcher process to release file lock before replacement
    Exec('taskkill.exe', '/IM veriq-launcher.exe /F', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    Sleep(500);
  end;
end;
