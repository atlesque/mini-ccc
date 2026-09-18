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

type ScheduleBlock = { id: string; start: number; duration: number };
const AGENDA_KEY = 'mini-ccc-agenda';
const SLOT_COUNT = 24;
const MIN_DURATION = 1;
const MAX_DURATION = 8;

function formatScheduleTime(slot: number) {
  const totalMinutes = 10 * 60 + slot * 30;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

function getScheduleElements() {
  return [...document.querySelectorAll<HTMLElement>('[data-schedule-block]')];
}

function getScheduleState(): ScheduleBlock[] {
  return getScheduleElements()
    .filter((element) => element.dataset.active !== 'false')
    .map((element) => ({ id: element.dataset.blockId ?? '', start: Number(element.dataset.start), duration: Number(element.dataset.duration) }));
}

function isValidSchedule(blocks: ScheduleBlock[], knownIds: Set<string>) {
  if (blocks.length > knownIds.size || new Set(blocks.map((block) => block.id)).size !== blocks.length) return false;
  if (blocks.some((block) => !knownIds.has(block.id) || !Number.isInteger(block.start) || !Number.isInteger(block.duration) || block.start < 0 || block.duration < MIN_DURATION || block.duration > MAX_DURATION || block.start + block.duration > SLOT_COUNT)) return false;
  return blocks.every((block, index) => blocks.slice(index + 1).every((other) => block.start + block.duration <= other.start || other.start + other.duration <= block.start));
}

function updateScheduleBlock(element: HTMLElement, start: number, duration: number) {
  element.dataset.start = String(start);
  element.dataset.duration = String(duration);
  element.style.setProperty('--start', String(start));
  element.style.setProperty('--span', String(duration));
  const time = element.querySelector<HTMLElement>('.schedule-block__time');
  if (time) time.textContent = `${formatScheduleTime(start)}—${formatScheduleTime(start + duration)}`;
}

function renderSchedule() {
  const grid = document.querySelector<HTMLElement>('[data-schedule-grid]');
  if (!grid) return;
  const blocks = getScheduleState();
  const usedIds = new Set(blocks.map((block) => block.id));
  getScheduleElements().forEach((element) => {
    const state = blocks.find((block) => block.id === element.dataset.blockId);
    element.hidden = !state;
    if (state) updateScheduleBlock(element, state.start, state.duration);
  });
  document.querySelectorAll<HTMLElement>('[data-palette-block]').forEach((element) => {
    element.hidden = usedIds.has(element.dataset.blockId ?? '');
  });
  const lunch = grid.querySelector<HTMLElement>('.schedule-lunch');
  if (lunch) lunch.hidden = blocks.some((block) => block.start < 6 && block.start + block.duration > 4);
  const hint = grid.querySelector<HTMLElement>('[data-schedule-drop-hint]');
  if (hint) hint.hidden = blocks.length > 0;
}

function setScheduleStatus(label: string) {
  const status = document.querySelector<HTMLElement>('[data-schedule-status]');
  if (status) status.textContent = label;
}

function canPlaceScheduleBlock(candidate: ScheduleBlock, current: ScheduleBlock[]) {
  return isValidSchedule([...current.filter((block) => block.id !== candidate.id), candidate], new Set([...current.map((block) => block.id), candidate.id]));
}

function scheduleDropSlot(event: DragEvent, grid: HTMLElement) {
  const rect = grid.getBoundingClientRect();
  return Math.max(0, Math.min(SLOT_COUNT - 1, Math.floor(((event.clientY - rect.top) / rect.height) * SLOT_COUNT)));
}

function exportSchedule() {
  const blocks = getScheduleState().sort((a, b) => a.start - b.start);
  const labels = new Map(getScheduleElements().map((element) => [element.dataset.blockId, element.dataset.label ?? 'Activity']));
  const lines = ['MINI CCC AGENDA', '10:00—22:00', ''];
  let cursor = 0;
  blocks.forEach((block) => {
    if (block.start > cursor) {
      const gapLabel = cursor === 4 && block.start >= 6 ? 'Lunch / open time' : 'Open time';
      lines.push(`${formatScheduleTime(cursor)}—${formatScheduleTime(block.start)}  ${gapLabel}`);
    }
    lines.push(`${formatScheduleTime(block.start)}—${formatScheduleTime(block.start + block.duration)}  ${labels.get(block.id) ?? 'Activity'}`);
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

function initSchedule() {
  const grid = document.querySelector<HTMLElement>('[data-schedule-grid]');
  if (!grid) return;
  const paletteElements = [...document.querySelectorAll<HTMLElement>('[data-palette-block]')];
  const knownIds = new Set(paletteElements.map((element) => element.dataset.blockId ?? ''));
  const defaultState = getScheduleState();
  const storedAgenda = localStorage.getItem(AGENDA_KEY);
  const savedState = storedAgenda ? readJson<ScheduleBlock[]>(AGENDA_KEY, []) : null;
  if (savedState && isValidSchedule(savedState, knownIds)) {
    getScheduleElements().forEach((element) => {
      const state = savedState.find((block) => block.id === element.dataset.blockId);
      element.dataset.active = state ? 'true' : 'false';
      if (state) updateScheduleBlock(element, state.start, state.duration);
    });
    const status = document.querySelector<HTMLElement>('[data-schedule-status]');
    if (status) status.textContent = 'SAVED AGENDA';
  }
  renderSchedule();

  const getDraggedId = (event: DragEvent) => event.dataTransfer?.getData('text/plain') ?? '';
  document.addEventListener('dragstart', (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-palette-block], [data-schedule-block]') : null;
    if (!target || target.hidden) return;
    event.dataTransfer?.setData('text/plain', target.dataset.blockId ?? '');
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    target.classList.add('is-dragging');
  });
  document.addEventListener('dragend', (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-palette-block], [data-schedule-block]') : null;
    target?.classList.remove('is-dragging');
    grid.classList.remove('is-drag-over');
  });
  grid.addEventListener('dragover', (event) => { event.preventDefault(); grid.classList.add('is-drag-over'); });
  grid.addEventListener('dragleave', (event) => { if (event.target === grid) grid.classList.remove('is-drag-over'); });
  grid.addEventListener('drop', (event) => {
    event.preventDefault();
    grid.classList.remove('is-drag-over');
    const id = getDraggedId(event);
    if (!id) return;
    const current = getScheduleState();
    const existing = current.find((block) => block.id === id);
    const candidate = { id, start: scheduleDropSlot(event, grid), duration: existing?.duration ?? 2 };
    if (!canPlaceScheduleBlock(candidate, current)) { showToast('That block would overlap another one'); return; }
    const element = getScheduleElements().find((item) => item.dataset.blockId === id);
    if (!element) return;
    element.dataset.active = 'true';
    updateScheduleBlock(element, candidate.start, candidate.duration);
    renderSchedule();
    setScheduleStatus('UNSAVED CHANGES');
  });

  document.addEventListener('pointerdown', (event) => {
    const handle = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-resize]') : null;
    const element = handle?.closest<HTMLElement>('[data-schedule-block]');
    if (!handle || !element || element.hidden) return;
    event.preventDefault();
    const direction = handle.dataset.resize;
    const start = Number(element.dataset.start);
    const duration = Number(element.dataset.duration);
    const end = start + duration;
    const onMove = (moveEvent: PointerEvent) => {
      const rect = grid.getBoundingClientRect();
      const slot = Math.max(0, Math.min(SLOT_COUNT, Math.round(((moveEvent.clientY - rect.top) / rect.height) * SLOT_COUNT)));
      const candidate = direction === 'top' ? { id: element.dataset.blockId ?? '', start: Math.min(slot, end - MIN_DURATION), duration: end - Math.min(slot, end - MIN_DURATION) } : { id: element.dataset.blockId ?? '', start, duration: Math.max(MIN_DURATION, Math.min(MAX_DURATION, Math.max(MIN_DURATION, slot - start))) };
      if (candidate.duration <= MAX_DURATION && canPlaceScheduleBlock(candidate, getScheduleState())) { updateScheduleBlock(element, candidate.start, candidate.duration); renderSchedule(); setScheduleStatus('UNSAVED CHANGES'); }
    };
    const onUp = () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const removeButton = target?.closest<HTMLButtonElement>('[data-remove-schedule-block]');
    if (removeButton) {
      const element = removeButton.closest<HTMLElement>('[data-schedule-block]');
      if (element) { element.dataset.active = 'false'; renderSchedule(); setScheduleStatus('UNSAVED CHANGES'); showToast('Block returned to available blocks'); }
      return;
    }
    if (target?.closest('[data-save-schedule]')) {
      localStorage.setItem(AGENDA_KEY, JSON.stringify(getScheduleState()));
      setScheduleStatus('SAVED JUST NOW');
      showToast('Agenda saved locally');
    }
    if (target?.closest('[data-export-schedule]')) exportSchedule();
    if (target?.closest('[data-reset-schedule]')) {
      if (!window.confirm('Reset the agenda to the Mini CCC default?')) return;
      getScheduleElements().forEach((element) => {
        const state = defaultState.find((block) => block.id === element.dataset.blockId);
        element.dataset.active = state ? 'true' : 'false';
        if (state) updateScheduleBlock(element, state.start, state.duration);
      });
      localStorage.removeItem(AGENDA_KEY);
      setScheduleStatus('DEFAULT AGENDA');
      renderSchedule();
      showToast('Default agenda restored');
    }
  });
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
initSchedule();
