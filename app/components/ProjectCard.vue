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
    <NuxtLink :to="`/projects/${project.slug}`" class="flex flex-1 flex-col">
      <div class="flex items-center justify-between px-4 pt-3.5 pb-3">
        <span class="eyebrow">{{ categoryLabels[project.kind] ?? project.kind }}</span>
        <span class="font-mono text-[0.625rem] tracking-[0.14em] text-[var(--ink-soft)]">#{{ String(project.number).padStart(2, '0') }}</span>
      </div>
      <BuildArt :project="project" class="mx-4" />
      <div class="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5">
        <h3 class="flex items-start justify-between gap-3 text-lg leading-tight font-semibold tracking-tight">
          {{ project.name }}
          <UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 shrink-0 text-[var(--ink-soft)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
        </h3>
        <p class="text-sm leading-relaxed text-[var(--ink-soft)]">{{ project.summary }}</p>
      </div>
    </NuxtLink>
    <div class="flex items-center justify-between gap-2 border-t border-[var(--hairline)] py-2 pr-2 pl-4">
      <span class="font-mono text-sm">€{{ project.total.toFixed(2) }} <small class="text-[var(--ink-soft)]">/ build</small></span>
      <FavoriteButton :project-id="project.slug" :project-name="project.name" compact />
    </div>
  </article>
</template>
