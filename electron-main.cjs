// Electron Main Process for SubStudio AI Pro
// Run with: npx electron electron-main.cjs
const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#141419',
    frame: true,
    title: 'SubStudio AI Pro - Windows Subtitle Generator',
    icon: path.join(__dirname, 'public/icon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Open external links in user's browser, not in the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // In production load compiled dist/index.html or hosted URL; in development load local port 3000
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // If backend is running locally or remote SaaS API
    const remoteUrl = process.env.APP_URL || 'http://localhost:3000';
    mainWindow.loadURL(remoteUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
