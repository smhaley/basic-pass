import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

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
