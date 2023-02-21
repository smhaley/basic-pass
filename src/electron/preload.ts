import { contextBridge, ipcRenderer } from "electron";
// import * as test from "./test/test";

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

contextBridge.exposeInMainWorld("BasicPass", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  getStoreList: () => ipcRenderer.invoke("getStoreList"),
  edit: (args: string[]) => ipcRenderer.invoke("createDB", args),
  createNewUserStore: (args: string[]) =>
    ipcRenderer.invoke("createNewUserStore", args),
  upsertUserStore: (args: string[]) =>
    ipcRenderer.invoke("upsertUserStore", args),
  getUserStore: (args: string[]) => ipcRenderer.invoke("getUserStore", args),
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }
});
