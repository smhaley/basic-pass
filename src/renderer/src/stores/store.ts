import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { createUserStore } from './userStore';
import { filterTableByTag, filterBySearch, sortBySite, paginateTableData } from './utils';
import { createPaginateStore } from './paginateStore';

import { createTableStore, type TableEntry } from './tableStore';

export const appliedFilters: Writable<string[]> = writable([]);
export const currentSearch: Writable<string> = writable();

export const sideNavOpen: Writable<boolean> = writable(false);

export const tableSort: Writable<'ascending' | 'descending'> = writable('ascending');

// exports const paginate: Writable<{ rowSize: number; tableOffset?: [number, number] }> = writable({
//   rowSize: 2
// });

export const paginate = createPaginateStore();

export const userStore = createUserStore();
export const tableStore = createTableStore();

export const tableResults = derived(
  [tableStore, appliedFilters, currentSearch, tableSort],

  ([$tableStore, $appliedFilters, $currentSearch, $tableSort]) => {
    if (!tableStore) return {};

    const sorted = sortBySite(
      filterBySearch(filterTableByTag($tableStore, $appliedFilters), $currentSearch),
      $tableSort
    );

    console.log(sorted);
    Object.keys(sorted).length && paginate.resetOffsets(sorted);

    return sorted;
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

export const logout = () => {
  userStore.logout();
  tableStore.destroyTable();
  currentSearch.set(undefined);
  appliedFilters.set([]);
  sideNavOpen.set(false);
  tableSort.set('ascending');
};
