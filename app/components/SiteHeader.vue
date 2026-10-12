<script setup lang="ts">
const route = useRoute();

const links = [
  { to: '/schedule', label: 'Schedule', index: '01' },
  { to: '/builds', label: 'Builds', index: '02' },
  { to: '/cocktails', label: 'Cocktails', index: '03' },
  { to: '/videos', label: 'Videos', index: '04' },
];

function isActive(to: string) {
  return route.path === to || (to === '/builds' && route.path.startsWith('/projects/'));
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[color-mix(in_oklab,var(--panel)_78%,transparent)] backdrop-blur-md">
    <div class="shell flex items-center justify-between gap-4 py-3 max-md:flex-wrap">
      <NuxtLink to="/" class="flex items-center gap-2.5 text-xl font-medium tracking-tight" aria-label="Mini CCC home">
        <BrandMark />
        <span>mini <strong class="font-semibold">CCC</strong></span>
      </NuxtLink>

      <nav aria-label="Main navigation" class="max-md:order-3 max-md:-mx-1 max-md:w-full max-md:overflow-x-auto">
        <ul class="flex items-center gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              :aria-current="isActive(link.to) ? 'page' : undefined"
              class="group relative flex items-baseline gap-1.5 px-2 py-2 sm:px-3 font-mono text-xs tracking-[0.14em] uppercase transition-colors"
              :class="isActive(link.to) ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'"
            >
              <span class="hidden text-[0.6rem] text-[var(--acid)] opacity-70 sm:inline">{{ link.index }}</span>
              {{ link.label }}
              <span
                class="absolute inset-x-2 -bottom-px sm:inset-x-3 h-px origin-left bg-[var(--acid)] shadow-[0_0_8px_var(--acid)] transition-transform duration-300"
                :class="isActive(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>
