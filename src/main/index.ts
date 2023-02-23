import { app, shell, BrowserWindow, WebFrameMain, ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

import * as fs from 'fs';
import * as path from 'path';

const STORES = path.join(__dirname, 'stores');

const validateSender = (frame: WebFrameMain): boolean => {
  //test if localhost will work when bundled
  console.log(frame.origin);
  // const sender = new URL(frame.url);
  // console.log('--> ', sender, __dirname);
  return true;
};

export const createNewUserStore = async (_: IpcMainInvokeEvent, args: string[]): Promise<void> => {
  if (!fs.existsSync(STORES)) {
    await fs.promises.mkdir(STORES, { recursive: true });
  }
  await fs.promises.writeFile(path.join(STORES, `${args[0].toLowerCase()}.aes`), args[1]);
};

export const upsertUserStore = async (_: IpcMainInvokeEvent, args: string[]): Promise<void> => {
  await fs.promises.writeFile(path.join(STORES, `${args[0].toLowerCase()}.aes`), args[1]);
};

export const getStoreList = async (e: IpcMainInvokeEvent): Promise<string[]> => {
  validateSender(e.senderFrame);
  if (!fs.existsSync(STORES)) {
    await fs.promises.mkdir(STORES, { recursive: true });
  }
  const stores = await fs.promises.readdir(STORES);
  if (stores.length) {
    return stores.map((store) => path.parse(store).name);
  }
  return stores;
};

export const getUserStore = async (_: IpcMainInvokeEvent, args: string[]): Promise<string> => {
  const storePath = path.join(STORES, `${args[0].toLowerCase()}.aes`);

  if (!fs.existsSync(storePath)) {
    throw Error('user store does not exist');
  }
  return await fs.promises.readFile(storePath, 'utf8');
};

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1140,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  ipcMain.handle('createNewUserStore', createNewUserStore);
  ipcMain.handle('upsertUserStore', upsertUserStore);
  ipcMain.handle('getStoreList', getStoreList);
  ipcMain.handle('getUserStore', getUserStore);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
