import type { Writable } from 'svelte/store';

export type TabContext = {
  registerTab: (tab: object) => void;
  registerPanel: (panel: object) => void;
  selectTab: (tab: object) => void;
  selectedTab: Writable<object>;
  selectedPanel: Writable<object>;
};
