<script setup lang="ts">
import type { Project } from '~/data/projects';

defineProps<{ project: Project }>();

const categoryLabels: Record<string, string> = {
  play: 'Play',
  glow: 'Glow',
  signal: 'Signal',
  sound: 'Sound',
  sensor: 'Sensors',
  interface: 'Interface',
  badge: 'Badge',
};
</script>

<template>
  <article class="hud hud-interactive group flex flex-col" :class="`accent-${project.accent}`">
    <!-- Phones get a compact row (thumbnail beside the text) so the 30-build list stays scannable. -->
    <NuxtLink :to="`/projects/${project.slug}`" class="flex flex-1 flex-col max-sm:grid max-sm:grid-cols-[7.5rem_minmax(0,1fr)] max-sm:items-start max-sm:gap-3 max-sm:p-3">
      <div class="flex items-center justify-between px-4 pt-3.5 pb-3 max-sm:hidden">
        <span class="eyebrow">{{ categoryLabels[project.kind] ?? project.kind }}</span>
        <span class="font-mono text-[0.625rem] tracking-[0.14em] text-[var(--ink-soft)]">#{{ String(project.number).padStart(2, '0') }}</span>
      </div>
      <BuildArt :project="project" class="mx-4 max-sm:mx-0" />
      <div class="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5 max-sm:gap-1 max-sm:p-0">
        <span class="eyebrow sm:hidden">{{ categoryLabels[project.kind] ?? project.kind }}</span>
        <h3 class="flex items-start justify-between gap-3 text-lg leading-tight font-semibold tracking-tight max-sm:text-base">
          {{ project.name }}
          <UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 shrink-0 text-[var(--ink-soft)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
        </h3>
        <p class="text-sm leading-relaxed text-[var(--ink-soft)] max-sm:line-clamp-2 max-sm:text-xs">{{ project.summary }}</p>
      </div>
    </NuxtLink>
    <div class="flex items-center justify-between gap-2 border-t border-[var(--hairline)] py-2 pr-2 pl-4">
      <span class="font-mono text-sm">€{{ project.total.toFixed(2) }} <small class="text-[var(--ink-soft)]">/ build</small></span>
      <FavoriteButton :project-id="project.slug" :project-name="project.name" compact />
    </div>
  </article>
</template>
