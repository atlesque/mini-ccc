<script setup lang="ts">
import { cocktails, videos } from '~/data/content';
import { projects } from '~/data/projects';
import { agenda, formatSlot } from '~/data/schedule';

useSeoMeta({
  title: 'Mini CCC — that’s a wrap for 2026',
  description: 'The 2026 edition of Mini CCC has passed. Browse the builds, cocktails and videos, and see you next year.',
  ogTitle: 'Mini CCC — that’s a wrap for 2026',
  ogDescription: 'The 2026 edition of Mini CCC has passed. Browse the builds, cocktails and videos, and see you next year.',
});

const stats = [
  { label: 'Builds', value: projects.length, to: '/builds' },
  { label: 'Cocktails', value: cocktails.length, to: '/cocktails' },
  { label: 'Videos', value: videos.length, to: '/videos' },
  { label: 'Hours', value: 12, to: '/schedule' },
];

const destinations = [
  { to: '/schedule', index: '01', label: 'Archive', title: 'Schedule', description: 'How the 2026 day ran, from 10:00 to 22:00.', accent: 'lime', icon: 'i-lucide-calendar-clock' },
  { to: '/builds', index: '02', label: 'Catalogue', title: 'Builds', description: 'Electronics projects with parts lists and costs.', accent: 'blue', icon: 'i-lucide-cpu' },
  { to: '/cocktails', index: '03', label: 'Bar', title: 'Cocktails', description: 'Club-Mate recipes and a shopping list.', accent: 'orange', icon: 'i-lucide-martini' },
  { to: '/videos', index: '04', label: 'Watch list', title: 'Videos', description: 'YouTube videos to watch together.', accent: 'pink', icon: 'i-lucide-tv-minimal-play' },
];

const featured = [...projects]
  .filter((project) => project.featuredRank !== undefined)
  .sort((a, b) => a.featuredRank! - b.featuredRank!)
  .slice(0, 4);
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="overflow-x-clip">
    <section class="shell relative grid items-center gap-12 pt-12 pb-16 md:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:pb-24">
      <SignalRings class="absolute top-1/2 right-[-10rem] -z-10 hidden w-[44rem] -translate-y-1/2 opacity-60 lg:block" />

      <div>
        <p class="eyebrow mb-8">2026 edition · That’s a wrap</p>
        <h1 class="display-title text-[clamp(4.5rem,15vw,11.5rem)] leading-[0.8]">
          <span class="block">mini</span>
          <span class="glow-text block animate-[flicker_7s_steps(1)_infinite]">CCC</span>
        </h1>
        <p class="mt-8 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
          The 2026 edition has passed. Thanks for building, mixing and watching along.
          <strong class="font-semibold text-[var(--ink)]">See you next year.</strong>
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
          <UButton to="/builds" label="Browse the builds" trailing-icon="i-lucide-arrow-right" size="xl" />
          <UButton to="/schedule" label="Look back at the agenda" color="neutral" variant="outline" size="xl" />
        </div>
      </div>

      <!-- Signal console -->
      <aside class="hud accent-lime relative overflow-hidden" aria-label="2026 edition recap">
        <div class="scan-sweep" aria-hidden="true" />
        <div class="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">
          <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-[var(--ink-soft)]" aria-hidden="true" /> Signal off</span>
          <span>CH-26</span>
        </div>

        <div class="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-6 px-5 pt-6 pb-5">
          <div>
            <p class="font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">Edition</p>
            <p class="mt-1 font-mono text-4xl tabular-nums md:text-5xl">2026</p>
          </div>
          <div class="min-w-0 text-right">
            <p class="font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">Broadcast ended</p>
            <p class="glow-text mt-1 truncate text-xl font-semibold">See you next year</p>
            <p class="mt-1 truncate font-mono text-[0.6875rem] text-[var(--ink-soft)]">
              Next transmission: 2027
            </p>
          </div>
        </div>

        <!-- Agenda strip -->
        <div class="px-5 pb-6">
          <div class="relative flex h-9 gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)]">
            <NuxtLink
              v-for="block in agenda"
              :key="block.label"
              to="/schedule"
              :title="`${block.label} · ${formatSlot(block.start)}—${formatSlot(block.start + block.duration)}`"
              class="relative bg-[color-mix(in_oklab,var(--accent)_30%,var(--panel-raised))] transition-[filter] hover:brightness-125"
              :class="`accent-${block.accent}`"
              :style="{ flexGrow: block.duration, flexBasis: 0 }"
            >
              <span class="sr-only">{{ block.label }}</span>
              <span class="absolute inset-x-0 top-0 h-0.5 bg-[var(--accent)]" />
            </NuxtLink>
          </div>
          <div class="mt-2 flex justify-between font-mono text-[0.5625rem] text-[var(--ink-soft)]" aria-hidden="true">
            <span>10:00</span><span>13:00</span><span>16:00</span><span>19:00</span><span>22:00</span>
          </div>
        </div>

        <dl class="grid grid-cols-4 border-t border-[var(--hairline)]">
          <NuxtLink v-for="stat in stats" :key="stat.label" :to="stat.to" class="group border-r border-[var(--hairline)] px-4 py-4 last:border-r-0 hover:bg-[color-mix(in_oklab,var(--acid)_6%,transparent)]">
            <dt class="font-mono text-[0.5625rem] tracking-[0.16em] text-[var(--ink-soft)] uppercase">{{ stat.label }}</dt>
            <dd class="mt-1 font-mono text-2xl tabular-nums group-hover:text-[var(--acid)]">{{ String(stat.value).padStart(2, '0') }}</dd>
          </NuxtLink>
        </dl>
      </aside>
    </section>
    </div>

    <SignalTicker />

    <!-- Destinations -->
    <section class="shell pt-16" aria-labelledby="destinations-title">
      <h2 id="destinations-title" class="sr-only">Sections</h2>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink
          v-for="destination in destinations"
          :key="destination.to"
          :to="destination.to"
          class="hud hud-interactive group relative flex min-h-56 flex-col p-6 max-sm:min-h-0 max-sm:p-5"
          :class="`accent-${destination.accent}`"
        >
          <span class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <span class="absolute -right-3 -bottom-10 font-mono text-[9rem] leading-none font-semibold text-[var(--accent)] opacity-[0.07] transition-opacity group-hover:opacity-[0.16]">{{ destination.index }}</span>
          </span>
          <div class="flex items-center justify-between">
            <span class="grid size-11 place-items-center border border-[var(--hairline-strong)] text-[var(--accent)] transition-shadow group-hover:shadow-[0_0_24px_-6px_var(--accent)]">
              <UIcon :name="destination.icon" class="size-5" />
            </span>
            <UIcon name="i-lucide-arrow-up-right" class="size-5 text-[var(--ink-soft)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
          </div>
          <div class="mt-auto pt-10 max-sm:pt-5">
            <p class="eyebrow mb-3">{{ destination.index }} · {{ destination.label }}</p>
            <h3 class="text-3xl font-semibold tracking-tight">{{ destination.title }}</h3>
            <p class="mt-2 text-[var(--ink-soft)]">{{ destination.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured builds -->
    <section class="shell pt-24" aria-labelledby="featured-title">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow mb-4" style="--accent: var(--signal-blue)">On the bench</p>
          <h2 id="featured-title" class="display-title text-4xl md:text-5xl">Featured <span class="glow-text" style="--accent: var(--signal-blue)">builds</span></h2>
        </div>
        <UButton to="/builds" :label="`All ${projects.length} builds`" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" />
      </div>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ProjectCard v-for="project in featured" :key="project.slug" :project="project" />
      </div>
    </section>
  </div>
</template>
