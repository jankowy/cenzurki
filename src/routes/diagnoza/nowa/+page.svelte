<script lang="ts">
  import { page } from "$app/stores";
  import { baza, ladowanie } from "$lib/store.js";
  import type { Diagnoza, Status } from "$lib/types.js";
  import { noweKategorie } from "$lib/kategorie.js";
  import { dodajDiagnozę, generujId } from "$lib/dataService.js";
  import { goto } from "$app/navigation";

  // Dziecko wybrane przez parametr URL lub selector
  let dzieckoId = $derived($page.url.searchParams.get("dzieckoId") ?? "");
  let wybraneId = $state("");

  // Sync wybraneId with URL param when it changes
  $effect(() => {
    if (dzieckoId && !wybraneId) {
      wybraneId = dzieckoId;
    }
  });

  let kategorie = $state(noweKategorie());
  let potrzebyRozwojowe = $state("");
  let predyspozycje = $state("");
  let wskazowkiDlaNauczyciela = $state("");
  let zapisywanie = $state(false);
  let sukces = $state(false);
  let blad = $state("");

  const STATUSY: { value: Status; label: string; kolor: string }[] = [
    { value: "opanowane", label: "Opanowane", kolor: "#16a34a" },
    { value: "wspomagane", label: "Wspomagane", kolor: "#d97706" },
    { value: "wymaga pomocy", label: "Wymaga pomocy", kolor: "#dc2626" },
  ];

  async function zapiszDiagnozę() {
    blad = "";
    if (!wybraneId) {
      blad = "Wybierz dziecko.";
      return;
    }
    zapisywanie = true;
    try {
      const teraz = new Date().toISOString();
      const nowaDb = await dodajDiagnozę($baza, {
        dzieckoId: wybraneId,
        dataUtworzenia: teraz,
        dataModyfikacji: teraz,
        rok: new Date().getFullYear(),
        kategorie,
        potrzebyRozwojowe,
        predyspozycje,
        wskazowkiDlaNauczyciela,
      });
      baza.set(nowaDb);
      sukces = true;
      setTimeout(() => goto("/dzieci"), 1500);
    } catch (e) {
      blad = String(e);
    } finally {
      zapisywanie = false;
    }
  }

  function ustawStatus(katId: string, wskaznikId: string, status: Status) {
    kategorie = kategorie.map((k) =>
      k.id === katId
        ? {
            ...k,
            wskazniki: k.wskazniki.map((w) =>
              w.id === wskaznikId ? { ...w, status } : w
            ),
          }
        : k
    );
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Nowa diagnoza</h1>
      <p class="subtitle">Uzupełnij wszystkie obszary rozwoju MEN</p>
    </div>
    <a href="/dzieci" class="btn btn-outline">← Powrót</a>
  </header>

  {#if sukces}
    <div class="alert alert-success">
      ✅ Diagnoza została zapisana! Przekierowuję do listy dzieci…
    </div>
  {:else}
    <!-- Wybór dziecka -->
    <section class="card">
      <h2 class="section-title">Dziecko</h2>
      {#if $baza.dzieci.length === 0}
        <p class="hint">
          Brak dzieci w bazie. <a href="/dzieci">Dodaj najpierw dziecko.</a>
        </p>
      {:else}
        <label class="field-label">
          Wybierz dziecko
          <select bind:value={wybraneId}>
            <option value="">— wybierz —</option>
            {#each $baza.dzieci as d}
              <option value={d.id}>
                {d.imie} {d.nazwisko} (ur. {d.rokUrodzenia})
              </option>
            {/each}
          </select>
        </label>
      {/if}
    </section>

    <!-- 4 kategorie MEN -->
    {#each kategorie as kat (kat.id)}
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

    <!-- Dodatkowe pola tekstowe -->
    <section class="card">
      <h2 class="section-title">Informacje dodatkowe</h2>

      <label class="field-label">
        Potrzeby rozwojowe i edukacyjne (zauważone trudności)
        <textarea
          bind:value={potrzebyRozwojowe}
          rows="3"
          placeholder="Opisz potrzeby wsparcia dziecka…"
        ></textarea>
      </label>

      <label class="field-label">
        Predyspozycje i uzdolnienia (mocne strony)
        <textarea
          bind:value={predyspozycje}
          rows="3"
          placeholder="Opisz mocne strony dziecka…"
        ></textarea>
      </label>

      <label class="field-label">
        Wskazówki dla nauczyciela klasy I
        <textarea
          bind:value={wskazowkiDlaNauczyciela}
          rows="3"
          placeholder="Wskazówki i zalecenia…"
        ></textarea>
      </label>
    </section>

    {#if blad}
      <div class="alert alert-error">{blad}</div>
    {/if}

    <div class="save-row">
      <button
        class="btn btn-primary btn-lg"
        onclick={zapiszDiagnozę}
        disabled={zapisywanie}
      >
        {zapisywanie ? "Zapisywanie…" : "💾 Zapisz diagnozę"}
      </button>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 800px;
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

  /* Card */
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

  /* Wskaźniki */
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

  /* Fields */
  .field-label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .field-label select,
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

  .field-label select:focus,
  .field-label textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .hint {
    font-size: 0.9rem;
    color: #64748b;
  }

  .hint a {
    color: #3b82f6;
    text-decoration: underline;
  }

  /* Alerts */
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

  /* Save row */
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
