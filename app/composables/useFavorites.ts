const FAVORITES_KEY = 'mini-ccc-favorites';

/**
 * Favorite builds live in this browser's localStorage only. The list starts
 * empty during prerender and is read once the page hydrates.
 */
export function useFavorites() {
  const favorites = useState<string[]>('favorites', () => []);
  const loaded = useState('favorites-loaded', () => false);

  onMounted(() => {
    if (loaded.value) return;
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
      if (Array.isArray(stored)) favorites.value = stored.filter((id): id is string => typeof id === 'string');
    } catch {}
    loaded.value = true;
  });

  function persist() {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value)); } catch {}
  }

  function isFavorite(id: string) {
    return favorites.value.includes(id);
  }

  function toggle(id: string) {
    favorites.value = isFavorite(id) ? favorites.value.filter((item) => item !== id) : [...favorites.value, id];
    persist();
    return isFavorite(id);
  }

  return { favorites: readonly(favorites), loaded: readonly(loaded), isFavorite, toggle };
}
