<script setup lang="ts">
import { cocktails, videos } from '~/data/content';
import { projects } from '~/data/projects';
import { SLOT_COUNT, agenda, formatSlot } from '~/data/schedule';

useSeoMeta({
  title: 'Mini CCC — tiny builds, big signal',
  description: 'A tiny home conference for making, watching, mixing, and moving at your own pace.',
  ogTitle: 'Mini CCC — tiny builds, big signal',
  ogDescription: 'A tiny home conference for making, watching, mixing, and moving at your own pace.',
});

const { slot, current, next, clock } = useNow();

const stats = [
  { label: 'Builds', value: projects.length, to: '/builds' },
  { label: 'Cocktails', value: cocktails.length, to: '/cocktails' },
  { label: 'Videos', value: videos.length, to: '/videos' },
  { label: 'Hours', value: 12, to: '/schedule' },
];

const destinations = [
  { to: '/schedule', index: '01', label: 'Plan the day', title: 'Schedule', description: 'Twelve hours from 10:00 to 22:00, with room left to wander.', accent: 'lime', icon: 'i-lucide-calendar-clock' },
  { to: '/builds', index: '02', label: 'Make something', title: 'Builds', description: 'Tiny electronics projects with big enough ideas.', accent: 'blue', icon: 'i-lucide-cpu' },
  { to: '/cocktails', index: '03', label: 'Take a break', title: 'Cocktails', description: 'Club-Mate serves for staying bright and curious.', accent: 'orange', icon: 'i-lucide-martini' },
  { to: '/videos', index: '04', label: 'Watch together', title: 'Videos', description: 'A short list of rabbit holes worth sharing.', accent: 'pink', icon: 'i-lucide-tv-minimal-play' },
];

const featured = [...projects]
  .filter((project) => project.featuredRank !== undefined)
  .sort((a, b) => a.featuredRank! - b.featuredRank!)
  .slice(0, 4);

const statusLine = computed(() => {
  if (slot.value === null && next.value) return { label: 'Doors open', value: formatSlot(next.value.start) };
  if (slot.value === null) return { label: 'Off air', value: 'See you at 10:00' };
  return { label: 'On air now', value: current.value?.label ?? 'Open time' };
});
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="overflow-x-clip">
    <section class="shell relative grid items-center gap-12 pt-12 pb-16 md:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:pb-24">
      <SignalRings class="absolute top-1/2 right-[-10rem] -z-10 hidden w-[44rem] -translate-y-1/2 opacity-60 lg:block" />

      <div>
        <p class="eyebrow mb-8">Home hacker conference · {{ formatSlot(0) }}—{{ formatSlot(SLOT_COUNT) }}</p>
        <h1 class="display-title text-[clamp(4.5rem,15vw,11.5rem)] leading-[0.8]">
          <span class="block">mini</span>
          <span class="glow-text block animate-[flicker_7s_steps(1)_infinite]">CCC</span>
        </h1>
        <p class="mt-8 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
          A tiny home conference for friends, prototypes and wonderfully unnecessary electronics. Make, watch, mix and move at your own pace.
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
          <UButton to="/schedule" label="See the agenda" trailing-icon="i-lucide-arrow-right" size="xl" />
          <UButton to="/builds" label="Browse builds" color="neutral" variant="outline" size="xl" />
        </div>
      </div>

      <!-- Signal console -->
      <aside class="hud accent-lime relative overflow-hidden" aria-label="Event status">
        <div class="scan-sweep" aria-hidden="true" />
        <div class="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">
          <span class="flex items-center gap-2"><span class="status-dot" aria-hidden="true" /> Signal console</span>
          <span>CH-26</span>
        </div>

        <div class="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-6 px-5 pt-6 pb-5">
          <div>
            <p class="font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">Local time</p>
            <p class="mt-1 font-mono text-4xl tabular-nums md:text-5xl">{{ clock }}</p>
          </div>
          <div class="min-w-0 text-right">
            <p class="font-mono text-[0.625rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase">{{ statusLine.label }}</p>
            <p class="glow-text mt-1 truncate text-xl font-semibold">{{ statusLine.value }}</p>
            <p v-if="next && slot !== null" class="mt-1 truncate font-mono text-[0.6875rem] text-[var(--ink-soft)]">
              Next: {{ next.label }} · {{ formatSlot(next.start) }}
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
            <span
              v-if="slot !== null"
              aria-hidden="true"
              class="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--ink)] shadow-[0_0_10px_var(--acid)]"
              :style="{ left: `${(slot / SLOT_COUNT) * 100}%` }"
            />
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
    <section class="shell pt-20" aria-labelledby="destinations-title">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 id="destinations-title" class="display-title text-4xl md:text-5xl">Pick a<br><span class="glow-text">frequency.</span></h2>
        <p class="max-w-sm text-[var(--ink-soft)]">Four channels, one long day. Drift between them whenever the room changes mood.</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink
          v-for="destination in destinations"
          :key="destination.to"
          :to="destination.to"
          class="hud hud-interactive group relative flex min-h-72 flex-col p-6"
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
          <div class="mt-auto pt-10">
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
          <h2 id="featured-title" class="display-title text-4xl md:text-5xl">Featured<br><span class="glow-text" style="--accent: var(--signal-blue)">builds.</span></h2>
        </div>
        <UButton to="/builds" :label="`All ${projects.length} builds`" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" />
      </div>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ProjectCard v-for="project in featured" :key="project.slug" :project="project" />
      </div>
    </section>
  </div>
</template>
