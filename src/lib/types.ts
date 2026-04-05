/**
 * Typy danych dla aplikacji "Cenzurki"
 * Diagnoza dojrzałości szkolnej zgodna z wymogami MEN
 */

/** Możliwe statusy oceny dla każdej kategorii diagnozy */
export type Status = "opanowane" | "wspomagane" | "wymaga pomocy";

/** Dane osobowe dziecka */
export interface Dziecko {
  id: string;
  imie: string;
  nazwisko: string;
  rokUrodzenia: number;
}

/** Pojedynczy wskaźnik / kryterium oceny w ramach kategorii */
export interface Wskaznik {
  id: string;
  opis: string;
  status: Status | null;
  uwagi?: string;
}

/** Kategoria diagnozy MEN */
export interface KategoriaDiagnozy {
  id: string;
  nazwa: string;
  wskazniki: Wskaznik[];
}

/**
 * Pełny arkusz diagnozy dojrzałości szkolnej dla jednego dziecka.
 * Zgodny z "Informacją o gotowości dziecka do podjęcia nauki
 * w szkole podstawowej" (rozporządzenie MEN).
 */
export interface Diagnoza {
  id: string;
  dzieckoId: string;
  dataUtworzenia: string; // ISO 8601
  dataModyfikacji: string; // ISO 8601
  rok: number; // rok szkolny, np. 2025
  /** 4 główne obszary rozwoju wg MEN */
  kategorie: KategoriaDiagnozy[];
  /** Dodatkowe potrzeby rozwojowe / zalecenia dla rodziców */
  potrzebyRozwojowe: string;
  /** Mocne strony / predyspozycje */
  predyspozycje: string;
  /** Wskazówki dla nauczyciela klasy I */
  wskazowkiDlaNauczyciela: string;
}

/** Struktura całej bazy danych (jeden plik JSON na dysku) */
export interface BazaDanych {
  wersja: number;
  dzieci: Dziecko[];
  diagnozy: Diagnoza[];
}
