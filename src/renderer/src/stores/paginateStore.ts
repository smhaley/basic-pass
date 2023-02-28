import { writable } from 'svelte/store';
import type { TableData } from './tableStore';
import type { Writable } from 'svelte/store';

export type PaginateStore = { rowSize: number; tableOffset?: [number, number] };

export const createPaginateStore = () => {
  const initialState = { rowSize: 5 };
  const store: Writable<PaginateStore> = writable(initialState);
  const { subscribe, update } = store;

  return {
    subscribe,
    resetOffsets: (tableData: TableData) => {
      update((paginate) => {
        const { rowSize } = paginate;
        const tableSize = Object.keys(tableData).length;
        const rightMaxima = tableSize <= rowSize ? tableSize : rowSize;
        return { ...paginate, tableOffset: [0, rightMaxima] };
      });
    },
    _paginateLeft: () => {
      update((paginate) => {
        const { rowSize, tableOffset } = paginate;
        const [min, max] = tableOffset;

        const leftMinima = Math.max(0, min - rowSize);
        let leftMaxima: number;

        if (max - min < rowSize) {
          leftMaxima = max - (max - min);
        } else {
          leftMaxima = Math.max(max - rowSize, rowSize);
        }
        return { ...paginate, tableOffset: [leftMinima, leftMaxima] };
      });
    },
    get paginateLeft() {
      return this._paginateLeft;
    },
    set paginateLeft(value) {
      this._paginateLeft = value;
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
    updateRowSize: (size: number) => {
      update((paginate) => {
        return { ...paginate, rowSize: size };
      });
    }
  };
};
