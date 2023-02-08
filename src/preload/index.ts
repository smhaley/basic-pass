import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('BasicPass', {
      getStoreList: () => ipcRenderer.invoke('getStoreList'),
      edit: (args: string[]) => ipcRenderer.invoke('createDB', args),
      createNewUserStore: (args: string[]) => ipcRenderer.invoke('createNewUserStore', args),
      upsertUserStore: (args: string[]) => ipcRenderer.invoke('upsertUserStore', args),
      getUserStore: (args: string[]) => ipcRenderer.invoke('getUserStore', args)
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
