<template>
  <footer class="relative mt-24 border-t border-[var(--hairline)]">
    <div class="shell flex flex-wrap items-center justify-between gap-4 py-8 font-mono text-[0.6875rem] tracking-[0.14em] text-[var(--ink-soft)] uppercase">
      <div class="flex items-center gap-3">
        <span class="status-dot" aria-hidden="true" />
        <span>Mini CCC</span>
      </div>
      <div class="flex flex-wrap items-center gap-x-5">
        <NuxtLink to="/schedule" class="py-2 hover:text-[var(--acid)]">Schedule</NuxtLink>
        <NuxtLink to="/builds" class="py-2 hover:text-[var(--acid)]">Builds</NuxtLink>
        <NuxtLink to="/cocktails" class="py-2 hover:text-[var(--acid)]">Cocktails</NuxtLink>
        <NuxtLink to="/videos" class="py-2 hover:text-[var(--acid)]">Videos</NuxtLink>
      </div>
    </div>
  </footer>
</template>
