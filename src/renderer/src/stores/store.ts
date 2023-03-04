import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { createUserStore } from './userStore';
import { filterTableByTag, filterBySearch, sortBySite, paginateTableData } from './utils';
import { createPaginateStore } from './paginateStore';

import { createTableStore, type TableData, type TableEntry } from './tableStore';

export const appliedFilters: Writable<string[]> = writable([]);
export const currentSearch: Writable<string> = writable();

export const sideNavOpen: Writable<boolean> = writable(false);

export const tableSort: Writable<'ascending' | 'descending'> = writable('ascending');

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

const clearAuxStates = () => {
  currentSearch.set(undefined);
  appliedFilters.set([]);
  sideNavOpen.set(false);
  tableSort.set('ascending');
};

export const logout = () => {
  userStore.logout();
  tableStore.destroyTable();
  clearAuxStates();
};

export const loadNewTable = (storePass: string, tableData: TableData) => {
  userStore.updatePass(storePass);
  tableStore.setTableData(tableData);
  clearAuxStates();
};
