import { writable, derived } from "svelte/store";
import type { Writable } from "svelte/store";
import { createUserStore } from "./userStore";
import { filterTableByTag, filterBySearch, sortBySite } from "./utils";

import { createTableStore, type TableEntry } from "./tableStore";

export const appliedFilters: Writable<string[]> = writable([]);
export const currentSearch: Writable<string> = writable();

export const sideNavOpen: Writable<boolean> = writable(false);

export const tableSort: Writable<"ascending" | "descending"> =
  writable("ascending");

export const userStore = createUserStore();
export const tableStore = createTableStore();

export const tableResults = derived(
  [tableStore, appliedFilters, currentSearch, tableSort],

  ([$tableStore, $appliedFilters, $currentSearch, $tableSort]) => {
    return sortBySite(
      filterBySearch(
        filterTableByTag($tableStore, $appliedFilters),
        $currentSearch
      ),
      $tableSort
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
  ($tableStore) => $tableStore && Object.keys($tableStore).length
);
