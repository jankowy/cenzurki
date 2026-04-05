/**
 * Data service – read and write the database from/to a local JSON file.
 * Uses Tauri fs API (plugin-fs) for file operations.
 * In browser mode (dev without Tauri) it operates on in-memory data.
 */
import type { Database, Child, Diagnosis } from "./types.js";
import { mockDatabase } from "./mockData.js";

const DATA_FILE = "data.json";

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

/** Loads the database from a JSON file or returns mock data in dev mode */
export async function loadDatabase(): Promise<Database> {
  if (!isTauri()) {
    return structuredClone(mockDatabase);
  }
  try {
    const { readTextFile, BaseDirectory } = await import(
      "@tauri-apps/plugin-fs"
    );
    const text = await readTextFile(DATA_FILE, {
      baseDir: BaseDirectory.AppData,
    });
    return JSON.parse(text) as Database;
  } catch {
    // File doesn't exist yet – return an empty database
    return { version: 1, children: [], diagnoses: [] };
  }
}

/** Saves the entire database to a JSON file */
export async function saveDatabase(db: Database): Promise<void> {
  if (!isTauri()) {
    console.info("[dev] Save database (mock):", db);
    return;
  }
  const { writeTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
  await writeTextFile(DATA_FILE, JSON.stringify(db, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
}

/** Helper function that generates a simple unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Adds a new child to the database and saves the file */
export async function addChild(
  db: Database,
  child: Omit<Child, "id">
): Promise<Database> {
  const updated: Database = {
    ...db,
    children: [...db.children, { ...child, id: generateId() }],
  };
  await saveDatabase(updated);
  return updated;
}

/** Adds a new diagnosis to the database and saves the file */
export async function addDiagnosis(
  db: Database,
  diagnosis: Omit<Diagnosis, "id">
): Promise<Database> {
  const updated: Database = {
    ...db,
    diagnoses: [...db.diagnoses, { ...diagnosis, id: generateId() }],
  };
  await saveDatabase(updated);
  return updated;
}

/** Updates an existing diagnosis in the database and saves the file */
export async function updateDiagnosis(
  db: Database,
  diagnosis: Diagnosis
): Promise<Database> {
  const updated: Database = {
    ...db,
    diagnoses: db.diagnoses.map((d) => (d.id === diagnosis.id ? diagnosis : d)),
  };
  await saveDatabase(updated);
  return updated;
}
