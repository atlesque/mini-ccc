<script setup lang="ts">
import { agenda, formatSlot } from '~/data/schedule';

const items: string[] = [...agenda].sort((a, b) => a.start - b.start).map((block) => `${formatSlot(block.start)} ${block.label}`);
items.push('2026 edition complete', 'See you next year');
</script>

<template>
  <div class="shell" aria-hidden="true">
    <div class="relative overflow-hidden border-y border-[var(--hairline)] py-3">
      <div class="marquee-track">
        <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
          <span v-for="item in items" :key="item" class="flex items-center gap-6 pr-6 font-mono text-xs tracking-[0.2em] text-[var(--ink-soft)] uppercase">
            {{ item }}
            <span class="text-[var(--acid)]">✦</span>
          </span>
        </div>
      </div>
      <div class="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--panel)] to-transparent" />
      <div class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--panel)] to-transparent" />
    </div>
  </div>
</template>
