import { writable } from 'svelte/store';

const SETTINGS_PREFIX = 'settings_';
export const RIGHT_CLICK_SHOW = 'rightClickShow';

export interface SettingsStore {
  [RIGHT_CLICK_SHOW]: boolean;
}

export const settingsLabelMap = {
  [RIGHT_CLICK_SHOW]: 'Show passphrase on right click'
};

const defaultSettings: SettingsStore = { [RIGHT_CLICK_SHOW]: true };

export const createSettingsStore = () => {
  const { subscribe, set, update } = writable<SettingsStore>(defaultSettings);

  let currentUsername = '';

  // Helper to get the user-specific storage key
  const getStorageKey = (user: string) => `${SETTINGS_PREFIX}${user}`;

  return {
    subscribe,

    loadUser: (username: string) => {
      currentUsername = username;
      const savedSettings = localStorage.getItem(getStorageKey(username));

      const initialState = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

      set(initialState);
    },

    updateSettings: (setting: Partial<SettingsStore>) => {
      update((state) => {
        const newStore = { ...state, ...setting };

        // Only persist if a user is actually loaded
        if (currentUsername) {
          localStorage.setItem(getStorageKey(currentUsername), JSON.stringify(newStore));
        }

        return newStore;
      });
    },

    reset: () => {
      set(defaultSettings);
      if (currentUsername) {
        localStorage.setItem(getStorageKey(currentUsername), JSON.stringify(defaultSettings));
      }
    }
  };
};
