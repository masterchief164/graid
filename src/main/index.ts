import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import path from 'node:path';
import { initializeHandlers } from './handlers';
import expressApp from './services/expressServer';
import express from 'express';
import fs from 'node:fs/promises';
import { getDb } from './db/db';

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('graid', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('graid');
}

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true // Enable context isolation
    }
  });

  const lockAcquired = app.requestSingleInstanceLock();
  if (!lockAcquired) {
    app.quit();
    return;
  } else {
    app.on('second-instance', (_, commandLine) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
      const url = commandLine.pop();
      if (url) {
        openInMainWindow(url);
      }
    });
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  openInMainWindow(url);
});

function openInMainWindow(url: string): void {
  if (mainWindow) {
    const path = url.split('://')[1];
    mainWindow.webContents.send('navigate', path);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');
  expressApp.get('/login/google', async (req: express.Request, res: express.Response) => {
    const code = (req.query.code ?? '') as string;
    let html = await fs.readFile(path.join(__dirname, './index.html'), 'utf-8');
    html = html.replace('code=code', `code=${code}`);
    res.header('Content-Type', 'text/html');
    res.send(html);
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));
  initializeHandlers(ipcMain);
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.setAsDefaultProtocolClient('graid');
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async () => {
  await getDb().close();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
