# Cenzurki – Diagnoza Dojrzałości Szkolnej

Lekka aplikacja desktopowa do prowadzenia diagnostyki gotowości szkolnej dzieci, zgodna z polskimi wymogami MEN.

## Stack technologiczny

- **Desktop:** [Tauri v2](https://tauri.app/) (Rust backend, natywne WebView)
- **Frontend:** [SvelteKit](https://kit.svelte.dev/) + [Vite](https://vite.dev/) (TypeScript)
- **Dane:** lokalny plik `dane.json` w AppData (RODO-friendly, w 100% offline)

## Funkcje

- **Lista dzieci** – przegląd dzieci, dodawanie nowych
- **Nowa diagnoza** – formularz z 4 obszarami MEN (fizyczny, emocjonalny, społeczny, poznawczy) i oceną każdego wskaźnika
- **Podgląd/edycja diagnozy** – aktualizacja wcześniej zapisanych diagnoz
- Zapis i odczyt z lokalnych plików JSON przez Tauri fs API

## Wymogi MEN

Aplikacja pokrywa 4 główne obszary z *Informacji o gotowości dziecka do podjęcia nauki w szkole podstawowej*:

1. **Rozwój fizyczny** – motoryka duża/mała, samoobsługa, koordynacja
2. **Rozwój emocjonalny** – rozpoznawanie/kontrolowanie emocji, odporność na stres
3. **Rozwój społeczny** – współpraca, zasady, komunikacja, samodzielność
4. **Rozwój poznawczy** – mowa, percepcja, gotowość do czytania/pisania, matematyka

Każdy wskaźnik oceniany jest na 3-stopniowej skali: **Opanowane / Wspomagane / Wymaga pomocy**.

## Uruchomienie (dev)

### Wymagania

- Node.js ≥ 20
- Rust + Cargo ([rustup.rs](https://rustup.rs/))
- Tauri prerequisites: https://tauri.app/start/prerequisites/

### Kroki

```bash
npm install
npm run tauri dev   # uruchamia aplikację desktopową
```

Frontend (przeglądarka, bez Tauri):

```bash
npm run dev
```

### Budowanie

```bash
npm run tauri build
```

## Struktura projektu

```
src/
├── lib/
│   ├── types.ts        # Typy TypeScript (Dziecko, Diagnoza, KategoriaDiagnozy…)
│   ├── kategorie.ts    # Definicje 4 obszarów MEN z wskaźnikami
│   ├── dataService.ts  # Zapis/odczyt JSON (Tauri fs API)
│   ├── store.ts        # Globalny Svelte store
│   └── mockData.ts     # Przykładowe dane do dev/demo
└── routes/
    ├── +layout.svelte  # Nawigacja (sidebar)
    ├── dzieci/         # Lista dzieci
    └── diagnoza/
        ├── nowa/       # Formularz nowej diagnozy
        └── [id]/       # Podgląd/edycja istniejącej diagnozy
src-tauri/              # Backend Rust (Tauri)
```
