# Cenzurki – Diagnoza Dojrzałości Szkolnej

Lekka aplikacja desktopowa dla nauczycieli przedszkola do prowadzenia i dokumentowania diagnoz dojrzałości szkolnej dzieci, zgodna z polskimi wymogami MEN.

## Stack technologiczny

- **Desktop:** [Tauri v2](https://tauri.app/) (Rust backend, natywne WebView – kilka MB zamiast 150 MB+ Electrona)
- **Frontend:** [SvelteKit](https://kit.svelte.dev/) + [Vite](https://vite.dev/) (TypeScript)
- **Internacjonalizacja:** [svelte-i18n](https://github.com/kaisermann/svelte-i18n) – kod po angielsku, interfejs po polsku
- **Dane:** lokalny plik `data.json` w AppData (RODO-friendly, w 100% offline)
- **PDF:** [jsPDF](https://github.com/parallax/jsPDF) – generowanie wydruków zgodnych z szablonem MEN

## Zasady projektu

- Kod (zmienne, typy, funkcje) **wyłącznie po angielsku**.
- Wszystkie teksty interfejsu **wyłącznie po polsku** przez `svelte-i18n` (`src/locales/pl.json`).
- Aplikacja jest **w 100% offline** – brak serwera, brak chmury. Dane zapisywane lokalnie w JSON (RODO/GDPR).
- Generowanie PDF zgodne z oficjalnym drukiem MEN.

## Funkcje

- **Lista dzieci** – przegląd dzieci, dodawanie nowych
- **Typy diagnoz** – diagnoza wstępna (`INITIAL`), informacja o gotowości szkolnej (`FINAL`), obserwacja bieżąca (`SHORT`)
- **Nowa diagnoza** – formularz z 4 obszarami MEN i oceną każdego wskaźnika na 3-stopniowej skali
- **Kreator opinii** – automatyczne wstawianie gotowych zdań po wyborze oceny (bank szablonów w `pl.json`)
- **Podgląd/edycja diagnozy** – aktualizacja wcześniej zapisanych diagnoz
- **Generowanie PDF** – wydruk zgodny z szablonem MEN (w trakcie rozbudowy)
- Zapis i odczyt z lokalnych plików JSON przez Tauri fs API

## Wymogi MEN

Aplikacja pokrywa 4 główne obszary z *Informacji o gotowości dziecka do podjęcia nauki w szkole podstawowej* (załącznik nr 3 do rozporządzenia MEN):

1. **Rozwój fizyczny** (`PHYSICAL`) – motoryka duża/mała, samoobsługa, koordynacja wzrokowo-ruchowa
2. **Rozwój emocjonalny** (`EMOTIONAL`) – rozpoznawanie/kontrolowanie emocji, odporność na stres
3. **Rozwój społeczny** (`SOCIAL`) – współpraca, zasady grupowe, komunikacja, samodzielność
4. **Rozwój poznawczy** (`COGNITIVE`) – mowa, percepcja wzrokowa/słuchowa, gotowość do czytania/pisania, matematyka

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

Frontend w przeglądarce (bez Tauri, dane mockowane):

```bash
npm run dev
```

### Budowanie

```bash
npm run tauri build
```

### Wydania (CI/CD)

Pipeline `.github/workflows/release.yml` buduje automatycznie pliki instalacyjne po wypchnięciu taga `v*`:

- **Windows:** `.exe` (NSIS installer)
- **macOS:** `.dmg` (Universal / Apple Silicon + Intel)

## Struktura projektu

```
src/
├── lib/
│   ├── types.ts          # Typy TypeScript (English: Child, Diagnosis, DiagnosisType…)
│   ├── categories.ts     # Definicje 4 obszarów MEN z identyfikatorami wskaźników
│   ├── dataService.ts    # Zapis/odczyt JSON (Tauri fs API) + fallback mockowy
│   ├── store.ts          # Globalny Svelte store (database, isLoading, error)
│   ├── i18n.ts           # Konfiguracja svelte-i18n (synchronous addMessages)
│   └── mockData.ts       # Przykładowe dane do dev/demo
├── locales/
│   └── pl.json           # Wszystkie polskie teksty + opisy wskaźników + szablony opinii
└── routes/
    ├── +layout.svelte    # Nawigacja (sidebar)
    ├── dzieci/           # Lista dzieci
    └── diagnoza/
        ├── nowa/         # Formularz nowej diagnozy
        └── [id]/         # Podgląd/edycja istniejącej diagnozy
src-tauri/                # Backend Rust (Tauri v2)
├── src/lib.rs            # Rejestracja pluginów (fs, opener)
├── Cargo.toml
├── tauri.conf.json
└── capabilities/
    └── default.json      # Uprawnienia Tauri (fs read/write do AppData)
```
