# Cenzurki – AI Coding Instructions

## Project Overview

**Cenzurki** is an offline desktop application for Polish kindergarten/preschool teachers to assess and document children's school readiness (*diagnoza dojrzałości szkolnej*) in compliance with Polish MEN (Ministry of Education) regulations.

**Tech stack:** Tauri v2 (Rust backend) + SvelteKit (TypeScript frontend) + svelte-i18n

---

## Core Rules

### Language

- **All code must be in English:** variable names, function names, type names, file names, comments, and Git commit messages.
- **All UI text must be in Polish**, served through `svelte-i18n`. Never hardcode Polish text in `.svelte` files — always use the `$t("key")` function.
- Polish translations live in `src/locales/pl.json`. Add new keys there when introducing new UI text.

### Architecture

- **Strictly offline.** There is no server, no cloud, no network calls. All data is stored locally on the teacher's computer.
- Data is persisted as a single JSON file (`data.json`) in the system `AppData` directory, using `@tauri-apps/plugin-fs`. This satisfies GDPR/RODO requirements (the teacher owns their data, it never leaves their machine).
- The Svelte store (`src/lib/store.ts`) holds the global in-memory database loaded at startup via `initStore()`. Write operations go through `dataService.ts` which calls Tauri's fs API.
- In browser-only dev mode (without Tauri), `dataService.ts` falls back to mock data.

### Data Model

All types are defined in `src/lib/types.ts` (English names):

| Type | Description |
|------|-------------|
| `Child` | A child's personal data |
| `Diagnosis` | One assessment sheet for a child |
| `DiagnosisType` | `INITIAL` / `FINAL` / `SHORT` |
| `DevelopmentArea` | `PHYSICAL` / `EMOTIONAL` / `SOCIAL` / `COGNITIVE` |
| `SkillLevel` | `MASTERED` / `SUPPORTED` / `NEEDS_HELP` |
| `DiagnosisCategory` | One MEN area with its indicators |
| `Database` | Root JSON structure stored on disk |

### MEN Compliance

The app follows the official MEN document *"Informacja o gotowości dziecka do podjęcia nauki w szkole podstawowej"* (Annex 3 to the MEN regulation). The four development areas with their indicators must remain structurally consistent with this document.

PDF generation must follow the MEN template layout. The PDF feature is in progress — use `jspdf` for PDF generation.

---

## File Structure

```
src/
├── lib/
│   ├── types.ts          # TypeScript types (English)
│   ├── categories.ts     # 4 MEN areas with indicator IDs
│   ├── dataService.ts    # Tauri fs read/write + helper functions
│   ├── store.ts          # Svelte writable stores + initStore()
│   ├── i18n.ts           # svelte-i18n setup (synchronous addMessages)
│   └── mockData.ts       # Mock data for browser dev mode
├── locales/
│   └── pl.json           # All Polish UI strings + indicator descriptions + response templates
└── routes/
    ├── +layout.svelte    # App shell with sidebar navigation
    ├── +layout.ts        # SvelteKit layout config
    ├── dzieci/           # Children list view
    └── diagnoza/
        ├── nowa/         # New diagnosis form
        └── [id]/         # Edit existing diagnosis
src-tauri/
├── src/lib.rs            # Tauri app setup (registers tauri-plugin-fs, tauri-plugin-opener)
├── Cargo.toml            # Rust dependencies
├── tauri.conf.json       # Tauri config (productName, identifier, window size)
└── capabilities/
    └── default.json      # Tauri capability permissions (fs:allow-app-read/write)
```

---

## i18n Conventions

- Translation keys use dot notation: `"area.subkey"`, e.g. `"diagnosis.types.INITIAL"`.
- Indicator descriptions: `"indicators.physical_1"`, etc.
- Response templates (auto-fill text based on SkillLevel): `"templates.physical_1.MASTERED"`, etc.
- Import `$lib/i18n.js` in `+layout.svelte` before using `$t()` anywhere.

---

## Do Not

- Do **not** add any backend server, REST API, or cloud storage.
- Do **not** hardcode Polish text in Svelte components.
- Do **not** use Polish words for variable/function/type names.
- Do **not** store sensitive data outside the local `AppData` folder.
- Do **not** remove or rename existing i18n keys without updating all usages.
