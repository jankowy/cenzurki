/**
 * Global application store – holds the current state of the database.
 */
import { writable } from "svelte/store";
import type { Database } from "./types.js";
import { loadDatabase } from "./dataService.js";

/** Database state loaded at application startup */
export const database = writable<Database>({ version: 1, children: [], diagnoses: [] });
export const isLoading = writable<boolean>(true);
export const error = writable<string | null>(null);

/** Initialises the store by loading data from file or mock */
export async function initStore(): Promise<void> {
  isLoading.set(true);
  error.set(null);
  try {
    const data = await loadDatabase();
    database.set(data);
  } catch (e) {
    error.set(String(e));
  } finally {
    isLoading.set(false);
  }
}
