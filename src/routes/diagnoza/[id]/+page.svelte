<script lang="ts">
  import { page } from "$app/stores";
  import { baza } from "$lib/store.js";
  import type { Diagnoza, Status } from "$lib/types.js";
  import { aktualizujDiagnozę } from "$lib/dataService.js";
  import { goto } from "$app/navigation";

  let diagId = $derived($page.params.id);

  let diagnoza = $derived<Diagnoza | undefined>(
    $baza.diagnozy.find((d) => d.id === diagId)
  );

  let dziecko = $derived(
    diagnoza ? $baza.dzieci.find((d) => d.id === diagnoza!.dzieckoId) : undefined
  );

  // Lokalna kopia do edycji
  let robocze = $state<Diagnoza | null>(null);

  $effect(() => {
    if (diagnoza && !robocze) {
      robocze = structuredClone(diagnoza);
    }
  });

  let zapisywanie = $state(false);
  let sukces = $state(false);
  let blad = $state("");

  const STATUSY: { value: Status; label: string; kolor: string }[] = [
    { value: "opanowane", label: "Opanowane", kolor: "#16a34a" },
    { value: "wspomagane", label: "Wspomagane", kolor: "#d97706" },
    { value: "wymaga pomocy", label: "Wymaga pomocy", kolor: "#dc2626" },
  ];

  function ustawStatus(katId: string, wskaznikId: string, status: Status) {
    if (!robocze) return;
    robocze = {
      ...robocze,
      kategorie: robocze.kategorie.map((k) =>
        k.id === katId
          ? {
              ...k,
              wskazniki: k.wskazniki.map((w) =>
                w.id === wskaznikId ? { ...w, status } : w
              ),
            }
          : k
      ),
    };
  }

  async function zapisz() {
    if (!robocze) return;
    blad = "";
    zapisywanie = true;
    try {
      const zaktualizowana = {
        ...robocze,
        dataModyfikacji: new Date().toISOString(),
      };
      const nowaDb = await aktualizujDiagnozę($baza, zaktualizowana);
      baza.set(nowaDb);
      sukces = true;
      setTimeout(() => { sukces = false; }, 3000);
    } catch (e) {
      blad = String(e);
    } finally {
      zapisywanie = false;
    }
  }
</script>

<div class="page">
  {#if !diagnoza || !dziecko || !robocze}
    <div class="not-found">
      <p>Nie znaleziono diagnozy.</p>
      <a href="/dzieci" class="btn btn-outline">← Wróć do listy</a>
    </div>
  {:else}
    <header class="page-header">
      <div>
        <h1>Diagnoza: {dziecko.imie} {dziecko.nazwisko}</h1>
        <p class="subtitle">
          Rok szkolny: {diagnoza.rok} · Ostatnia modyfikacja:
          {new Date(diagnoza.dataModyfikacji).toLocaleDateString("pl-PL")}
        </p>
      </div>
      <a href="/dzieci" class="btn btn-outline">← Powrót</a>
    </header>

    {#if sukces}
      <div class="alert alert-success">✅ Zmiany zostały zapisane.</div>
    {/if}

    <!-- 4 kategorie MEN -->
    {#each robocze.kategorie as kat (kat.id)}
      <section class="card">
        <h2 class="section-title kategoria-{kat.id}">{kat.nazwa}</h2>

        <div class="wskazniki">
          {#each kat.wskazniki as w (w.id)}
            <div class="wskaznik">
              <p class="wskaznik-opis">{w.opis}</p>
              <div class="status-buttons">
                {#each STATUSY as s}
                  <button
                    class="status-btn"
                    class:aktywny={w.status === s.value}
                    style:--kolor={s.kolor}
                    onclick={() => ustawStatus(kat.id, w.id, s.value)}
                  >
                    {s.label}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/each}

    <!-- Informacje dodatkowe -->
    <section class="card">
      <h2 class="section-title">Informacje dodatkowe</h2>

      <label class="field-label">
        Potrzeby rozwojowe i edukacyjne (zauważone trudności)
        <textarea
          bind:value={robocze.potrzebyRozwojowe}
          rows="3"
        ></textarea>
      </label>

      <label class="field-label">
        Predyspozycje i uzdolnienia (mocne strony)
        <textarea bind:value={robocze.predyspozycje} rows="3"></textarea>
      </label>

      <label class="field-label">
        Wskazówki dla nauczyciela klasy I
        <textarea
          bind:value={robocze.wskazowkiDlaNauczyciela}
          rows="3"
        ></textarea>
      </label>
    </section>

    {#if blad}
      <div class="alert alert-error">{blad}</div>
    {/if}

    <div class="save-row">
      <button
        class="btn btn-primary btn-lg"
        onclick={zapisz}
        disabled={zapisywanie}
      >
        {zapisywanie ? "Zapisywanie…" : "💾 Zapisz zmiany"}
      </button>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 800px;
  }

  .not-found {
    padding: 3rem;
    text-align: center;
    color: #64748b;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.8rem;
    gap: 1rem;
  }

  h1 {
    font-size: 1.6rem;
    color: #1a1a2e;
    margin-bottom: 0.15rem;
  }

  .subtitle {
    color: #64748b;
    font-size: 0.9rem;
  }

  .card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
    margin-bottom: 1.2rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid;
  }

  .section-title.kategoria-fizyczny { border-color: #3b82f6; color: #1d4ed8; }
  .section-title.kategoria-emocjonalny { border-color: #f59e0b; color: #b45309; }
  .section-title.kategoria-spoleczny { border-color: #10b981; color: #065f46; }
  .section-title.kategoria-poznawczy { border-color: #8b5cf6; color: #6d28d9; }

  .wskazniki {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .wskaznik {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .wskaznik-opis {
    flex: 1;
    min-width: 200px;
    font-size: 0.9rem;
    color: #334155;
    line-height: 1.45;
  }

  .status-buttons {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .status-btn {
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    border: 1.5px solid var(--kolor);
    background: transparent;
    color: var(--kolor);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    font-family: inherit;
  }

  .status-btn:hover {
    background: color-mix(in srgb, var(--kolor) 10%, transparent);
  }

  .status-btn.aktywny {
    background: var(--kolor);
    color: #fff;
  }

  .field-label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .field-label textarea {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.55rem 0.8rem;
    font-size: 0.9rem;
    font-family: inherit;
    transition: border-color 0.15s;
    outline: none;
    resize: vertical;
  }

  .field-label textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .alert {
    border-radius: 8px;
    padding: 0.9rem 1.2rem;
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .alert-success {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .alert-error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  .save-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
  }

  :global(.btn-lg) {
    padding: 0.75rem 1.8rem;
    font-size: 1rem;
  }
</style>
