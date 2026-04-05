<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { t } from "svelte-i18n";
  import "$lib/i18n.js";
  import { initStore } from "$lib/store.js";

  let { children } = $props();

  onMount(() => {
    initStore();
  });

  const navItems = [
    { href: "/dzieci", labelKey: "nav.children" },
    { href: "/diagnoza/nowa", labelKey: "nav.newDiagnosis" },
  ];
</script>

<div class="app-shell">
  <aside class="sidebar">
    <div class="logo">
      <span class="logo-icon">📋</span>
      <div class="logo-text">
        <strong>{$t("app.name")}</strong>
        <small>{$t("app.subtitle")}</small>
      </div>
    </div>

    <nav>
      <ul>
        {#each navItems as item}
          <li>
            <a
              href={item.href}
              class:active={$page.url.pathname.startsWith(item.href)}
            >
              {$t(item.labelKey)}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <footer class="sidebar-footer">
      <small>{$t("app.version")}</small>
    </footer>
  </aside>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    font-size: 15px;
    color: #1a1a2e;
    background: #f5f7fa;
    height: 100vh;
    overflow: hidden;
  }

  .app-shell {
    display: flex;
    height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px;
    min-width: 180px;
    background: #1a1a2e;
    color: #cbd5e1;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    flex-shrink: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 1.2rem 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 0.5rem;
  }

  .logo-icon {
    font-size: 1.8rem;
    line-height: 1;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
  }

  .logo-text strong {
    font-size: 1.1rem;
    color: #f1f5f9;
    letter-spacing: 0.02em;
  }

  .logo-text small {
    font-size: 0.68rem;
    color: #94a3b8;
    line-height: 1.3;
  }

  nav ul {
    list-style: none;
    padding: 0 0.5rem;
  }

  nav ul li a {
    display: block;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: background 0.15s, color 0.15s;
  }

  nav ul li a:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
  }

  nav ul li a.active {
    background: #3b82f6;
    color: #fff;
    font-weight: 600;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem 1.2rem 0.5rem;
    color: #475569;
    font-size: 0.75rem;
  }

  /* ── Main content ── */
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }
</style>
