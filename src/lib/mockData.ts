/**
 * Sample (mock) data for UI presentation
 * without needing a running Tauri instance.
 */
import type { Database } from "./types.js";
import { createDefaultCategories } from "./categories.js";

function buildMockCategories() {
  const cats = createDefaultCategories();

  // PHYSICAL
  cats[0].indicators[0].skillLevel = "MASTERED";
  cats[0].indicators[0].notes = "Dziecko wykazuje wysoką sprawność ruchową, swobodnie biega, skacze i rzuca.";
  cats[0].indicators[1].skillLevel = "MASTERED";
  cats[0].indicators[1].notes = "Dziecko wykazuje wysoką sprawność manualną, prawidłowo chwyta narzędzie pisarskie i precyzyjnie posługuje się nożyczkami.";
  cats[0].indicators[2].skillLevel = "SUPPORTED";
  cats[0].indicators[2].notes = "Dziecko radzi sobie z podstawową samoobsługą, jednak sporadycznie potrzebuje pomocy lub przypomnienia od dorosłego.";
  cats[0].indicators[3].skillLevel = "MASTERED";
  cats[0].indicators[3].notes = "Dziecko wykazuje dobrą koordynację wzrokowo-ruchową – z łatwością łączy patrzenie z precyzyjnym ruchem.";

  // EMOTIONAL
  cats[1].indicators[0].skillLevel = "SUPPORTED";
  cats[1].indicators[0].notes = "Dziecko z pomocą nauczyciela potrafi nazwać podstawowe emocje, jednak wymaga wsparcia w ich rozumieniu.";
  cats[1].indicators[1].skillLevel = "NEEDS_HELP";
  cats[1].indicators[1].notes = "Dziecko ma trudności z kontrolowaniem emocji – jego reakcje bywają gwałtowne lub nieadekwatne do sytuacji.";
  cats[1].indicators[2].skillLevel = "SUPPORTED";
  cats[1].indicators[2].notes = "Dziecko przeważnie radzi sobie z trudnościami, jednak wymaga dodatkowej motywacji w sytuacjach niepowodzenia.";
  cats[1].indicators[3].skillLevel = "SUPPORTED";
  cats[1].indicators[3].notes = "Dziecko najczęściej wyraża potrzeby i uczucia w sposób akceptowany, choć wymaga przypomnienia zasad.";

  // SOCIAL
  cats[2].indicators[0].skillLevel = "MASTERED";
  cats[2].indicators[0].notes = "Dziecko przestrzega reguł i zasad grupy, rozumie ich sens i stosuje je samodzielnie.";
  cats[2].indicators[1].skillLevel = "MASTERED";
  cats[2].indicators[1].notes = "Dziecko chętnie i sprawnie współpracuje z rówieśnikami podczas zabaw i zajęć grupowych.";
  cats[2].indicators[2].skillLevel = "MASTERED";
  cats[2].indicators[2].notes = "Dziecko komunikuje się z dorosłymi w sposób właściwy – zwraca się o pomoc, reaguje na polecenia.";
  cats[2].indicators[3].skillLevel = "SUPPORTED";
  cats[2].indicators[3].notes = "Dziecko podejmuje powierzone zadania, lecz wymaga przypominania i motywowania do ich ukończenia.";

  // COGNITIVE
  cats[3].indicators[0].skillLevel = "MASTERED";
  cats[3].indicators[0].notes = "Dziecko mówi wyraźnie, poprawnie wymawia głoski i dysponuje bogatym zasobem słownictwa odpowiednim do wieku.";
  cats[3].indicators[1].skillLevel = "MASTERED";
  cats[3].indicators[1].notes = "Dziecko poprawnie wykonuje analizę i syntezę wzrokową – sprawnie składa puzzle i odtwarza wzory graficzne.";
  cats[3].indicators[2].skillLevel = "SUPPORTED";
  cats[3].indicators[2].notes = "Dziecko radzi sobie z analizą słuchową przy wsparciu; wymaga ćwiczenia świadomości fonologicznej.";
  cats[3].indicators[3].skillLevel = "NEEDS_HELP";
  cats[3].indicators[3].notes = "Dziecko wykazuje niski poziom gotowości do czytania i pisania; wymaga intensywnego przygotowania w tym zakresie.";
  cats[3].indicators[4].skillLevel = "SUPPORTED";
  cats[3].indicators[4].notes = "Dziecko radzi sobie z liczeniem, choć wymaga wsparcia przy bardziej złożonych operacjach matematycznych.";
  cats[3].indicators[5].skillLevel = "MASTERED";
  cats[3].indicators[5].notes = "Dziecko sprawnie orientuje się w przestrzeni i czasie – zna pojęcia góra/dół, stosuje nazwy dni tygodnia.";

  return cats;
}

export const mockDatabase: Database = {
  version: 1,
  children: [
    { id: "c1", firstName: "Anna", lastName: "Kowalska", birthYear: 2019 },
    { id: "c2", firstName: "Piotr", lastName: "Nowak", birthYear: 2019 },
    { id: "c3", firstName: "Zofia", lastName: "Wiśniewska", birthYear: 2018 },
  ],
  diagnoses: [
    {
      id: "diag1",
      childId: "c1",
      createdAt: "2025-09-01T08:00:00.000Z",
      updatedAt: "2025-09-01T08:00:00.000Z",
      year: 2025,
      type: "INITIAL",
      categories: buildMockCategories(),
      developmentalNeeds: "Dziecko wymaga wsparcia w obszarze emocjonalnym.",
      strengths: "Wyraźne zdolności artystyczne i plastyczne.",
      teacherNotes:
        "Zalecana praca indywidualna nad radzeniem sobie z trudnymi emocjami.",
    },
  ],
};
