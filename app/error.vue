<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);

useSeoMeta({ title: notFound.value ? 'Lost signal' : 'Something broke', robots: 'noindex' });
</script>

<template>
  <UApp>
    <div class="backdrop" aria-hidden="true" />
    <div class="grain" aria-hidden="true" />
    <SiteHeader />
    <main class="shell flex min-h-[60vh] flex-col items-start justify-center gap-6 py-20">
      <p class="eyebrow">Error {{ error.statusCode }}</p>
      <h1 class="display-title text-[clamp(3rem,10vw,8rem)]">
        {{ notFound ? 'Lost' : 'Short' }}<br><span class="glow-text">{{ notFound ? 'signal.' : 'circuit.' }}</span>
      </h1>
      <p class="max-w-md text-lg text-[var(--ink-soft)]">
        {{ notFound ? 'Nothing is broadcasting on this frequency.' : 'Something went wrong while loading this page.' }}
      </p>
      <UButton label="Back to the start" leading-icon="i-lucide-arrow-left" size="lg" @click="clearError({ redirect: '/' })" />
    </main>
    <SiteFooter />
  </UApp>
</template>
