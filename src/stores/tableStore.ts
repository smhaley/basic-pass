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

export const mockTable: TableData = {
 
};

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
      update((table) => {
        const updatedTable = { ...table, [site]: tableData };
        console.log("perform store save here", tableData);
        return updatedTable;
      });
    },
    updateTableKey: (key: string, tableData: TableEntry) => {
      update((table) => {
        const updatedTable = { ...table, [key]: tableData };
        console.log("perform store save here", tableData);
        return updatedTable;
      });
    },
    deleteTableKey: (key: string) =>
      update((table) => {
        const tableData = deepCopyTable(table);
        delete tableData[key];
        console.log("save updated store here");
        return tableData;
      }),
    destroyTable: () => set(null),
  };
};

// export const tableStore = createTableStore();
