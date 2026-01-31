import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const SETTINGS = 'settings';
export const RIGHT_CLICK_SHOW = 'rightClickShow';

export const settingsLabelMap = {
  [RIGHT_CLICK_SHOW]: 'show passphrase on right click'
};

export interface SettingsStore {
  [RIGHT_CLICK_SHOW]: boolean;
}

type Setting<T> = {
  [key in keyof T]?: T[key];
};

const defaultSettings: SettingsStore = { [RIGHT_CLICK_SHOW]: true };

export const createSettingsStore = () => {
  const savedSettings = localStorage.getItem(SETTINGS);
  const initialState = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  const store: Writable<SettingsStore> = writable(initialState);
  const { subscribe, update, set } = store;
  return {
    subscribe,
    updateSettings: (setting: Setting<SettingsStore>) => {
      update((settingsStore) => {

        const newStore = { ...settingsStore, ...setting };
        localStorage.setItem(SETTINGS, JSON.stringify(newStore));
        return newStore;
      });
    },
    reset: () => {
      localStorage.setItem(SETTINGS, JSON.stringify(defaultSettings));
      set(defaultSettings);
    }
  };
};
