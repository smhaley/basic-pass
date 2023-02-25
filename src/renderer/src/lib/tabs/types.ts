import type { Writable } from 'svelte/store';

export type TabContext = {
  registerTab: (tab: any) => void;
  registerPanel: (panel: any) => void;
  selectTab: (tab: any) => void;
  selectedTab: Writable<any>;
  selectedPanel: Writable<any>;
};
