using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace VeriqLauncher
{
    static class Program
    {
        private static Process backendProcess = null;
        private static NotifyIcon trayIcon = null;
        private static string appName = "VERIQ Infrastructure Intelligence Platform 2.1.0";
        private static string targetUrl = "http://localhost:8080";
        private static string baseDir = "";
        private static string logsDir = "";

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
            logsDir = Path.Combine(baseDir, "logs");
            Directory.CreateDirectory(logsDir);
            Directory.CreateDirectory(Path.Combine(baseDir, "runtime"));

            LogLauncher("========== VERIQ PLATFORM LAUNCHER 2.1.0 STARTED ==========");

            bool createdNew;
            using (Mutex mutex = new Mutex(true, "VERIQ_PLATFORM_STANDALONE_LAUNCHER_210", out createdNew))
            {
                if (!createdNew)
                {
                    LogLauncher("Instance already running. Redirecting to browser.");
                    OpenBrowser(targetUrl);
                    return;
                }

                InitializeTrayIcon();

                Thread bgThread = new Thread(StartPlatformLifecycle);
                bgThread.IsBackground = true;
                bgThread.Start();

                Application.Run();
            }
        }

        private static void InitializeTrayIcon()
        {
            ContextMenu contextMenu = new ContextMenu();
            contextMenu.MenuItems.Add("Open VERIQ Dashboard", new EventHandler((s, e) => OpenBrowser(targetUrl)));
            contextMenu.MenuItems.Add("-");
            contextMenu.MenuItems.Add("Exit & Graceful Shutdown", new EventHandler((s, e) => ExitApplication()));

            trayIcon = new NotifyIcon();
            trayIcon.Text = appName;
            trayIcon.Icon = SystemIcons.Application;
            trayIcon.ContextMenu = contextMenu;
            trayIcon.Visible = true;

            trayIcon.DoubleClick += new EventHandler((s, e) => OpenBrowser(targetUrl));
        }

        private static void StartPlatformLifecycle()
        {
            try
            {
                // 1. Start Embedded PostgreSQL Database
                StartEmbeddedPostgreSQL();

                // 2. Start Spring Boot Backend
                if (!IsBackendHealthy())
                {
                    StartBackendProcess();
                }

                // 3. Poll Backend Health with 90-second timeout
                LogLauncher("Polling backend health status on port 8080...");
                int attempts = 0;
                bool isUp = false;
                while (attempts < 90)
                {
                    if (IsBackendHealthy())
                    {
                        isUp = true;
                        break;
                    }
                    Thread.Sleep(1000);
                    attempts++;
                }

                if (isUp)
                {
                    LogLauncher("Backend is HEALTHY after " + attempts + "s. Opening browser to " + targetUrl);
                    OpenBrowser(targetUrl);
                }
                else
                {
                    LogLauncher("WARNING: Backend health check timed out after 90s. Opening browser anyway.");
                    OpenBrowser(targetUrl);
                }
            }
            catch (Exception ex)
            {
                LogLauncher("ERROR in startup lifecycle: " + ex.ToString());
            }
        }

        private static void StartEmbeddedPostgreSQL()
        {
            try
            {
                string pgBin = Path.Combine(baseDir, "postgresql", "bin");
                string pgData = Path.Combine(baseDir, "postgresql", "data");
                string pgCtl = Path.Combine(pgBin, "pg_ctl.exe");
                string initDb = Path.Combine(pgBin, "initdb.exe");
                string dbLog = Path.Combine(logsDir, "database.log");

                if (!File.Exists(pgCtl))
                {
                    LogLauncher("Embedded PostgreSQL binary not present. Skipping embedded database start.");
                    return;
                }

                Directory.CreateDirectory(pgData);

                if (!File.Exists(Path.Combine(pgData, "PG_VERSION")))
                {
                    LogLauncher("Initializing embedded PostgreSQL cluster...");
                    ProcessStartInfo initInfo = new ProcessStartInfo();
                    initInfo.FileName = initDb;
                    initInfo.Arguments = "-U postgres -A trust -E UTF8 -D \"" + pgData + "\"";
                    initInfo.CreateNoWindow = true;
                    initInfo.UseShellExecute = false;
                    initInfo.WindowStyle = ProcessWindowStyle.Hidden;

                    using (Process initProc = Process.Start(initInfo))
                    {
                        initProc.WaitForExit(30000);
                    }
                    LogLauncher("Embedded PostgreSQL cluster initialized.");
                }

                LogLauncher("Starting embedded PostgreSQL engine...");
                ProcessStartInfo startPgInfo = new ProcessStartInfo();
                startPgInfo.FileName = pgCtl;
                startPgInfo.Arguments = "-D \"" + pgData + "\" -l \"" + dbLog + "\" start";
                startPgInfo.CreateNoWindow = true;
                startPgInfo.UseShellExecute = false;
                startPgInfo.WindowStyle = ProcessWindowStyle.Hidden;

                using (Process pgProc = Process.Start(startPgInfo))
                {
                    pgProc.WaitForExit(10000);
                }
                LogLauncher("Embedded PostgreSQL engine start command executed.");
            }
            catch (Exception ex)
            {
                LogLauncher("PostgreSQL startup error: " + ex.Message);
            }
        }

        private static void StartBackendProcess()
        {
            string jarPath = Path.Combine(baseDir, "backend", "veriq-backend.jar");
            if (!File.Exists(jarPath))
            {
                jarPath = Path.Combine(baseDir, "veriq-backend-1.0.0-SNAPSHOT.jar");
            }
            if (!File.Exists(jarPath))
            {
                jarPath = Path.Combine(baseDir, "veriq-backend", "target", "veriq-backend-1.0.0-SNAPSHOT.jar");
            }

            string javaExe = Path.Combine(baseDir, "jre", "bin", "javaw.exe");
            if (!File.Exists(javaExe))
            {
                javaExe = Path.Combine(baseDir, "jre", "bin", "java.exe");
            }
            if (!File.Exists(javaExe))
            {
                javaExe = "javaw.exe";
            }

            LogLauncher("Launching Backend JAR: " + jarPath + " using " + javaExe);

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = javaExe;
            startInfo.Arguments = "-jar \"" + jarPath + "\"";
            startInfo.WorkingDirectory = baseDir;
            startInfo.CreateNoWindow = true;
            startInfo.UseShellExecute = false;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;

            backendProcess = Process.Start(startInfo);
            LogLauncher("Backend process initiated with PID: " + (backendProcess != null ? backendProcess.Id.ToString() : "null"));
        }

        private static bool IsBackendHealthy()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(targetUrl + "/api/v1/runtime-sensors");
                request.Method = "GET";
                request.Timeout = 1200;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    return response.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                try
                {
                    HttpWebRequest req2 = (HttpWebRequest)WebRequest.Create(targetUrl);
                    req2.Method = "GET";
                    req2.Timeout = 1200;
                    using (HttpWebResponse resp2 = (HttpWebResponse)req2.GetResponse())
                    {
                        return resp2.StatusCode == HttpStatusCode.OK;
                    }
                }
                catch
                {
                    return false;
                }
            }
        }

        private static void OpenBrowser(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                LogLauncher("Error launching browser: " + ex.Message);
            }
        }

        private static void StopEmbeddedPostgreSQL()
        {
            try
            {
                string pgCtl = Path.Combine(baseDir, "postgresql", "bin", "pg_ctl.exe");
                string pgData = Path.Combine(baseDir, "postgresql", "data");

                if (File.Exists(pgCtl) && Directory.Exists(pgData))
                {
                    LogLauncher("Stopping embedded PostgreSQL...");
                    ProcessStartInfo stopPgInfo = new ProcessStartInfo();
                    stopPgInfo.FileName = pgCtl;
                    stopPgInfo.Arguments = "-D \"" + pgData + "\" stop -m fast";
                    stopPgInfo.CreateNoWindow = true;
                    stopPgInfo.UseShellExecute = false;
                    stopPgInfo.WindowStyle = ProcessWindowStyle.Hidden;

                    using (Process p = Process.Start(stopPgInfo))
                    {
                        p.WaitForExit(5000);
                    }
                    LogLauncher("Embedded PostgreSQL stopped cleanly.");
                }
            }
            catch (Exception ex)
            {
                LogLauncher("PostgreSQL shutdown error: " + ex.Message);
            }
        }

        private static void ExitApplication()
        {
            LogLauncher("Exit requested. Executing graceful shutdown...");
            if (trayIcon != null)
            {
                trayIcon.Visible = false;
                trayIcon.Dispose();
            }

            try
            {
                if (backendProcess != null && !backendProcess.HasExited)
                {
                    backendProcess.Kill();
                }
            }
            catch { }

            StopEmbeddedPostgreSQL();

            LogLauncher("========== VERIQ PLATFORM LAUNCHER SHUTDOWN COMPLETE ==========");
            Application.ExitThread();
            Environment.Exit(0);
        }

        private static void LogLauncher(string message)
        {
            try
            {
                string logFile = Path.Combine(logsDir, "launcher.log");
                string line = "[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "] " + message + Environment.NewLine;
                File.AppendAllText(logFile, line);
            }
            catch { }
        }
    }
}
