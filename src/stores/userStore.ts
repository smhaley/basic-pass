import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export type UserStore = { username?: string; isAuthenticated: boolean };

export const createUserStore = () => {
  const initialState = { isAuthenticated: false };
  const store: Writable<UserStore> = writable();
  const { subscribe, set } = store;
  return {
    subscribe,
    loginUser: (username: string) => {
      console.log(username, store);
      set({ isAuthenticated: true, username });
    },
    logout: () => set(initialState),
  };
};

// export const userStore = createUserStore();
