const FAVORITES_KEY = 'mini-ccc-favorites';
type ThemePreference = 'auto' | 'light' | 'dark';
const themePreferences: ThemePreference[] = ['auto', 'light', 'dark'];

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readFavorites() {
  return new Set(readJson<string[]>(FAVORITES_KEY, []));
}

function writeFavorites(favorites: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

function getFavoriteTitles(favorites = readFavorites()) {
  return [...document.querySelectorAll<HTMLElement>('[data-project-card]')]
    .filter((card) => favorites.has(card.dataset.projectId ?? ''))
    .map((card) => card.dataset.projectTitle?.trim() ?? '')
    .filter(Boolean);
}

let toastTimer: number | undefined;

function showToast(message: string) {
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  if (!toast) return;
  if (toastTimer) window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    window.setTimeout(() => { toast.hidden = true; }, 180);
  }, 1800);
}

function animateFavorite(button: HTMLElement) {
  const symbol = button.querySelector<HTMLElement>('.favorite-symbol');
  if (!symbol) return;
  symbol.classList.remove('is-popping');
  void symbol.offsetWidth;
  symbol.classList.add('is-popping');
}

function updateFavoriteUi() {
  const favorites = readFavorites();
  document.querySelectorAll<HTMLElement>('[data-favorite-button]').forEach((button) => {
    const id = button.dataset.favoriteId;
    const saved = Boolean(id && favorites.has(id));
    button.classList.toggle('is-saved', saved);
    const label = button.querySelector('[data-favorite-label]');
    if (label) label.textContent = saved ? 'Saved' : 'Save';
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', saved ? 'Remove from saved builds' : 'Save build');
    const symbol = button.querySelector('.favorite-symbol');
    if (symbol) symbol.textContent = saved ? '♥' : '♡';
  });
  document.querySelectorAll<HTMLElement>('[data-favorite-count]').forEach((element) => {
    element.textContent = String(favorites.size);
  });
}

function applyFilters() {
  const search = document.querySelector<HTMLInputElement>('[data-project-search]')?.value.trim().toLowerCase() ?? '';
  const active = document.querySelector<HTMLElement>('[data-filter-button].is-active')?.dataset.filter ?? 'all';
  const favorites = readFavorites();
  const isSearching = search.length > 0;
  let visible = 0;
  document.querySelectorAll<HTMLElement>('[data-project-card]').forEach((card) => {
    const matchesSearch = !search || `${card.dataset.title} ${card.dataset.summary}`.includes(search);
    const matchesKind = isSearching || active === 'all' || active === 'favorites' ? true : card.dataset.kind === active;
    const matchesFavorites = isSearching || active !== 'favorites' || favorites.has(card.dataset.projectId ?? '');
    const show = matchesSearch && matchesKind && matchesFavorites;
    card.hidden = !show;
    if (show) visible += 1;
  });
  const count = document.querySelector<HTMLElement>('[data-project-count]');
  if (count) count.textContent = `${visible} ${visible === 1 ? 'build' : 'builds'}`;
  const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
  if (empty) empty.hidden = visible > 0;

  const exportPanel = document.querySelector<HTMLElement>('[data-favorite-export-panel]');
  const exportButton = document.querySelector<HTMLButtonElement>('[data-favorite-export]');
  if (exportPanel) exportPanel.hidden = active !== 'favorites';
  if (exportButton) exportButton.disabled = getFavoriteTitles(favorites).length === 0;
}

function exportFavoriteTitles() {
  const titles = getFavoriteTitles();
  const content = titles.length > 0 ? `${titles.join('\n')}\n` : '';
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mini-ccc-favorites.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast(`${titles.length} ${titles.length === 1 ? 'saved title' : 'saved titles'} exported`);
}

function readThemePreference(): ThemePreference {
  const stored = localStorage.getItem('mini-ccc-theme');
  return stored === 'auto' || stored === 'light' || stored === 'dark' ? stored : 'auto';
}

function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'auto') return preference;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function nextThemePreference(preference: ThemePreference): ThemePreference {
  const currentIndex = themePreferences.indexOf(preference);
  return themePreferences[(currentIndex + 1) % themePreferences.length];
}

function setThemePreference(preference: ThemePreference, persist = true) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
  if (persist) {
    try { localStorage.setItem('mini-ccc-theme', preference); } catch {}
  }
  const currentLabel = preference === 'auto' ? 'automatic' : preference;
  const nextPreference = nextThemePreference(preference);
  const nextLabel = nextPreference === 'auto' ? 'automatic mode' : `${nextPreference} mode`;
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `Theme: ${currentLabel}. Switch to ${nextLabel}`);
    button.setAttribute('title', `Theme: ${currentLabel} · next: ${nextLabel}`);
  });
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const favoriteButton = target?.closest<HTMLButtonElement>('[data-favorite-button]');
  if (favoriteButton) {
    event.preventDefault();
    const id = favoriteButton.dataset.favoriteId;
    if (!id) return;
    const favorites = readFavorites();
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    const saved = favorites.has(id);
    writeFavorites(favorites);
    updateFavoriteUi();
    applyFilters();
    animateFavorite(favoriteButton);
    showToast(saved ? 'Added to saved builds' : 'Removed from saved builds');
    return;
  }

  const themeButton = target?.closest<HTMLButtonElement>('[data-theme-toggle]');
  if (themeButton) {
    const current = document.documentElement.dataset.themePreference as ThemePreference;
    setThemePreference(themePreferences.includes(current) ? nextThemePreference(current) : 'auto');
  }

  const exportButton = target?.closest<HTMLButtonElement>('[data-favorite-export]');
  if (exportButton) {
    exportFavoriteTitles();
    return;
  }

  const filterButton = target?.closest<HTMLButtonElement>('[data-filter-button]');
  if (filterButton) {
    document.querySelectorAll('[data-filter-button]').forEach((button) => button.classList.remove('is-active'));
    filterButton.classList.add('is-active');
    applyFilters();
  }
});

document.querySelector<HTMLInputElement>('[data-project-search]')?.addEventListener('input', applyFilters);

const themePreference = readThemePreference();
setThemePreference(themePreference);
const colorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: light)');
colorSchemeQuery?.addEventListener('change', () => {
  if (document.documentElement.dataset.themePreference === 'auto') setThemePreference('auto', false);
});
updateFavoriteUi();
applyFilters();
