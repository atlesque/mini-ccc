const FAVORITES_KEY = 'mini-ccc-favorites';
const VOTES_KEY = 'mini-ccc-votes';

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

function updateVoteUi() {
  const votes = readJson<Record<string, number>>(VOTES_KEY, {});
  document.querySelectorAll<HTMLElement>('[data-vote-button]').forEach((button) => {
    const id = button.dataset.voteId;
    if (!id) return;
    const initial = Number(button.dataset.baseVotes ?? button.closest('[data-vote-count]')?.getAttribute('data-vote-count') ?? 0);
    const count = votes[id] ?? initial;
    const voted = Boolean(readJson<string[]>(`${VOTES_KEY}-voted`, []).includes(id));
    button.classList.toggle('is-voted', voted);
    const label = button.querySelector('[data-vote-label]');
    if (label) label.textContent = `${voted ? 'Voted' : 'Vote'} ${count}`;
    button.setAttribute('aria-pressed', String(voted));
    button.dataset.currentVotes = String(count);
  });
}

function sortCards() {
  const grid = document.querySelector<HTMLElement>('[data-project-grid]');
  if (!grid) return;
  const favorites = readFavorites();
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-project-card]')];
  cards.sort((a, b) => {
    const aSaved = favorites.has(a.dataset.projectId ?? '') ? 1 : 0;
    const bSaved = favorites.has(b.dataset.projectId ?? '') ? 1 : 0;
    if (aSaved !== bSaved) return bSaved - aSaved;
    return Number(b.dataset.currentVotes ?? b.dataset.voteCount ?? 0) - Number(a.dataset.currentVotes ?? a.dataset.voteCount ?? 0);
  });
  cards.forEach((card) => grid.appendChild(card));
}

function applyFilters() {
  const search = document.querySelector<HTMLInputElement>('[data-project-search]')?.value.trim().toLowerCase() ?? '';
  const active = document.querySelector<HTMLElement>('[data-filter-button].is-active')?.dataset.filter ?? 'all';
  const favorites = readFavorites();
  let visible = 0;
  document.querySelectorAll<HTMLElement>('[data-project-card]').forEach((card) => {
    const matchesSearch = !search || `${card.dataset.title} ${card.dataset.summary}`.includes(search);
    const matchesKind = active === 'all' || active === 'favorites' ? true : card.dataset.kind === active;
    const matchesFavorites = active !== 'favorites' || favorites.has(card.dataset.projectId ?? '');
    const show = matchesSearch && matchesKind && matchesFavorites;
    card.hidden = !show;
    if (show) visible += 1;
  });
  const count = document.querySelector<HTMLElement>('[data-project-count]');
  if (count) count.textContent = `${visible} ${visible === 1 ? 'build' : 'builds'}`;
  const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
  if (empty) empty.hidden = visible > 0;
}

function setTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('mini-ccc-theme', theme); } catch {}
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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
    writeFavorites(favorites);
    updateFavoriteUi();
    sortCards();
    applyFilters();
    return;
  }

  const voteButton = target?.closest<HTMLButtonElement>('[data-vote-button]');
  if (voteButton) {
    event.preventDefault();
    const id = voteButton.dataset.voteId;
    if (!id) return;
    const votedIds = new Set(readJson<string[]>(`${VOTES_KEY}-voted`, []));
    const votes = readJson<Record<string, number>>(VOTES_KEY, {});
    const initial = Number(voteButton.dataset.baseVotes ?? voteButton.closest('[data-vote-count]')?.getAttribute('data-vote-count') ?? 0);
    const current = votes[id] ?? initial;
    if (votedIds.has(id)) {
      votedIds.delete(id);
      votes[id] = Math.max(initial, current - 1);
    } else {
      votedIds.add(id);
      votes[id] = current + 1;
    }
    localStorage.setItem(`${VOTES_KEY}-voted`, JSON.stringify([...votedIds]));
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    updateVoteUi();
    sortCards();
    return;
  }

  const themeButton = target?.closest<HTMLButtonElement>('[data-theme-toggle]');
  if (themeButton) {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  const filterButton = target?.closest<HTMLButtonElement>('[data-filter-button]');
  if (filterButton) {
    document.querySelectorAll('[data-filter-button]').forEach((button) => button.classList.remove('is-active'));
    filterButton.classList.add('is-active');
    applyFilters();
  }
});

document.querySelector<HTMLInputElement>('[data-project-search]')?.addEventListener('input', applyFilters);

const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
setTheme(theme);
updateFavoriteUi();
updateVoteUi();
sortCards();
applyFilters();
