<script lang="ts">
  import { database, isLoading } from "$lib/store.js";
  import type { Child, Diagnosis } from "$lib/types.js";
  import { addChild } from "$lib/dataService.js";
  import { t } from "svelte-i18n";

  let showForm = $state(false);
  let newFirstName = $state("");
  let newLastName = $state("");
  let newBirthYear = $state(new Date().getFullYear() - 6);
  let formError = $state("");

  function latestDiagnosis(childId: string): Diagnosis | undefined {
    return $database.diagnoses
      .filter((d) => d.childId === childId)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )[0];
  }

  function age(birthYear: number): number {
    return new Date().getFullYear() - birthYear;
  }

  function childCount(n: number): string {
    if (n === 1) return $t("children.countSingular");
    return $t("children.countPlural", { values: { count: n } });
  }

  async function addChildHandler() {
    formError = "";
    if (!newFirstName.trim() || !newLastName.trim()) {
      formError = $t("addChildForm.error.nameRequired");
      return;
    }
    if (newBirthYear < 2000 || newBirthYear > new Date().getFullYear()) {
      formError = $t("addChildForm.error.invalidYear");
      return;
    }
    const updated = await addChild($database, {
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      birthYear: newBirthYear,
    });
    database.set(updated);
    newFirstName = "";
    newLastName = "";
    newBirthYear = new Date().getFullYear() - 6;
    showForm = false;
  }

  function diagnosisUrl(child: Child) {
    const diag = latestDiagnosis(child.id);
    return diag ? `/diagnoza/${diag.id}` : `/diagnoza/nowa?dzieckoId=${child.id}`;
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>{$t("children.title")}</h1>
      <p class="subtitle">{childCount($database.children.length)}</p>
    </div>
    <button class="btn btn-primary" onclick={() => (showForm = true)}>
      {$t("children.addChild")}
    </button>
  </header>

  {#if $isLoading}
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>{$t("children.loading")}</p>
    </div>
  {:else if $database.children.length === 0}
    <div class="empty-state">
      <span class="empty-icon">👶</span>
      <h2>{$t("children.empty.title")}</h2>
      <p>{$t("children.empty.desc")}</p>
      <button class="btn btn-primary" onclick={() => (showForm = true)}>
        {$t("children.addFirst")}
      </button>
    </div>
  {:else}
    <div class="children-grid">
      {#each $database.children as child (child.id)}
        {@const diag = latestDiagnosis(child.id)}
        <div class="child-card">
          <div class="child-avatar">{child.firstName[0]}{child.lastName[0]}</div>
          <div class="child-info">
            <h3>{child.firstName} {child.lastName}</h3>
            <p class="child-meta">
              {$t("children.born")} {child.birthYear} · {age(child.birthYear)} {$t("children.age")}
            </p>
            {#if diag}
              <p class="child-diag">
                {$t("children.diagnosis")}: {new Date(diag.updatedAt).toLocaleDateString("pl-PL")}
              </p>
            {:else}
              <p class="child-diag no-diag">{$t("children.noDiagnosis")}</p>
            {/if}
          </div>
          <div class="child-actions">
            <a href={diagnosisUrl(child)} class="btn btn-sm btn-outline">
              {diag ? $t("children.diagnosis") : $t("children.newDiagnosis")}
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal: Add child -->
{#if showForm}
  <div
    class="modal-overlay"
    role="button"
    tabindex="-1"
    onclick={() => (showForm = false)}
    onkeydown={(e) => e.key === "Escape" && (showForm = false)}
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
      <h2 id="modal-title">{$t("addChildForm.title")}</h2>

      {#if formError}
        <p class="form-error">{formError}</p>
      {/if}

      <label>
        {$t("addChildForm.firstName")}
        <input type="text" bind:value={newFirstName} placeholder={$t("addChildForm.firstNamePlaceholder")} />
      </label>
      <label>
        {$t("addChildForm.lastName")}
        <input type="text" bind:value={newLastName} placeholder={$t("addChildForm.lastNamePlaceholder")} />
      </label>
      <label>
        {$t("addChildForm.birthYear")}
        <input type="number" bind:value={newBirthYear} min="2000" max={new Date().getFullYear()} />
      </label>

      <div class="modal-buttons">
        <button class="btn btn-outline" onclick={() => (showForm = false)}>
          {$t("addChildForm.cancel")}
        </button>
        <button class="btn btn-primary" onclick={addChildHandler}>{$t("addChildForm.add")}</button>
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
