import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export type UserStore = {
  username?: string;
  isAuthenticated: boolean;
  passphrase?: string;
};

export const createUserStore = () => {
  const initialState = { isAuthenticated: false };
  const store: Writable<UserStore> = writable();
  const { subscribe, set, update } = store;
  return {
    subscribe,
    loginUser: (username: string, passphrase) => {
      set({ isAuthenticated: true, username, passphrase });
    },
    logout: () => set(initialState),
    updatePass: (passphrase: string) =>
      update((user) => ({ ...user, passphrase })),
  };
};
