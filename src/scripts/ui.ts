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

function initBuildArtLoaders() {
  document.querySelectorAll<HTMLElement>('[data-build-art]').forEach((container) => {
    const image = container.querySelector('img');
    if (!image) {
      container.classList.remove('build-art--loading');
      return;
    }

    const finishLoading = () => container.classList.remove('build-art--loading');
    if (image.complete) finishLoading();
    else {
      image.addEventListener('load', finishLoading, { once: true });
      image.addEventListener('error', finishLoading, { once: true });
    }
  });
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
    if (label) label.textContent = 'Favorite';
    button.setAttribute('aria-pressed', String(saved));
    const title = button.dataset.favoriteTitle ?? 'build';
    button.setAttribute('aria-label', saved ? `Remove ${title} from favorites` : `Favorite ${title}`);
    const symbol = button.querySelector('.favorite-symbol');
    if (symbol) symbol.classList.toggle('is-filled', saved);
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

type ScheduleBlock = { label: string; start: number; duration: number };
const SLOT_COUNT = 24;

function formatScheduleTime(slot: number) {
  const totalMinutes = 10 * 60 + slot * 30;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

function getScheduleState(): ScheduleBlock[] {
  return [...document.querySelectorAll<HTMLElement>('[data-schedule-block]')]
    .map((element) => ({
      label: element.dataset.label ?? 'Activity',
      start: Number(element.dataset.start),
      duration: Number(element.dataset.duration),
    }));
}

function exportSchedule() {
  const blocks = getScheduleState().sort((a, b) => a.start - b.start);
  const lines = ['MINI CCC AGENDA', '10:00—22:00', ''];
  let cursor = 0;
  blocks.forEach((block) => {
    if (block.start > cursor) {
      lines.push(`${formatScheduleTime(cursor)}—${formatScheduleTime(block.start)}  Open time`);
    }
    lines.push(`${formatScheduleTime(block.start)}—${formatScheduleTime(block.start + block.duration)}  ${block.label}`);
    cursor = block.start + block.duration;
  });
  if (cursor < SLOT_COUNT) lines.push(`${formatScheduleTime(cursor)}—${formatScheduleTime(SLOT_COUNT)}  Open time`);
  const file = new Blob([`${lines.join('\n')}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mini-ccc-agenda.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast('Agenda exported as TXT');
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

function initCocktailIngredients() {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-cocktail-card]')];
  const summary = document.querySelector<HTMLElement>('[data-ingredient-summary]');
  const content = summary?.querySelector<HTMLElement>('[data-ingredient-summary-content]');
  const countLabel = summary?.querySelector<HTMLElement>('[data-ingredient-summary-count]');
  if (!summary || !content || !countLabel || cards.length === 0) return;

  const render = () => {
    const selected = cards.filter((card) => card.dataset.selected === 'true');
    cards.forEach((card) => {
      const button = card.querySelector<HTMLButtonElement>('[data-cocktail-select]');
      const isSelected = card.dataset.selected === 'true';
      card.classList.toggle('is-selected', isSelected);
      button?.setAttribute('aria-pressed', String(isSelected));
      const label = button?.querySelector<HTMLElement>('[data-cocktail-select-label]');
      if (label) label.textContent = isSelected ? 'Added to ingredient list' : 'Add to ingredient list';
    });

    countLabel.textContent = selected.length === 0
      ? 'No cocktails selected yet.'
      : `${selected.length} ${selected.length === 1 ? 'cocktail' : 'cocktails'} selected.`;
    const selectAll = summary.querySelector<HTMLButtonElement>('[data-select-all]');
    const deselectAll = summary.querySelector<HTMLButtonElement>('[data-deselect-all]');
    if (selectAll) selectAll.disabled = selected.length === cards.length;
    if (deselectAll) deselectAll.disabled = selected.length === 0;

    content.replaceChildren();
    if (selected.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'ingredient-summary__empty';
      empty.textContent = 'Choose cocktails above to build your ingredient list.';
      content.append(empty);
      return;
    }

    const ingredients = new Map<string, number>();
    selected.forEach((card) => {
      let recipeIngredients: string[] = [];
      try { recipeIngredients = JSON.parse(card.dataset.ingredients ?? '[]') as string[]; } catch {}
      recipeIngredients.forEach((ingredient) => ingredients.set(ingredient, (ingredients.get(ingredient) ?? 0) + 1));
    });
    const list = document.createElement('ul');
    list.className = 'ingredient-summary__list';
    [...ingredients.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([ingredient, recipeCount]) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'ingredient-summary__name';
      name.textContent = ingredient;
      const usage = document.createElement('span');
      usage.className = 'ingredient-summary__usage';
      usage.textContent = `in ${recipeCount} ${recipeCount === 1 ? 'recipe' : 'recipes'}`;
      item.append(name, usage);
      list.append(item);
    });
    content.append(list);
  };

  summary.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-select-all]')) {
      cards.forEach((card) => { card.dataset.selected = 'true'; });
      render();
    } else if (target?.closest('[data-deselect-all]')) {
      cards.forEach((card) => { card.dataset.selected = 'false'; });
      render();
    }
  });
  cards.forEach((card) => card.querySelector('[data-cocktail-select]')?.addEventListener('click', () => {
    card.dataset.selected = card.dataset.selected === 'true' ? 'false' : 'true';
    render();
  }));
  render();
}

function applyCocktailFilter(filter: string) {
  document.querySelectorAll<HTMLElement>('[data-cocktail-card]').forEach((card) => {
    const alcoholFree = card.dataset.alcoholFree === 'true';
    card.hidden = filter === 'with-alcohol'
      ? alcoholFree
      : filter === 'without-alcohol' && !alcoholFree;
  });
}

function initCocktailFilters() {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-cocktail-filter]')];
  if (buttons.length === 0) return;
  applyCocktailFilter(buttons.find((button) => button.classList.contains('is-active'))?.dataset.cocktailFilter ?? 'all');
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
    showToast(saved ? 'Added to favorites' : 'Removed from favorites');
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

  if (target?.closest('[data-export-schedule]')) {
    exportSchedule();
    return;
  }

  const filterButton = target?.closest<HTMLButtonElement>('[data-filter-button]');
  if (filterButton) {
    document.querySelectorAll('[data-filter-button]').forEach((button) => button.classList.remove('is-active'));
    filterButton.classList.add('is-active');
    applyFilters();
  }

  const cocktailFilter = target?.closest<HTMLButtonElement>('[data-cocktail-filter]');
  if (cocktailFilter) {
    const filterGroup = cocktailFilter.closest('[role="group"]');
    filterGroup?.querySelectorAll<HTMLButtonElement>('[data-cocktail-filter]').forEach((button) => {
      const active = button === cocktailFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyCocktailFilter(cocktailFilter.dataset.cocktailFilter ?? 'all');
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
initBuildArtLoaders();
initCocktailIngredients();
initCocktailFilters();
