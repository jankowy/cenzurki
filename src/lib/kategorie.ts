/**
 * Domyślna struktura 4 kategorii diagnozy MEN z listą wskaźników.
 * Używana przy tworzeniu nowej diagnozy.
 */
import type { KategoriaDiagnozy } from "./types.js";

export function noweKategorie(): KategoriaDiagnozy[] {
  return [
    {
      id: "fizyczny",
      nazwa: "Rozwój fizyczny",
      wskazniki: [
        {
          id: "fiz-1",
          opis: "Sprawność ruchowa – motoryka duża (bieganie, skakanie, rzucanie)",
          status: null,
        },
        {
          id: "fiz-2",
          opis: "Sprawność rąk – motoryka mała (chwyt pisarski, cięcie nożyczkami)",
          status: null,
        },
        {
          id: "fiz-3",
          opis: "Samoobsługa (ubieranie się, higiena, spożywanie posiłków)",
          status: null,
        },
        {
          id: "fiz-4",
          opis: "Koordynacja wzrokowo-ruchowa",
          status: null,
        },
      ],
    },
    {
      id: "emocjonalny",
      nazwa: "Rozwój emocjonalny",
      wskazniki: [
        {
          id: "emo-1",
          opis: "Rozpoznawanie i nazywanie własnych emocji",
          status: null,
        },
        {
          id: "emo-2",
          opis: "Kontrolowanie emocji w sytuacjach trudnych",
          status: null,
        },
        {
          id: "emo-3",
          opis: "Odporność na stres i niepowodzenia (sytuacje zadaniowe)",
          status: null,
        },
        {
          id: "emo-4",
          opis: "Wyrażanie potrzeb i uczuć w sposób społecznie akceptowany",
          status: null,
        },
      ],
    },
    {
      id: "spoleczny",
      nazwa: "Rozwój społeczny",
      wskazniki: [
        {
          id: "spo-1",
          opis: "Przestrzeganie reguł i zasad obowiązujących w grupie",
          status: null,
        },
        {
          id: "spo-2",
          opis: "Współpraca i zabawa z rówieśnikami",
          status: null,
        },
        {
          id: "spo-3",
          opis: "Komunikacja z dorosłymi (zwracanie się o pomoc, reagowanie na polecenia)",
          status: null,
        },
        {
          id: "spo-4",
          opis: "Samodzielność i odpowiedzialność za powierzone zadania",
          status: null,
        },
      ],
    },
    {
      id: "poznawczy",
      nazwa: "Rozwój poznawczy",
      wskazniki: [
        {
          id: "poz-1",
          opis: "Mowa – wymowa i zasób słownictwa odpowiedni do wieku",
          status: null,
        },
        {
          id: "poz-2",
          opis: "Analiza i synteza wzrokowa (układanki, puzzle, rysowanie)",
          status: null,
        },
        {
          id: "poz-3",
          opis: "Analiza i synteza słuchowa (rymy, sylaby, głoski)",
          status: null,
        },
        {
          id: "poz-4",
          opis: "Gotowość do czytania i pisania (znajomość liter, orientacja na kartce)",
          status: null,
        },
        {
          id: "poz-5",
          opis: "Umiejętności matematyczne (liczenie do 10, porównywanie, klasyfikowanie)",
          status: null,
        },
        {
          id: "poz-6",
          opis: "Orientacja w przestrzeni i czasie (góra/dół, rano/wieczór, dni tygodnia)",
          status: null,
        },
      ],
    },
  ];
}
