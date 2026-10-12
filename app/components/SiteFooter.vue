<script setup lang="ts">
const year = 2026;
</script>

<template>
  <footer class="relative mt-24 border-t border-[var(--hairline)]">
    <div class="tick-rule opacity-60" aria-hidden="true" />
    <div class="shell flex flex-wrap items-center justify-between gap-4 py-8 font-mono text-[0.6875rem] tracking-[0.14em] text-[var(--ink-soft)] uppercase">
      <div class="flex items-center gap-3">
        <span class="status-dot" aria-hidden="true" />
        <span>Mini CCC {{ year }} · tiny builds, big signal</span>
      </div>
      <div class="flex items-center gap-5">
        <NuxtLink to="/schedule" class="hover:text-[var(--acid)]">Agenda</NuxtLink>
        <NuxtLink to="/builds" class="hover:text-[var(--acid)]">Builds</NuxtLink>
        <span aria-hidden="true">Static · served from the edge</span>
      </div>
    </div>
  </footer>
</template>
