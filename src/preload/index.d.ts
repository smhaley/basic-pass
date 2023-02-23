import { ElectronAPI } from '@electron-toolkit/preload';

export type BasicPass = {
  getStoreList: () => Promise<string[]>;
  createNewUserStore: (args: string[]) => Promise<void>;
  upsertUserStore: (args: string[]) => Promise<void>;
  getUserStore: (args: string[]) => Promise<string>;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    BasicPass: BasicPass;
  }
}
