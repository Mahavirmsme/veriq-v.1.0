; =====================================================================
; VERIQ Self-Contained Evaluation Installer v1.1 Inno Setup Script
; =====================================================================

#define MyAppName "VERIQ"
#define MyAppVersion "1.1.0"
#define MyAppPublisher "VERIQ Enterprise Platform"
#define MyAppURL "http://localhost:8080"
#define MyAppExeName "start-veriq.bat"

[Setup]
AppId={{5A8E1C2B-4E3F-4B1D-897C-2F1E0A9D8B7C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\VERIQ
DefaultGroupName=VERIQ
DisableProgramGroupPage=yes
OutputDir=.
OutputBaseFilename=VERIQ_Evaluation_Setup
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "start-veriq.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "veriq-backend\target\veriq-backend-1.0.0-SNAPSHOT.jar"; DestDir: "{app}"; Flags: ignoreversion
Source: "jre\*"; DestDir: "{app}\jre"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "config\*"; DestDir: "{app}\config"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "logs\*"; DestDir: "{app}\logs"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\VERIQ"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{sys}\shell32.dll"; IconIndex: 13
Name: "{autodesktop}\VERIQ"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename: "{sys}\shell32.dll"; IconIndex: 13

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch VERIQ Platform"; Flags: postinstall shellexec skipifsilent
