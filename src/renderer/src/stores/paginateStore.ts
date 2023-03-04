import { writable } from 'svelte/store';
import type { TableData } from './tableStore';
import type { Writable } from 'svelte/store';

export type PaginateStore = { rowSize: number; tableOffset?: [number, number] };

const resetTableOffset = (tableData: TableData, rowSize: number): [number, number] => {
  const tableSize = Object.keys(tableData).length;
  const rightMaxima = tableSize <= rowSize ? tableSize : rowSize;
  return [0, rightMaxima];
};

export const createPaginateStore = () => {
  const initialState = { rowSize: 5 };
  const store: Writable<PaginateStore> = writable(initialState);
  const { subscribe, update, set } = store;

  return {
    subscribe,
    resetOffsets: (tableData: TableData) => {
      update((paginate) => {
        const { rowSize } = paginate;
        return { ...paginate, tableOffset: resetTableOffset(tableData, rowSize) };
      });
    },
    paginateLeft: (tableData: TableData) => {
      update((paginate) => {
        const { rowSize, tableOffset } = paginate;
        const [min, max] = tableOffset;
        const leftMinima = Math.max(0, min - rowSize);
        let leftMaxima: number;

        if (max - min < rowSize) {
          const localMin = max - (max - min);
          leftMaxima = localMin <= 0 ? Object.keys(tableData).length : localMin;
        } else {
          leftMaxima = Math.max(max - rowSize, rowSize);
        }

        return { ...paginate, tableOffset: [leftMinima, leftMaxima] };
      });
    },
    paginateRight: (tableData: TableData) => {
      update((paginate) => {
        const { rowSize, tableOffset } = paginate;
        const [min, max] = tableOffset;
        const rightMaxima = Math.min(Object.keys(tableData).length, max + rowSize);
        const rightMinima = min + rowSize < rightMaxima ? min + rowSize : min;
        return { ...paginate, tableOffset: [rightMinima, rightMaxima] };
      });
    },
    updateRowSize: (size: number, tableData: TableData) =>
      set({ rowSize: size, tableOffset: resetTableOffset(tableData, size) })
  };
};
