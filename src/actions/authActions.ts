import { tableStore, userStore } from "../stores/store";

export type User = {
  username: string;
  passphrase: string;
};

export type UserAction = { userData: User };

export const logout = () => {
  userStore.logout();
  tableStore.destroyTable();
};

export const generateNewUserStore = () => {};

export const decryptUserStore = () => {};
