/**
 * Przykładowe (mock) dane do prezentacji interfejsu
 * bez konieczności posiadania uruchomionego Tauri.
 */
import type { BazaDanych } from "./types.js";
import { noweKategorie } from "./kategorie.js";

function kategorieMockowe() {
  const kat = noweKategorie();
  // Wypełnij kilka wskaźników przykładowymi statusami
  kat[0].wskazniki[0].status = "opanowane";
  kat[0].wskazniki[1].status = "opanowane";
  kat[0].wskazniki[2].status = "wspomagane";
  kat[0].wskazniki[3].status = "opanowane";

  kat[1].wskazniki[0].status = "wspomagane";
  kat[1].wskazniki[1].status = "wymaga pomocy";
  kat[1].wskazniki[2].status = "wspomagane";
  kat[1].wskazniki[3].status = "wspomagane";

  kat[2].wskazniki[0].status = "opanowane";
  kat[2].wskazniki[1].status = "opanowane";
  kat[2].wskazniki[2].status = "opanowane";
  kat[2].wskazniki[3].status = "wspomagane";

  kat[3].wskazniki[0].status = "opanowane";
  kat[3].wskazniki[1].status = "opanowane";
  kat[3].wskazniki[2].status = "wspomagane";
  kat[3].wskazniki[3].status = "wymaga pomocy";
  kat[3].wskazniki[4].status = "wspomagane";
  kat[3].wskazniki[5].status = "opanowane";
  return kat;
}

export const mockBazaDanych: BazaDanych = {
  wersja: 1,
  dzieci: [
    { id: "d1", imie: "Anna", nazwisko: "Kowalska", rokUrodzenia: 2019 },
    { id: "d2", imie: "Piotr", nazwisko: "Nowak", rokUrodzenia: 2019 },
    { id: "d3", imie: "Zofia", nazwisko: "Wiśniewska", rokUrodzenia: 2018 },
  ],
  diagnozy: [
    {
      id: "diag1",
      dzieckoId: "d1",
      dataUtworzenia: "2025-09-01T08:00:00.000Z",
      dataModyfikacji: "2025-09-01T08:00:00.000Z",
      rok: 2025,
      kategorie: kategorieMockowe(),
      potrzebyRozwojowe: "Dziecko wymaga wsparcia w obszarze emocjonalnym.",
      predyspozycje: "Wyraźne zdolności artystyczne i plastyczne.",
      wskazowkiDlaNauczyciela:
        "Zalecana praca indywidualna nad radzeniem sobie z trudnymi emocjami.",
    },
  ],
};
