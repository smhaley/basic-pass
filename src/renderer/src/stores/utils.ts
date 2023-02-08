import type { TableData } from './tableStore';

export const deepCopyTable = (table: TableData) => {
  const newTable: TableData = {};
  for (const key in table) {
    newTable[key] = { ...table[key] };
  }
  return newTable;
};

export const filterTableByTag = (tableData: TableData, filters: string[]) => {
  if (!filters.length) return tableData;
  let filteredTable: TableData | undefined;

  for (const [site, siteEntry] of Object.entries(tableData)) {
    if (siteEntry.tag && filters.includes(siteEntry.tag)) {
      filteredTable = { ...filteredTable, [site]: siteEntry };
    }
  }
  return filteredTable || tableData;
};

export const filterBySearch = (tableData: TableData, searchTerm: string) => {
  if (!searchTerm) return tableData;
  let filteredTable: TableData | undefined;

  for (const [site, siteEntry] of Object.entries(tableData)) {
    if (fuzzyMatch(searchTerm.toLocaleLowerCase(), site.toLocaleLowerCase())) {
      filteredTable = { ...filteredTable, [site]: siteEntry };
    }
  }
  return filteredTable;
};

export const fuzzyMatch = (pattern: string, str: string) => {
  pattern = '.*' + pattern.split('').join('.*') + '.*';
  const re = new RegExp(pattern);
  return re.test(str);
};

export const sortBySite = (tableData: TableData, direction: 'ascending' | 'descending') => {
  const table = deepCopyTable(tableData);
  const tableKeys = Object.keys(table);

  const sortedOutput: TableData = {};

  const sortedTableKeys = tableKeys.sort();

  if (direction === 'descending') {
    sortedTableKeys.reverse();
  }
  sortedTableKeys.forEach((key) => (sortedOutput[key] = table[key]));
  return sortedOutput;
};

export const paginateTableData = (
  tableData: TableData,
  paginate: { rowSize: number; tableOffset?: [number, number] }
) => {
  let offsets: [number, number];
  if (!paginate.tableOffset) {
    const { rowSize } = paginate;
    const tableSize = Object.keys(tableData).length;
    const rightMaxima = tableSize <= paginate.rowSize ? tableSize : rowSize;
    offsets = [0, rightMaxima];
  } else {
    offsets = paginate.tableOffset;
  }

  const tableKeys = Object.keys(tableData);
  const visibleSites = tableKeys.slice(offsets[0], offsets[1]);

  return visibleSites.reduce((acc, curr) => {
    return { ...acc, [curr]: tableData[curr] };
  }, {} as TableData);
};
