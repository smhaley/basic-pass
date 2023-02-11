import type { TableData } from "./tableStore";

export const deepCopyTable = (table: TableData) => {
  if (table === null || typeof table !== "object") return;
  let newTable: TableData = {};
  for (let key in table) {
    newTable[key] = { ...table[key] };
  }
  return newTable;
};

export const filterTableByTag = (tableData: TableData, filters: string[]) => {
  if (!filters.length) return tableData;
  let filteredTable: TableData | undefined;

  for (let [site, siteEntry] of Object.entries(tableData)) {
    if (siteEntry.tag && filters.includes(siteEntry.tag)) {
      filteredTable = { ...filteredTable, [site]: siteEntry };
    }
  }
  return filteredTable || tableData;
};

export const filterBySearch = (tableData: TableData, searchTerm: string) => {
  if (!searchTerm) return tableData;
  let filteredTable: TableData | undefined;

  for (let [site, siteEntry] of Object.entries(tableData)) {
    if (fuzzyMatch(searchTerm.toLocaleLowerCase(), site.toLocaleLowerCase())) {
      filteredTable = { ...filteredTable, [site]: siteEntry };
    }
  }
  return filteredTable;
};

export const fuzzyMatch = (pattern: string, str: string) => {
  pattern = ".*" + pattern.split("").join(".*") + ".*";
  const re = new RegExp(pattern);
  return re.test(str);
};

export const sortBySite = (
  tableData: TableData,
  direction: "ascending" | "descending"
) => {
  if (!tableData) return;

  const table = deepCopyTable(tableData);
  let tableKeys = Object.keys(table);

  let sortedOutput: TableData = {};

  const sortedTableKeys = tableKeys.sort();

  if (direction === "descending") {
    sortedTableKeys.reverse();
  }
  sortedTableKeys.forEach((key) => (sortedOutput[key] = table[key]));
  return sortedOutput;
};
