import type { AI } from "./ai";

export interface Farmer {
  ais?: AI[];
  // Folder metadata from API
  folders?: Array<{
    id: number;
    name: string;
    folder: number; // parent folder id, 0 for root
  }>;
}
