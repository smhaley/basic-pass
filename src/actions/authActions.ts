import { tableStore, userStore, logout as globalLogout } from "../stores/store";

export type User = {
  username: string;
  passphrase: string;
};

export type UserAction = { userData: User };

export const logout = globalLogout;

export const generateNewUserStore = () => {};

export const decryptUserStore = () => {};
