<script setup lang="ts">
import { projects } from '~/data/projects';

useSeoMeta({
  title: 'Builds',
  description: 'A catalogue of tiny electronics builds for Mini CCC.',
  ogTitle: 'Builds — Mini CCC',
  ogDescription: 'A catalogue of tiny electronics builds for Mini CCC.',
});

const ordered = [...projects].sort((a, b) => {
  const featured = (a.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.featuredRank ?? Number.MAX_SAFE_INTEGER);
  return featured || b.votes - a.votes;
});

const filters = [
  { value: 'all', label: 'All builds' },
  { value: 'play', label: 'Play' },
  { value: 'glow', label: 'Glow' },
  { value: 'signal', label: 'Signal' },
  { value: 'sound', label: 'Sound' },
  { value: 'sensor', label: 'Sensors' },
  { value: 'favorites', label: 'Favorites', icon: 'i-lucide-heart' },
];

const search = ref('');
const active = ref('all');
const { favorites } = useFavorites();
const toast = useToast();

const visible = computed(() => {
  const query = search.value.trim().toLowerCase();
  // A search looks across every build, regardless of the selected filter.
  if (query) return ordered.filter((project) => `${project.name} ${project.summary}`.toLowerCase().includes(query));
  if (active.value === 'favorites') return ordered.filter((project) => favorites.value.includes(project.slug));
  if (active.value === 'all') return ordered;
  return ordered.filter((project) => project.kind === active.value);
});

const visibleSlugs = computed(() => new Set(visible.value.map((project) => project.slug)));
const favoriteTitles = computed(() => ordered.filter((project) => favorites.value.includes(project.slug)).map((project) => project.name));

function exportFavorites() {
  const titles = favoriteTitles.value;
  downloadText('mini-ccc-favorites.txt', titles.length ? `${titles.join('\n')}\n` : '');
  toast.add({ title: `${titles.length} ${titles.length === 1 ? 'saved title' : 'saved titles'} exported`, icon: 'i-lucide-download' });
}
</script>

<template>
  <div>
    <PageHero eyebrow="Catalogue · 02" title="The build" title-accent="list." accent="blue">
      <template #aside>
        <dl class="hud grid grid-cols-2 gap-px bg-[var(--hairline)] font-mono text-xs uppercase">
          <div class="bg-[var(--panel-raised)] px-5 py-4">
            <dt class="tracking-[0.14em] text-[var(--ink-soft)]">Builds</dt>
            <dd class="mt-1 text-2xl text-[var(--ink)]">{{ projects.length }}</dd>
          </div>
          <div class="bg-[var(--panel-raised)] px-5 py-4">
            <dt class="tracking-[0.14em] text-[var(--ink-soft)]">From</dt>
            <dd class="mt-1 text-2xl text-[var(--ink)]">€{{ Math.min(...projects.map((p) => p.total)).toFixed(0) }}</dd>
          </div>
        </dl>
      </template>
    </PageHero>

    <section class="shell">
      <div class="mb-8 flex flex-wrap items-center gap-3">
        <UInput
          v-model="search"
          type="search"
          icon="i-lucide-search"
          placeholder="Search the catalogue"
          aria-label="Search the catalogue"
          class="w-full sm:w-72"
        />
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects">
          <UButton
            v-for="filter in filters"
            :key="filter.value"
            :icon="filter.icon"
            :label="filter.label"
            :color="active === filter.value ? 'primary' : 'neutral'"
            :variant="active === filter.value ? 'solid' : 'outline'"
            size="md"
            :aria-pressed="active === filter.value"
            @click="active = filter.value"
          />
        </div>
        <span class="ml-auto font-mono text-xs tracking-[0.14em] text-[var(--ink-soft)] uppercase" aria-live="polite">
          {{ visible.length }} {{ visible.length === 1 ? 'build' : 'builds' }}
        </span>
      </div>

      <!-- Every card is rendered so the prerender crawler sees every build link; filtering only hides them. -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProjectCard v-for="project in ordered" v-show="visibleSlugs.has(project.slug)" :key="project.slug" :project="project" />
      </div>

      <div v-if="active === 'favorites' && !search" class="mt-8 flex justify-center">
        <UButton
          label="Export favorite titles"
          trailing-icon="i-lucide-download"
          :disabled="favoriteTitles.length === 0"
          @click="exportFavorites"
        />
      </div>

      <div v-if="visible.length === 0" class="hud mx-auto mt-4 max-w-xl overflow-hidden text-center">
        <div class="relative h-48"><ProjectViz visual="radar" accent="lime" /></div>
        <div class="px-6 py-8">
          <h3 class="text-xl font-semibold">No builds on this frequency.</h3>
          <p class="mt-2 text-[var(--ink-soft)]">Try another search, or favorite a few builds to start your shortlist.</p>
        </div>
      </div>
    </section>
  </div>
</template>
