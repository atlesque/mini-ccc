<script setup lang="ts">
const phrases = [
  'Build something tiny',
  'Solder responsibly',
  'Mate is a food group',
  'Open time is a feature',
  'Blink an LED, change your life',
  'No cloud, just signal',
  'Every build ships with a parts list',
];
</script>

<template>
  <div class="relative overflow-hidden border-y border-[var(--hairline)] bg-[color-mix(in_oklab,var(--panel-raised)_70%,transparent)] py-3" aria-hidden="true">
    <div class="marquee-track">
      <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <span v-for="phrase in phrases" :key="phrase" class="flex items-center gap-6 pr-6 font-mono text-xs tracking-[0.2em] text-[var(--ink-soft)] uppercase">
          {{ phrase }}
          <span class="text-[var(--acid)]">✦</span>
        </span>
      </div>
    </div>
    <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--panel)] to-transparent" />
    <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--panel)] to-transparent" />
  </div>
</template>
