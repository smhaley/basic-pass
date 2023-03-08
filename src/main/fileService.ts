import { app, IpcMainInvokeEvent } from 'electron';

import * as fs from 'fs';
import * as path from 'path';

export const STORES = path.join(app.getPath('userData'), 'stores');

export const createNewUserStore = async (_: IpcMainInvokeEvent, args: string[]): Promise<void> => {
  if (!fs.existsSync(STORES)) {
    fs.mkdirSync(STORES);
  }
  await fs.promises.writeFile(path.join(STORES, `${args[0].toLowerCase()}.aes`), args[1]);
};

export const upsertUserStore = async (_: IpcMainInvokeEvent, args: string[]): Promise<void> => {
  await fs.promises.writeFile(path.join(STORES, `${args[0].toLowerCase()}.aes`), args[1]);
};

export const getStoreList = async (): Promise<string[]> => {
  if (!fs.existsSync(STORES)) {
    fs.mkdirSync(STORES);
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
