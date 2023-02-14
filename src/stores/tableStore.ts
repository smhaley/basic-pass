import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { deepCopyTable } from "./utils";

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
    addTableEntry: (site: string, tableData: TableEntry) => {
      let table: TableData;
      update((table) => {
        const updatedTable = { ...table, [site]: tableData };
        table = updatedTable;
        return updatedTable;
      });
      return table;
    },
    updateTableKey: (key: string, tableData: TableEntry) => {
      let table: TableData;
      update((table) => {
        const updatedTable = { ...table, [key]: tableData };
        table = updatedTable;
        return updatedTable;
      });

      return table;
    },
    deleteTableKey: (key: string) => {
      let table: TableData;
      update((table) => {
        const tableData = deepCopyTable(table);
        delete tableData[key];
        table = tableData;
        return tableData;
      });
      return table;
    },
    destroyTable: () => set(null),
  };
};
