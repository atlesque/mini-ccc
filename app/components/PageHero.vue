<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string; title: string; titleAccent?: string; accent?: string }>(), { accent: 'lime' });
</script>

<template>
  <section class="shell pt-12 pb-10 md:pt-20 md:pb-14" :class="`accent-${accent}`">
    <div class="flex flex-wrap items-end justify-between gap-8">
      <div class="min-w-0 flex-1">
        <p v-if="eyebrow" class="eyebrow mb-5">{{ eyebrow }}</p>
        <h1 class="display-title text-[clamp(2.75rem,7vw,6rem)]">
          {{ title }}<template v-if="titleAccent"><br><span class="glow-text">{{ titleAccent }}</span></template>
        </h1>
        <div v-if="$slots.default" class="mt-6 max-w-2xl text-base text-[var(--ink-soft)] md:text-lg">
          <slot />
        </div>
        <div v-if="$slots.actions" class="mt-8 flex flex-wrap gap-3">
          <slot name="actions" />
        </div>
      </div>
      <slot name="aside" />
    </div>
    <div class="tick-rule mt-10 opacity-70" aria-hidden="true" />
  </section>
</template>
