<script lang="ts">
  import { page } from "$app/stores";
  import { database } from "$lib/store.js";
  import type { Diagnosis, SkillLevel } from "$lib/types.js";
  import { updateDiagnosis } from "$lib/dataService.js";
  import { goto } from "$app/navigation";
  import { t } from "svelte-i18n";

  let diagId = $derived($page.params.id);

  let diagnosis = $derived<Diagnosis | undefined>(
    $database.diagnoses.find((d) => d.id === diagId)
  );

  let child = $derived(
    diagnosis ? $database.children.find((c) => c.id === diagnosis!.childId) : undefined
  );

  // Local working copy for editing
  let draft = $state<Diagnosis | null>(null);

  $effect(() => {
    if (diagnosis && !draft) {
      draft = structuredClone(diagnosis);
    }
  });

  let isSaving = $state(false);
  let isSuccess = $state(false);
  let errorMessage = $state("");

  const SKILL_LEVELS: { value: SkillLevel; color: string }[] = [
    { value: "MASTERED", color: "#16a34a" },
    { value: "SUPPORTED", color: "#d97706" },
    { value: "NEEDS_HELP", color: "#dc2626" },
  ];

  function getTemplate(indicatorId: string, level: SkillLevel): string {
    const key = `templates.${indicatorId}.${level}`;
    const result = $t(key);
    return result !== key ? result : "";
  }

  function setSkillLevel(catIndex: number, indIndex: number, level: SkillLevel) {
    if (!draft) return;
    const indicator = draft.categories[catIndex].indicators[indIndex];
    const template = getTemplate(indicator.id, level);
    draft = {
      ...draft,
      categories: draft.categories.map((cat, ci) =>
        ci === catIndex
          ? {
              ...cat,
              indicators: cat.indicators.map((ind, ii) =>
                ii === indIndex
                  ? { ...ind, skillLevel: level, notes: template || ind.notes || "" }
                  : ind
              ),
            }
          : cat
      ),
    };
  }

  async function save() {
    if (!draft) return;
    errorMessage = "";
    isSaving = true;
    try {
      const updated = {
        ...draft,
        updatedAt: new Date().toISOString(),
      };
      const updatedDb = await updateDiagnosis($database, updated);
      database.set(updatedDb);
      isSuccess = true;
      setTimeout(() => { isSuccess = false; }, 3000);
    } catch (e) {
      errorMessage = String(e);
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="page">
  {#if !diagnosis || !child || !draft}
    <div class="not-found">
      <p>{$t("diagnosis.notFound")}</p>
      <a href="/dzieci" class="btn btn-outline">{$t("diagnosis.backToListFull")}</a>
    </div>
  {:else}
    <header class="page-header">
      <div>
        <h1>{$t("diagnosis.editTitle")}: {child.firstName} {child.lastName}</h1>
        <p class="subtitle">
          {$t("diagnosis.schoolYear")}: {diagnosis.year} ·
          {$t("diagnosis.lastModified")}:
          {new Date(diagnosis.updatedAt).toLocaleDateString("pl-PL")}
          · {$t(`diagnosis.types.${diagnosis.type}`)}
        </p>
      </div>
      <a href="/dzieci" class="btn btn-outline">{$t("diagnosis.backToList")}</a>
    </header>

    {#if isSuccess}
      <div class="alert alert-success">{$t("diagnosis.changesSaved")}</div>
    {/if}

    <!-- 4 MEN development categories -->
    {#each draft.categories as cat, catIndex (cat.area)}
      <section class="card">
        <h2 class="section-title area-{cat.area.toLowerCase()}">{$t(`areas.${cat.area}`)}</h2>

        <div class="indicators">
          {#each cat.indicators as ind, indIndex (ind.id)}
            <div class="indicator">
              <p class="indicator-desc">{$t(`indicators.${ind.id}`)}</p>
              <div class="skill-buttons">
                {#each SKILL_LEVELS as sl}
                  <button
                    class="skill-btn"
                    class:active={ind.skillLevel === sl.value}
                    style:--color={sl.color}
                    onclick={() => setSkillLevel(catIndex, indIndex, sl.value)}
                  >
                    {$t(`skillLevels.${sl.value}`)}
                  </button>
                {/each}
              </div>
              {#if ind.skillLevel !== null}
                <textarea
                  class="notes-field"
                  rows="2"
                  placeholder={$t("diagnosis.notesPlaceholder")}
                  bind:value={draft.categories[catIndex].indicators[indIndex].notes}
                ></textarea>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/each}

    <!-- Additional information -->
    <section class="card">
      <h2 class="section-title">{$t("diagnosis.additionalInfo")}</h2>

      <label class="field-label">
        {$t("diagnosis.developmentalNeeds")}
        <textarea bind:value={draft.developmentalNeeds} rows="3"></textarea>
      </label>

      <label class="field-label">
        {$t("diagnosis.strengths")}
        <textarea bind:value={draft.strengths} rows="3"></textarea>
      </label>

      <label class="field-label">
        {$t("diagnosis.teacherNotes")}
        <textarea bind:value={draft.teacherNotes} rows="3"></textarea>
      </label>
    </section>

    {#if errorMessage}
      <div class="alert alert-error">{errorMessage}</div>
    {/if}

    <div class="save-row">
      <button
        class="btn btn-primary btn-lg"
        onclick={save}
        disabled={isSaving}
      >
        {isSaving ? $t("diagnosis.saving") : $t("diagnosis.saveChanges")}
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

  .section-title.area-physical { border-color: #3b82f6; color: #1d4ed8; }
  .section-title.area-emotional { border-color: #f59e0b; color: #b45309; }
  .section-title.area-social { border-color: #10b981; color: #065f46; }
  .section-title.area-cognitive { border-color: #8b5cf6; color: #6d28d9; }

  .indicators {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .indicator {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .indicator-desc {
    font-size: 0.9rem;
    color: #334155;
    line-height: 1.45;
  }

  .skill-buttons {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .skill-btn {
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    border: 1.5px solid var(--color);
    background: transparent;
    color: var(--color);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    font-family: inherit;
  }

  .skill-btn:hover {
    background: color-mix(in srgb, var(--color) 10%, transparent);
  }

  .skill-btn.active {
    background: var(--color);
    color: #fff;
  }

  .notes-field {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }

  .notes-field:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
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
