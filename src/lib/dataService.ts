/**
 * Serwis danych – zapis i odczyt bazy danych z lokalnego pliku JSON.
 * Używa Tauri fs API (plugin-fs) do operacji na plikach.
 * W trybie przeglądarki (dev bez Tauri) działa na danych in-memory.
 */
import type { BazaDanych, Dziecko, Diagnoza } from "./types.js";
import { mockBazaDanych } from "./mockData.js";

const PLIK_DANYCH = "dane.json";

function czyTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

/** Wczytuje bazę danych z pliku JSON lub zwraca mock w trybie dev */
export async function wczytajBaze(): Promise<BazaDanych> {
  if (!czyTauri()) {
    return structuredClone(mockBazaDanych);
  }
  try {
    const { readTextFile, BaseDirectory } = await import(
      "@tauri-apps/plugin-fs"
    );
    const tekst = await readTextFile(PLIK_DANYCH, {
      baseDir: BaseDirectory.AppData,
    });
    return JSON.parse(tekst) as BazaDanych;
  } catch {
    // Plik nie istnieje – zwróć pustą bazę
    return { wersja: 1, dzieci: [], diagnozy: [] };
  }
}

/** Zapisuje całą bazę danych do pliku JSON */
export async function zapiszBaze(baza: BazaDanych): Promise<void> {
  if (!czyTauri()) {
    console.info("[dev] Zapis bazy (mock):", baza);
    return;
  }
  const { writeTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
  await writeTextFile(PLIK_DANYCH, JSON.stringify(baza, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
}

/** Pomocnicza funkcja generująca proste unikalne ID */
export function generujId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Dodaje nowe dziecko do bazy i zapisuje plik */
export async function dodajDziecko(
  baza: BazaDanych,
  dziecko: Omit<Dziecko, "id">
): Promise<BazaDanych> {
  const nowaDb: BazaDanych = {
    ...baza,
    dzieci: [...baza.dzieci, { ...dziecko, id: generujId() }],
  };
  await zapiszBaze(nowaDb);
  return nowaDb;
}

/** Dodaje nową diagnozę do bazy i zapisuje plik */
export async function dodajDiagnozę(
  baza: BazaDanych,
  diagnoza: Omit<Diagnoza, "id">
): Promise<BazaDanych> {
  const nowaDb: BazaDanych = {
    ...baza,
    diagnozy: [...baza.diagnozy, { ...diagnoza, id: generujId() }],
  };
  await zapiszBaze(nowaDb);
  return nowaDb;
}

/** Aktualizuje istniejącą diagnozę w bazie i zapisuje plik */
export async function aktualizujDiagnozę(
  baza: BazaDanych,
  diagnoza: Diagnoza
): Promise<BazaDanych> {
  const nowaDb: BazaDanych = {
    ...baza,
    diagnozy: baza.diagnozy.map((d) => (d.id === diagnoza.id ? diagnoza : d)),
  };
  await zapiszBaze(nowaDb);
  return nowaDb;
}
