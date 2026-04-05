<script lang="ts">
  import { baza, ladowanie } from "$lib/store.js";
  import type { Dziecko, Diagnoza } from "$lib/types.js";
  import { goto } from "$app/navigation";
  import { dodajDziecko, generujId } from "$lib/dataService.js";

  let pokazFormularz = $state(false);
  let noweImie = $state("");
  let noweNazwisko = $state("");
  let nowyRok = $state(new Date().getFullYear() - 6);
  let bladFormularza = $state("");

  function ostatniaDiagnoza(dzieckoId: string): Diagnoza | undefined {
    return $baza.diagnozy
      .filter((d) => d.dzieckoId === dzieckoId)
      .sort(
        (a, b) =>
          new Date(b.dataModyfikacji).getTime() -
          new Date(a.dataModyfikacji).getTime()
      )[0];
  }

  function wiek(rokUrodzenia: number): number {
    return new Date().getFullYear() - rokUrodzenia;
  }

  async function dodaj() {
    bladFormularza = "";
    if (!noweImie.trim() || !noweNazwisko.trim()) {
      bladFormularza = "Imię i nazwisko są wymagane.";
      return;
    }
    if (nowyRok < 2000 || nowyRok > new Date().getFullYear()) {
      bladFormularza = "Podaj prawidłowy rok urodzenia.";
      return;
    }
    const zaktualizowana = await dodajDziecko($baza, {
      imie: noweImie.trim(),
      nazwisko: noweNazwisko.trim(),
      rokUrodzenia: nowyRok,
    });
    baza.set(zaktualizowana);
    noweImie = "";
    noweNazwisko = "";
    nowyRok = new Date().getFullYear() - 6;
    pokazFormularz = false;
  }

  function diagnozaUrl(d: Dziecko) {
    const diag = ostatniaDiagnoza(d.id);
    return diag ? `/diagnoza/${diag.id}` : `/diagnoza/nowa?dzieckoId=${d.id}`;
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Lista dzieci</h1>
      <p class="subtitle">
        {$baza.dzieci.length} {$baza.dzieci.length === 1 ? "dziecko" : "dzieci"}
        w bazie
      </p>
    </div>
    <button class="btn btn-primary" onclick={() => (pokazFormularz = true)}>
      + Dodaj dziecko
    </button>
  </header>

  {#if $ladowanie}
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Wczytywanie danych…</p>
    </div>
  {:else if $baza.dzieci.length === 0}
    <div class="empty-state">
      <span class="empty-icon">👶</span>
      <h2>Brak dzieci</h2>
      <p>Dodaj pierwsze dziecko, aby rozpocząć diagnozę.</p>
      <button class="btn btn-primary" onclick={() => (pokazFormularz = true)}>
        Dodaj pierwsze dziecko
      </button>
    </div>
  {:else}
    <div class="children-grid">
      {#each $baza.dzieci as dziecko (dziecko.id)}
        {@const diag = ostatniaDiagnoza(dziecko.id)}
        <div class="child-card">
          <div class="child-avatar">{dziecko.imie[0]}{dziecko.nazwisko[0]}</div>
          <div class="child-info">
            <h3>{dziecko.imie} {dziecko.nazwisko}</h3>
            <p class="child-meta">
              ur. {dziecko.rokUrodzenia} · {wiek(dziecko.rokUrodzenia)} lat
            </p>
            {#if diag}
              <p class="child-diag">
                Diagnoza: {new Date(diag.dataModyfikacji).toLocaleDateString(
                  "pl-PL"
                )}
              </p>
            {:else}
              <p class="child-diag no-diag">Brak diagnozy</p>
            {/if}
          </div>
          <div class="child-actions">
            <a href={diagnozaUrl(dziecko)} class="btn btn-sm btn-outline">
              {diag ? "Diagnoza" : "Nowa diagnoza"}
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal: Dodaj dziecko -->
{#if pokazFormularz}
  <div
    class="modal-overlay"
    role="button"
    tabindex="-1"
    onclick={() => (pokazFormularz = false)}
    onkeydown={(e) => e.key === "Escape" && (pokazFormularz = false)}
  >
    <div
      class="modal"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="modal-title"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <h2 id="modal-title">Dodaj dziecko</h2>

      {#if bladFormularza}
        <p class="form-error">{bladFormularza}</p>
      {/if}

      <label>
        Imię
        <input type="text" bind:value={noweImie} placeholder="np. Anna" />
      </label>
      <label>
        Nazwisko
        <input type="text" bind:value={noweNazwisko} placeholder="np. Kowalska" />
      </label>
      <label>
        Rok urodzenia
        <input type="number" bind:value={nowyRok} min="2000" max={new Date().getFullYear()} />
      </label>

      <div class="modal-buttons">
        <button class="btn btn-outline" onclick={() => (pokazFormularz = false)}>
          Anuluj
        </button>
        <button class="btn btn-primary" onclick={dodaj}>Dodaj</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page {
    max-width: 900px;
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

  /* Children grid */
  .children-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .child-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: box-shadow 0.15s;
  }

  .child-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .child-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }

  .child-info {
    flex: 1;
    min-width: 0;
  }

  .child-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .child-meta {
    font-size: 0.8rem;
    color: #64748b;
  }

  .child-diag {
    font-size: 0.78rem;
    color: #3b82f6;
    margin-top: 0.2rem;
  }

  .child-diag.no-diag {
    color: #f59e0b;
  }

  .child-actions {
    flex-shrink: 0;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #64748b;
  }

  .empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #334155;
  }

  .empty-state p {
    margin-bottom: 1.5rem;
  }

  /* Spinner */
  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
    color: #64748b;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: #fff;
    border-radius: 14px;
    padding: 2rem;
    width: 380px;
    max-width: 95vw;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal h2 {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }

  .modal label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #374151;
  }

  .modal input {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.15s;
    outline: none;
  }

  .modal input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }

  .form-error {
    background: #fef2f2;
    color: #b91c1c;
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }

  /* Buttons */
  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
    text-decoration: none;
    border: 1.5px solid transparent;
    font-family: inherit;
  }

  :global(.btn-primary) {
    background: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
  }

  :global(.btn-primary:hover) {
    background: #2563eb;
    border-color: #2563eb;
  }

  :global(.btn-outline) {
    background: transparent;
    color: #374151;
    border-color: #d1d5db;
  }

  :global(.btn-outline:hover) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  :global(.btn-sm) {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }
</style>
