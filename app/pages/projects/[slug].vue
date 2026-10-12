<script setup lang="ts">
import { getProject } from '~/data/projects';

const route = useRoute();
const project = getProject(String(route.params.slug));
if (!project) throw createError({ statusCode: 404, statusMessage: 'Build not found', fatal: true });

useSeoMeta({
  title: `${project.name} — build details`,
  description: project.summary,
  ogTitle: `${project.name} — build details — Mini CCC`,
  ogDescription: project.summary,
});
</script>

<template>
  <div v-if="project" :class="`accent-${project.accent}`">
    <section class="shell grid items-center gap-10 pt-10 pb-12 md:pt-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <div class="mb-8">
          <UButton to="/builds" icon="i-lucide-arrow-left" label="All builds" variant="link" color="neutral" class="px-0" />
        </div>
        <p class="eyebrow mb-5">{{ project.tag }}</p>
        <h1 class="display-title text-[clamp(2.5rem,6vw,5rem)]">{{ project.name }}</h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">{{ project.description }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <FavoriteButton :project-id="project.slug" :project-name="project.name" />
          <span class="font-mono text-sm">
            <span class="text-[var(--ink-soft)]">EST.</span> <span class="glow-text text-xl">€{{ project.total.toFixed(2) }}</span>
          </span>
        </div>
      </div>
      <div class="hud relative p-2">
        <BuildArt :project="project" variant="detail" />
        <div class="scan-sweep" aria-hidden="true" />
        <div class="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-white/80 uppercase">
          <span class="status-dot" aria-hidden="true" /> Build #{{ String(project.number).padStart(2, '0') }}
        </div>
      </div>
    </section>

    <div class="shell"><div class="tick-rule opacity-70" aria-hidden="true" /></div>

    <section v-if="project.buildSteps?.length" class="shell grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-labelledby="build-plan-title">
      <div>
        <p class="eyebrow mb-4">Build plan</p>
        <h2 id="build-plan-title" class="display-title text-4xl md:text-5xl">Make it<br><span class="glow-text">your own.</span></h2>
        <dl class="mt-8 grid gap-4 font-mono text-xs uppercase">
          <div v-if="project.buildTime">
            <dt class="tracking-[0.14em] text-[var(--ink-soft)]">Build time</dt>
            <dd class="mt-1 text-sm normal-case">{{ project.buildTime }}</dd>
          </div>
          <div v-if="project.protocol">
            <dt class="tracking-[0.14em] text-[var(--ink-soft)]">Main interface</dt>
            <dd class="mt-1 text-sm normal-case">{{ project.protocol }}</dd>
          </div>
        </dl>
      </div>
      <div>
        <ol class="grid gap-3">
          <li v-for="(step, index) in project.buildSteps" :key="index" class="hud flex gap-4 p-4">
            <span class="font-mono text-xs text-[var(--accent)]">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="leading-relaxed">{{ step }}</span>
          </li>
        </ol>
        <ul v-if="project.buildNotes?.length" class="mt-6 grid gap-2 border-l border-[var(--accent)] pl-5 text-sm text-[var(--ink-soft)]">
          <li v-for="(note, index) in project.buildNotes" :key="index">{{ note }}</li>
        </ul>
      </div>
    </section>

    <section class="shell grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-labelledby="parts-title">
      <div>
        <p class="eyebrow mb-4">Bill of materials</p>
        <h2 id="parts-title" class="display-title text-4xl md:text-5xl">Parts list</h2>
        <p v-if="project.number >= 28" class="mt-6 max-w-sm text-sm text-[var(--ink-soft)]">
          BerryBase parts were listed in stock on 1 Oct 2026. Stock and prices can change; workshop materials are listed separately.
        </p>
      </div>
      <div class="hud">
        <div class="flex justify-between border-b border-[var(--hairline)] px-5 py-3 font-mono text-[0.625rem] tracking-[0.16em] text-[var(--ink-soft)] uppercase">
          <span>Item</span><span>Cost</span>
        </div>
        <ul>
          <li v-for="item in project.items" :key="item.number" class="flex items-start justify-between gap-4 border-b border-[var(--hairline)] px-5 py-4 last:border-b-0">
            <div class="flex gap-4">
              <span class="font-mono text-xs text-[var(--accent)]">{{ String(item.number).padStart(2, '0') }}</span>
              <div>
                <span class="leading-snug">{{ item.name }}</span>
                <small v-if="item.availability" class="mt-1 block text-xs text-[var(--ink-soft)]">{{ item.availability }}</small>
              </div>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <strong class="font-mono text-sm font-medium">€{{ item.cost.toFixed(2) }}</strong>
              <UButton
                v-if="item.url"
                :to="item.url"
                target="_blank"
                rel="noreferrer"
                icon="i-lucide-external-link"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="`Buy ${item.name}`"
              />
              <span v-else class="font-mono text-[0.625rem] tracking-[0.12em] text-[var(--ink-soft)] uppercase">workshop</span>
            </div>
          </li>
        </ul>
        <div class="flex items-center justify-between border-t border-[var(--hairline-strong)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-5 py-4">
          <span class="font-mono text-[0.6875rem] tracking-[0.16em] uppercase">Estimated build total</span>
          <strong class="glow-text font-mono text-xl font-medium">€{{ project.total.toFixed(2) }}</strong>
        </div>
      </div>
    </section>

    <section class="shell">
      <div class="hud flex flex-wrap items-center justify-between gap-6 p-8 md:p-10">
        <h2 class="display-title text-3xl md:text-4xl">Find the next<br><span class="glow-text">rabbit hole.</span></h2>
        <UButton to="/builds" label="Back to all builds" leading-icon="i-lucide-arrow-left" size="lg" />
      </div>
    </section>
  </div>
</template>
