import { writable, derived } from "svelte/store";
import type { Writable } from "svelte/store";
import { createUserStore } from "./userStore";
import { filterTableByTag, filterBySearch } from "./utils";

import { createTableStore, type TableEntry } from "./tableStore";

export const appliedFilters: Writable<string[]> = writable([]);
export const currentSearch: Writable<string> = writable();

export const sideNavOpen: Writable<boolean> = writable(false);

export const userStore = createUserStore();
export const tableStore = createTableStore();

export const tableResults = derived(
  [tableStore, appliedFilters, currentSearch],

  ([$tableStore, $appliedFilters, $currentSearch]) => {
    return filterBySearch(
      filterTableByTag($tableStore, $appliedFilters),
      $currentSearch
    );
  }
);

export const availableFilters = derived(tableStore, ($tableStore) => {
  const filterValues = Object.values($tableStore)
    .map((entry: TableEntry) => entry.tag)
    .filter((entry) => entry);

  return [...new Set(filterValues)];
});

export const tableSize = derived(
  tableStore,
  ($tableStore) => Object.keys($tableStore).length
);
