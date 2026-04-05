/**
 * Globalny store aplikacji – trzyma aktualny stan bazy danych.
 */
import { writable } from "svelte/store";
import type { BazaDanych } from "./types.js";
import { wczytajBaze } from "./dataService.js";

/** Stan bazy danych ładowanej przy starcie aplikacji */
export const baza = writable<BazaDanych>({ wersja: 1, dzieci: [], diagnozy: [] });
export const ladowanie = writable<boolean>(true);
export const blad = writable<string | null>(null);

/** Inicjalizuje store, wczytując dane z pliku lub mocka */
export async function inicjalizuj(): Promise<void> {
  ladowanie.set(true);
  blad.set(null);
  try {
    const dane = await wczytajBaze();
    baza.set(dane);
  } catch (e) {
    blad.set(String(e));
  } finally {
    ladowanie.set(false);
  }
}
