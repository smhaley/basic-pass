import {
  app,
  BrowserWindow,
  type WebFrameMain,
  ipcMain,
  type IpcMainInvokeEvent,
} from "electron";
import * as path from "path";
import * as fs from "fs";

const STORES = path.join(__dirname, "stores");

const validateSender = (frame: WebFrameMain) => {
  // Value the host of the URL using an actual URL parser and an allowlist
  if (frame.url.includes(path.join(__dirname, "../"))) return true;
  return false;
};

export const createNewUserStore = async (
  e: IpcMainInvokeEvent,
  args: string[]
): Promise<void> => {
  if (!validateSender(e.senderFrame)) return null;
  console.log(args);
  if (!fs.existsSync(STORES)) {
    await fs.promises.mkdir(STORES, { recursive: true });
  }
  await fs.promises.writeFile(
    path.join(STORES, `${args[0].toLowerCase()}.aes`),
    args[1]
  );
};

export const upsertUserStore = async (
  e: IpcMainInvokeEvent,
  args: string[]
): Promise<void> => {
  console.log(args);
  await fs.promises.writeFile(
    path.join(STORES, `${args[0].toLowerCase()}.aes`),
    args[1]
  );
};

export const getStoreList = async (
  e: IpcMainInvokeEvent
): Promise<string[]> => {
  if (!validateSender(e.senderFrame)) return null;
  const stores = await fs.promises.readdir(STORES);
  if (stores.length) {
    return stores.map((store) => path.parse(store).name);
  }
  return stores;
};

export const getUserStore = async (
  e: IpcMainInvokeEvent,
  args: string[]
): Promise<string> => {
  console.log(args);
  const storePath = path.join(STORES, `${args[0].toLowerCase()}.aes`);

  if (!fs.existsSync(storePath)) {
    throw Error("user store does not exist");
  }
  return await fs.promises.readFile(storePath, "utf8");
};

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  ipcMain.handle("createNewUserStore", createNewUserStore);
  ipcMain.handle("upsertUserStore", upsertUserStore);
  ipcMain.handle("getStoreList", getStoreList);
  ipcMain.handle("getUserStore", getUserStore);
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
