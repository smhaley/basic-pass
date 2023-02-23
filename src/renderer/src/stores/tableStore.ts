import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { deepCopyTable } from './utils';

import type { User } from '../actions/authActions';

export type TableEntry = {
  username: string;
  timestamp: string;
  tag?: string;
  passphrase: string;
};

export type TableData = {
  [key: string]: TableEntry;
};

export const mockTable: TableData = {};

export type TableStore = {
  tableData: TableData;
  appliedFilters: string[];
  currentSearch: string;
};

export const createTableStore = () => {
  const store: Writable<TableData> = writable();
  const { subscribe, set, update } = store;

  return {
    subscribe,
    setTableData: (table: TableData) => set(table),
    addTableEntry: (site: string, tableData: TableEntry, user?: User) => {
      let newTableData: TableData;
      update((table) => {
        const updatedTable = { ...table, [site]: tableData };
        newTableData = updatedTable;
        return updatedTable;
      });
      return newTableData;
    },
    updateTableKey: (key: string, tableData: TableEntry) => {
      let newTableData: TableData;
      update((table) => {
        const updatedTable = { ...table, [key]: tableData };
        newTableData = updatedTable;
        return updatedTable;
      });

      return newTableData;
    },
    deleteTableKey: (key: string) => {
      let newTableData: TableData;
      update((table) => {
        const tableData = deepCopyTable(table);
        delete tableData[key];
        newTableData = tableData;
        return tableData;
      });
      return newTableData;
    },
    destroyTable: () => set(null)
  };
};
