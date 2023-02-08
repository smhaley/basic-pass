import type { TableEntry } from "../stores/tableStore";

export interface SiteData extends TableEntry {
  site: string;
}

export const TABLE_ENTRY = "tableEntry";
export const DELETE_KEY = "deleteKey";

export type DeleteTableEntry = { siteKey: string };

export type SiteDataAction = { [TABLE_ENTRY]: SiteData };

export type DeleteAction = { [DELETE_KEY]: DeleteTableEntry };
